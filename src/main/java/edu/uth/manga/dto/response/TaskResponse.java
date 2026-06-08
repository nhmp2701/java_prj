package edu.uth.manga.dto.response;

import edu.uth.manga.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String assignedTo;
    private TaskStatus status;
    private Long chapterId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}