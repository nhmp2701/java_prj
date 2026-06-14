package edu.uth.manga.service;

import edu.uth.manga.dto.response.MangaCatalogueResponse;
import edu.uth.manga.dto.response.PublicChapterResponse;
import edu.uth.manga.entity.Chapter;
import edu.uth.manga.entity.MangaProject;
import edu.uth.manga.enums.ChapterStatus;
import edu.uth.manga.repository.ChapterRepository;
import edu.uth.manga.repository.MangaProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReaderService {

    private final MangaProjectRepository mangaProjectRepository;
    private final ChapterRepository chapterRepository;

    public List<MangaCatalogueResponse> getCatalogue() {
        // Lọc: Chỉ lấy những truyện đang phát hành (IN_PROGRESS) hoặc hoàn thành (COMPLETED)
        List<MangaProject> mangas = mangaProjectRepository.findAll().stream()
                .filter(m -> m.getStatus() != null &&
                        (m.getStatus().name().equals("IN_PROGRESS") || m.getStatus().name().equals("COMPLETED")))
                .toList();

        return mangas.stream().map(manga -> MangaCatalogueResponse.builder()
                .id(manga.getId())
                .title(manga.getTitle())
                .description(manga.getDescription())
                .authorName(manga.getAuthorName()) // Bổ sung Tên tác giả
                .coverUrl(manga.getCoverUrl())     // Bổ sung Ảnh bìa
                .status(manga.getStatus().name())  // Bổ sung Trạng thái
                .build()
        ).collect(Collectors.toList());
    }


    public PublicChapterResponse getPublicChapter(Long chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chương truyện"));


        if (chapter.getStatus() != ChapterStatus.PUBLISHED) {
            throw new RuntimeException("Chương truyện này chưa được xuất bản!");
        }


        List<String> urls = (chapter.getContent() != null && !chapter.getContent().isEmpty())
                ? Arrays.asList(chapter.getContent().split(","))
                : new ArrayList<>();

        return PublicChapterResponse.builder()
                .id(chapter.getId())
                .chapterNumber(chapter.getChapterNumber())
                .chapterTitle(chapter.getTitle())
                .mangaTitle(chapter.getManga() != null ? chapter.getManga().getTitle() : "")
                .pageUrls(urls)
                .build();
    }
}