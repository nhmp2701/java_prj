package edu.uth.manga.dto.response;

import edu.uth.manga.enums.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String comment;
    private ReviewStatus status;
    private String reviewerUsername;
    private LocalDateTime createdAt;
}