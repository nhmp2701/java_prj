package edu.uth.manga.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class AssetUploadRequest {
    @NotNull(message = "File không được phép để trống")
    private MultipartFile file;

    @NotBlank(message = "Asset Type không được phép để trống")
    private String assetType;

    @Size(max = 500, message = "Description không được vượt quá 500 ký tự")
    private String description;

    private Long chapterId;
    private Long taskId;
}