package edu.uth.manga.repository;

import edu.uth.manga.entity.Asset;
import edu.uth.manga.enums.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    long countByChapterId(Long chapterId);
    long countByChapterIdAndStatusNot(Long chapterId, AssetStatus status);
}
