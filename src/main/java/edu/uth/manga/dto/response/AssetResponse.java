package edu.uth.manga.dto.response;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AssetResponse {
    private Long id;
    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private String fileType;
    private String assetType;
    private Integer version;
    private String status;
    private String uploadedByUsername;
    private Long chapterId;
    private Long taskId;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
}