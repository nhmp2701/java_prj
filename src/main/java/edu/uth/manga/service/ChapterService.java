package edu.uth.manga.service;

import edu.uth.manga.dto.request.ChapterRequest;
import edu.uth.manga.entity.Chapter;
import edu.uth.manga.enums.ChapterStatus;

import java.util.List;

public interface ChapterService {
    void publishChapter(Long chapterId);
    Chapter createChapter(ChapterRequest request);
    List<Chapter> getChaptersByManga(Long mangaId);
    Chapter updateWorkflowStatus(Long id, ChapterStatus status);
    void deleteChapter(Long id);
}