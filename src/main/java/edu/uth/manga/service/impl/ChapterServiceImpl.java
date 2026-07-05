package edu.uth.manga.service.impl;

import edu.uth.manga.dto.request.ChapterRequest;
import edu.uth.manga.entity.Chapter;
import edu.uth.manga.entity.MangaProject;
import edu.uth.manga.enums.AssetStatus;
import edu.uth.manga.enums.ChapterStatus;
import edu.uth.manga.enums.TaskStatus;
import edu.uth.manga.exception.InvalidStateTransitionException;
import edu.uth.manga.exception.ResourceNotFoundException;
import edu.uth.manga.repository.AssetRepository;
import edu.uth.manga.repository.ChapterRepository;
import edu.uth.manga.repository.MangaProjectRepository;
import edu.uth.manga.repository.WorkflowTaskRepository;
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
    private final WorkflowTaskRepository workflowTaskRepository;
    private final AssetRepository assetRepository;

    @Override
    @Transactional
    public void publishChapter(Long chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id = " + chapterId));

        if (chapter.getStatus() != ChapterStatus.PENDING && chapter.getStatus() != ChapterStatus.SCHEDULED) {
            throw new InvalidStateTransitionException(
                    "Only PENDING or SCHEDULED chapters can be published.");
        }

        long unfinishedTasks = workflowTaskRepository.countByChapterIdAndStatusNot(chapterId, TaskStatus.DONE);
        if (unfinishedTasks > 0) {
            throw new InvalidStateTransitionException(
                    "Cannot publish chapter because " + unfinishedTasks + " task(s) are not DONE.");
        }

        long totalAssets = assetRepository.countByChapterId(chapterId);
        long unapprovedAssets = assetRepository.countByChapterIdAndStatusNot(chapterId, AssetStatus.APPROVED);
        if (totalAssets > 0 && unapprovedAssets > 0) {
            throw new InvalidStateTransitionException(
                    "Cannot publish chapter because " + unapprovedAssets + " asset(s) are not APPROVED.");
        }

        chapter.setStatus(ChapterStatus.PUBLISHED);
        chapterRepository.save(chapter);
    }

    @Override
    @Transactional
    public Chapter createChapter(ChapterRequest request) {
        MangaProject manga = mangaProjectRepository.findById(request.getMangaId())
                .orElseThrow(() -> new ResourceNotFoundException("Manga project not found with id = " + request.getMangaId()));

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
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id = " + id));

        validateStatusTransition(chapter.getStatus(), status);
        chapter.setStatus(status);
        return chapterRepository.save(chapter);
    }

    @Override
    @Transactional
    public void deleteChapter(Long id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id = " + id));

        chapterRepository.delete(chapter);
    }

    private void validateStatusTransition(ChapterStatus current, ChapterStatus target) {
        if (current == target) {
            return;
        }

        if (target == ChapterStatus.PUBLISHED) {
            throw new InvalidStateTransitionException("Use the publish endpoint to publish a chapter.");
        }

        boolean allowed = switch (current) {
            case DRAFT -> target == ChapterStatus.PENDING || target == ChapterStatus.SCHEDULED || target == ChapterStatus.REJECTED;
            case REJECTED -> target == ChapterStatus.DRAFT || target == ChapterStatus.PENDING;
            case PENDING -> target == ChapterStatus.SCHEDULED || target == ChapterStatus.REJECTED;
            case SCHEDULED -> target == ChapterStatus.PENDING || target == ChapterStatus.REJECTED;
            case PUBLISHED -> false;
        };

        if (!allowed) {
            throw new InvalidStateTransitionException(
                    "Invalid chapter status transition from " + current + " to " + target + ".");
        }
    }
}
