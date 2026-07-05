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

    @GetMapping("/assets/files/{filename:.+}")
    public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> getFile(@PathVariable String filename) {
        try {
            java.nio.file.Path filePath = java.nio.file.Paths.get("uploads").resolve(filename).normalize();
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
            if (resource.exists()) {
                String contentType = java.nio.file.Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                return org.springframework.http.ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                        .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return org.springframework.http.ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.internalServerError().build();
        }
    }
}