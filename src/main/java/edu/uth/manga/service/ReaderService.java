package edu.uth.manga.service;

import edu.uth.manga.dto.response.MangaCatalogueResponse;
import edu.uth.manga.dto.response.PublicChapterResponse;
import java.util.List;

public interface ReaderService {
    List<MangaCatalogueResponse> getCatalogue();
    PublicChapterResponse getPublicChapter(Long chapterId);
}