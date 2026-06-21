package edu.uth.manga.controller;

import edu.uth.manga.dto.request.ChapterRequest;
import edu.uth.manga.dto.response.ApiResponse;
import edu.uth.manga.entity.Chapter;
import edu.uth.manga.enums.ChapterStatus;
import edu.uth.manga.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chapters")
@RequiredArgsConstructor
public class ChapterController {
    // Use ChapterService interface (not ChapterServiceImpl)
    private final ChapterService chapterService;

    // API Tạo Chapter mới
    @PostMapping
    public ResponseEntity<Chapter> create(@RequestBody ChapterRequest request) {
        return ResponseEntity.ok(chapterService.createChapter(request));
    }

    // API Lấy danh sách chapter theo mã truyện
    @GetMapping("/manga/{mangaId}")
    public ResponseEntity<List<Chapter>> getByManga(@PathVariable Long mangaId) {
        return ResponseEntity.ok(chapterService.getChaptersByManga(mangaId));
    }

    // API Cập nhật trạng thái chapter
    @PatchMapping("/{id}/status")
    public ResponseEntity<Chapter> changeStatus(@PathVariable Long id, @RequestParam ChapterStatus status) {
        return ResponseEntity.ok(chapterService.updateWorkflowStatus(id, status));
    }

    // API Xóa chapter
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.ok("Xóa chương thành công!");
    }

    // API Xuất bản chapter
    @PatchMapping("/{id}/publish")
    public ApiResponse<Object> publishChapter(@PathVariable Long id) {
        chapterService.publishChapter(id);
        return new ApiResponse<>(true, null, "Xuất bản chương truyện thành công!");
    }
}

