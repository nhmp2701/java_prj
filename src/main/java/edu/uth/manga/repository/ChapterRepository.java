package edu.uth.manga.repository;

import edu.uth.manga.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    List<Chapter> findByMangaId(Long mangaId);
    java.util.List<Chapter> findByStatusAndScheduledPublishAtBefore(edu.uth.manga.enums.ChapterStatus status, java.time.LocalDateTime time);
}