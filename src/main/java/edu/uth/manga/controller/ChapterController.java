package edu.uth.manga.controller;

import edu.uth.manga.dto.request.ChapterRequest;
import edu.uth.manga.dto.response.ApiResponse;
import edu.uth.manga.entity.Chapter;
import edu.uth.manga.enums.ChapterStatus;
import edu.uth.manga.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chapters")
@RequiredArgsConstructor
public class ChapterController {
    private final ChapterService chapterService;

    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD', 'CREATOR')")
    @PostMapping
    public ResponseEntity<Chapter> create(@RequestBody ChapterRequest request) {
        return ResponseEntity.ok(chapterService.createChapter(request));
    }

    @GetMapping("/manga/{mangaId}")
    public ResponseEntity<List<Chapter>> getByManga(@PathVariable Long mangaId) {
        return ResponseEntity.ok(chapterService.getChaptersByManga(mangaId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD', 'CREATOR', 'EDITOR')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<Chapter> changeStatus(
            @PathVariable Long id,
            @RequestParam ChapterStatus status,
            Authentication authentication) {
        boolean approver = hasAnyRole(authentication, "ROLE_ADMIN", "ROLE_TEAM_LEAD");
        if ((status == ChapterStatus.SCHEDULED || status == ChapterStatus.REJECTED) && !approver) {
            throw new AccessDeniedException("Only ADMIN or TEAM_LEAD can approve or reject chapters.");
        }

        return ResponseEntity.ok(chapterService.updateWorkflowStatus(id, status));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.ok("Xoa chuong thanh cong!");
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @PatchMapping("/{id}/publish")
    public ApiResponse<Object> publishChapter(@PathVariable Long id) {
        chapterService.publishChapter(id);
        return new ApiResponse<>(true, null, "Xuat ban chuong truyen thanh cong!");
    }

    private boolean hasAnyRole(Authentication authentication, String... roles) {
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> List.of(roles).contains(authority.getAuthority()));
    }
}
