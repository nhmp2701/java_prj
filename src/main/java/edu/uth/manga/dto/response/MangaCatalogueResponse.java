package edu.uth.manga.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MangaCatalogueResponse {
    private Long id;
    private String title;
    private String description;
    private String authorName; // Tên tác giả
    private String coverUrl;   // Ảnh bìa
    private String status;     // Trạng thái (VD: Đang ra, Hoàn thành)
    private LocalDateTime latestChapterDate; // Ngày cập nhật chapter mới nhất
}