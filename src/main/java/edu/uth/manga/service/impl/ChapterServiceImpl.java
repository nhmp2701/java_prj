package edu.uth.manga.service.impl;

import edu.uth.manga.enums.ChapterStatus;
import edu.uth.manga.dto.request.ChapterRequest;
import edu.uth.manga.entity.Chapter;
import edu.uth.manga.entity.MangaProject;
import edu.uth.manga.exception.InvalidStateTransitionException;
import edu.uth.manga.exception.ResourceNotFoundException;
import edu.uth.manga.repository.ChapterRepository;
import edu.uth.manga.repository.MangaProjectRepository;
import edu.uth.manga.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService {

    private final ChapterRepository chapterRepository;
    private final MangaProjectRepository mangaProjectRepository;

    @Override
    @Transactional
    public void publishChapter(Long chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chương truyện này!"));

        if (chapter.getStatus() != ChapterStatus.PENDING && chapter.getStatus() != ChapterStatus.SCHEDULED) {
            throw new InvalidStateTransitionException(
                    "Chỉ chương đang ở trạng thái PENDING hoặc SCHEDULED mới được phép xuất bản.");
        }

        chapter.setStatus(ChapterStatus.PUBLISHED);
        chapterRepository.save(chapter);
    }

    @Override
    @Transactional
    public Chapter createChapter(ChapterRequest request) {
        MangaProject manga = mangaProjectRepository.findById(request.getMangaId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy truyện với ID: " + request.getMangaId()));

        Chapter chapter = Chapter.builder()
                .title(request.getTitle())
                .chapterNumber(request.getChapterNumber())
                .content(request.getContent())
                .scheduledPublishAt(request.getScheduledPublishAt())
                .status(request.getScheduledPublishAt() != null ? ChapterStatus.SCHEDULED : ChapterStatus.DRAFT)
                .manga(manga)
                .build();

        return chapterRepository.save(chapter);
    }

    @Override
    public List<Chapter> getChaptersByManga(Long mangaId) {
        return chapterRepository.findByMangaId(mangaId);
    }

    @Override
    @Transactional
    public Chapter updateWorkflowStatus(Long id, ChapterStatus status) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chương với ID: " + id));

        chapter.setStatus(status);
        return chapterRepository.save(chapter);
    }

    @Override
    @Transactional
    public void deleteChapter(Long id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chương với ID: " + id));

        chapterRepository.delete(chapter);
    }
}