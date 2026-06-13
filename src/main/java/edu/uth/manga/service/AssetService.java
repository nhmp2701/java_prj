package edu.uth.manga.service;
import edu.uth.manga.dto.request.AssetUploadRequest;
import edu.uth.manga.dto.request.ReviewRequest;
import edu.uth.manga.dto.response.AssetResponse;
import edu.uth.manga.entity.Review; // <-- Import thêm Review
import java.util.List;             // <-- Import thêm List
public interface AssetService {
    AssetResponse uploadAsset(AssetUploadRequest request, Long userId);
    AssetResponse approveAsset(Long id, String notes, Long approverId);
    AssetResponse rejectAsset(Long id, ReviewRequest request, Long rejecterId);
    List<Review> getReviewsByAssetId(Long assetId);
    Review addComment(Long assetId, String comment, Long reviewerId);
}