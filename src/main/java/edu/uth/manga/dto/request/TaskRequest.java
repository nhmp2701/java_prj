package edu.uth.manga.dto.request;

import edu.uth.manga.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {
    
    @NotBlank(message = "Title cannot be blank")
    private String title;

    private String description;

    @NotBlank(message = "Assigned to cannot be blank")
    private String assignedTo;

    @NotNull(message = "Status cannot be null")
    private TaskStatus status;
    private Long chapterId; // Optional link to Chapter
}