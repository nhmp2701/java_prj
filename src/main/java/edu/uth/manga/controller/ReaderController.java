package edu.uth.manga.controller;

import edu.uth.manga.dto.response.ApiResponse;
import edu.uth.manga.dto.response.MangaCatalogueResponse;
import edu.uth.manga.dto.response.PublicChapterResponse;
import edu.uth.manga.service.ReaderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class ReaderController {

    private final ReaderService readerService;


    @GetMapping("/mangas")
    public ApiResponse<List<MangaCatalogueResponse>> getCatalogue() {
        List<MangaCatalogueResponse> data = readerService.getCatalogue();
        return new ApiResponse<>(data, "Lấy danh mục truyện thành công");
    }


    @GetMapping("/chapters/{id}")
    public ApiResponse<PublicChapterResponse> readChapter(@PathVariable Long id) {
        PublicChapterResponse data = readerService.getPublicChapter(id);
        return new ApiResponse<>(data, "Tải nội dung chương thành công");
    }
}