package edu.uth.manga.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
@Data
public class AssetUploadRequest {
    private MultipartFile file;
    private String assetType;
    private String description;
    private Long chapterId;
    private Long taskId;
}