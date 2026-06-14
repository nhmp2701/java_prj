package edu.uth.manga.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicChapterResponse {
    private Long id;
    private String mangaTitle;       // Tên truyện
    private Integer chapterNumber;   // Số thứ tự chương
    private String chapterTitle;     // Tên chương
    private List<String> pageUrls;   // Danh sách link ảnh các trang truyện để độc giả vuốt đọc
}