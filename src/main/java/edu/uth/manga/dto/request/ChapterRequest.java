package edu.uth.manga.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterRequest {
    private String title;
    private Integer chapterNumber;
    private String content;
    private Long mangaId;
    private java.time.LocalDateTime scheduledPublishAt;
}