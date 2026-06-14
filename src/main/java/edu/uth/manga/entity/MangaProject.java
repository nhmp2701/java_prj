package edu.uth.manga.entity;

import edu.uth.manga.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "manga_projects")
@Getter
@Setter
public class MangaProject extends BaseEntity {

    private String title;
    @Column(name = "author_name")
    private String authorName;

    @Column(name = "cover_url")
    private String coverUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    private LocalDate startDate;

    private LocalDate endDate;
}