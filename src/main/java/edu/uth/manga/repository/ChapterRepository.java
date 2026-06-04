package edu.uth.manga.repository;

import edu.uth.manga.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    // Tìm các chapter thuộc về một bộ truyện cụ thể
    List<Chapter> findByMangaId(Long mangaId);
}