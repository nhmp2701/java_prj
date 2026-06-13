package edu.uth.manga.entity;
import edu.uth.manga.enums.AssetStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Table(name = "assets")
public class Asset extends BaseEntity {
    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private String fileType;
    private String description;
    private String assetType;
    private Integer version;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private WorkflowTask task;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id")
    private User uploadedBy;
    @Enumerated(EnumType.STRING)
    private AssetStatus status;
    private LocalDateTime approvedAt;
}