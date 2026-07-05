package edu.uth.manga.repository;

import edu.uth.manga.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import edu.uth.manga.enums.ChapterStatus;
import java.time.LocalDateTime;


@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    List<Chapter> findByMangaId(Long mangaId);
    boolean existsByMangaIdAndStatus(Long mangaId, ChapterStatus status);
    List<Chapter> findByStatusAndScheduledPublishAtBefore(ChapterStatus status, LocalDateTime time);
}
