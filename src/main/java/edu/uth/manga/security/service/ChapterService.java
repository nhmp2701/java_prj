package edu.uth.manga.security.service;

import edu.uth.manga.enums.ChapterStatus;
import edu.uth.manga.dto.request.ChapterRequest;
import edu.uth.manga.entity.Chapter;
import edu.uth.manga.entity.MangaProject;
import edu.uth.manga.repository.ChapterRepository;
import edu.uth.manga.repository.MangaProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final MangaProjectRepository mangaProjectRepository;

    // 1. Logic API: Tạo Chapter mới
    @Transactional
    public Chapter createChapter(ChapterRequest request) {

        MangaProject manga = mangaProjectRepository.findById(request.getMangaId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy truyện với ID: " + request.getMangaId()));

        // Xây dựng đối tượng Chapter bằng Builder pattern
        Chapter chapter = Chapter.builder()
                .title(request.getTitle())
                .chapterNumber(request.getChapterNumber())
                .content(request.getContent())
                .status(ChapterStatus.DRAFT) // Mặc định trạng thái ban đầu khi tạo là DRAFT
                .manga(manga) // Gắn mối quan hệ thuộc về truyện nào
                .build();

        return chapterRepository.save(chapter);
    }

    // 2. Logic API: Lấy danh sách chapter theo mã truyện (mangaId)
    public List<Chapter> getChaptersByManga(Long mangaId) {
        return chapterRepository.findByMangaId(mangaId);
    }

    // 3. Logic API: Cập nhật trạng thái Workflow (Duyệt bài, huỷ bài...)
    @Transactional
    public Chapter updateWorkflowStatus(Long id, ChapterStatus status) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chương với ID: " + id));

        chapter.setStatus(status);
        return chapterRepository.save(chapter);
    }

    // 4. Logic API: Xóa chapter
    @Transactional
    public void deleteChapter(Long id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chương với ID: " + id));

        chapterRepository.delete(chapter);
    }
}