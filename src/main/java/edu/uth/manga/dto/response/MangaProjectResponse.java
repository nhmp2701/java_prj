package edu.uth.manga.dto.response;

import edu.uth.manga.enums.ProjectStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MangaProjectResponse {
    private Long id;
    private String title;
    private String description;
    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String coverUrl;
    private String authorName;
}
