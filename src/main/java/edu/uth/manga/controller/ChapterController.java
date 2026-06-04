package edu.uth.manga.controller;

import edu.uth.manga.dto.request.ChapterRequest;
import edu.uth.manga.entity.Chapter;
import edu.uth.manga.enums.ChapterStatus;
import edu.uth.manga.security.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chapters")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    // API Tạo Chapter mới
    @PostMapping
    public ResponseEntity<Chapter> create(@RequestBody ChapterRequest request) {
        // Chỉ truyền duy nhất tên biến 'request' vào đây
        return ResponseEntity.ok(chapterService.createChapter(request));
    }

    // API Lấy danh sách chapter theo mã truyện
    @GetMapping("/manga/{mangaId}")
    public ResponseEntity<List<Chapter>> getByManga(@PathVariable Long mangaId) {
        return ResponseEntity.ok(chapterService.getChaptersByManga(mangaId));
    }

    // API Thay đổi trạng thái Workflow (Duyệt bài, huỷ bài...)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Chapter> changeStatus(
            @PathVariable Long id,
            @RequestParam ChapterStatus status) {
        return ResponseEntity.ok(chapterService.updateWorkflowStatus(id, status));
    }

    // API Xóa chapter
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.ok("Xóa chương thành công!");
    }
}