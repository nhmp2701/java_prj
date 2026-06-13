package edu.uth.manga.repository;

import edu.uth.manga.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository
        extends JpaRepository<Asset, Long> {
}