package edu.uth.manga.repository;

import edu.uth.manga.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // Nhớ import List

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Thêm dòng này vào:
    List<Review> findByAssetId(Long assetId);

}