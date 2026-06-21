package edu.uth.manga.service.impl;
import edu.uth.manga.dto.request.AssetUploadRequest;
import edu.uth.manga.dto.request.ReviewRequest;
import edu.uth.manga.dto.response.AssetResponse;
import edu.uth.manga.entity.Asset;
import edu.uth.manga.entity.Review;
import edu.uth.manga.entity.User;
import edu.uth.manga.enums.AssetStatus;
import edu.uth.manga.enums.ReviewStatus;
import edu.uth.manga.repository.AssetRepository;
import edu.uth.manga.repository.ReviewRepository;
import edu.uth.manga.repository.UserRepository;
import edu.uth.manga.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class AssetServiceImpl implements AssetService {
    private final AssetRepository assetRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    // Define allowed file extensions and MIME types
    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(
        Arrays.asList("jpg", "jpeg", "png", "gif", "webp")
    );

    private static final Set<String> ALLOWED_MIME_TYPES = new HashSet<>(
        Arrays.asList("image/jpeg", "image/png", "image/gif", "image/webp")
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // Add file validation method
    private void validateFileUpload(AssetUploadRequest request) {
        if (request.getFile() == null || request.getFile().isEmpty()) {
            throw new IllegalArgumentException("File không được phép để trống");
        }

        // Check file size
        if (request.getFile().getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Kích thước file vượt quá giới hạn 10MB");
        }

        // Check file extension
        String filename = request.getFile().getOriginalFilename();
        if (filename == null || !filename.contains(".")) {
            throw new IllegalArgumentException("Tệp không có phần mở rộng hợp lệ");
        }

        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Loại tệp không được hỗ trợ. Chỉ chấp nhận: " + ALLOWED_EXTENSIONS);
        }

        // Check MIME type
        String contentType = request.getFile().getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("MIME type không hợp lệ: " + contentType);
        }
    }

    @Override
    public AssetResponse uploadAsset(AssetUploadRequest request, Long userId) {
        // Validate file before processing
        validateFileUpload(request);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));
        String fileUrl = "https://storage.uth.edu/manga/" + request.getFile().getOriginalFilename();
        Asset asset = Asset.builder()
                .fileName(request.getFile().getOriginalFilename())
                .fileUrl(fileUrl)
                .fileSize(request.getFile().getSize())
                .fileType(request.getFile().getContentType())
                .assetType(request.getAssetType())
                .description(request.getDescription())
                .version(1)
                .uploadedBy(user)
                .status(AssetStatus.PENDING)
                .build();

        return convertToResponse(assetRepository.save(asset));
    }
    @Override
    public AssetResponse approveAsset(Long id, String notes, Long approverId) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản vẽ"));
        if (asset.getStatus() != AssetStatus.PENDING) {
            throw new IllegalArgumentException("Lỗi: Chỉ có thể duyệt các bản vẽ đang ở trạng thái PENDING!");
        }
        User approver = userRepository.findById(approverId).orElseThrow();
        asset.setStatus(AssetStatus.APPROVED);
        asset.setApprovedAt(LocalDateTime.now());
        assetRepository.save(asset);
        Review review = Review.builder()
                .asset(asset)
                .reviewer(approver)
                .comment(notes != null ? notes : "Bản vẽ đạt yêu cầu, không cần chỉnh sửa.")
                .status(ReviewStatus.APPROVED)
                .build();
        reviewRepository.save(review);
        return convertToResponse(asset);
    }
    @Override
    public AssetResponse rejectAsset(Long id, ReviewRequest request, Long rejecterId) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản vẽ"));

        // [Workflow Validation]
        if (asset.getStatus() != AssetStatus.PENDING) {
            throw new IllegalArgumentException("Lỗi: Chỉ có thể từ chối các bản vẽ đang ở trạng thái PENDING!");
        }

        User rejecter = userRepository.findById(rejecterId).orElseThrow();

        // Cập nhật trạng thái thành REJECTED để đuổi Artist đi sửa
        asset.setStatus(AssetStatus.REJECTED);
        assetRepository.save(asset);

        // Bắt buộc lưu lại lý do từ chối (Comment) vào bảng Review
        Review review = Review.builder()
                .asset(asset)
                .reviewer(rejecter)
                .comment(request.getComment()) // Lý do từ chối lấy từ Frontend truyền xuống
                .status(ReviewStatus.PENDING)  // Đánh dấu là đang chờ Artist sửa lỗi này
                .build();
        reviewRepository.save(review);

        return convertToResponse(asset);
    }
    private AssetResponse convertToResponse(Asset asset) {
        AssetResponse res = new AssetResponse();
        res.setId(asset.getId());
        res.setFileName(asset.getFileName());
        res.setFileUrl(asset.getFileUrl());
        res.setFileSize(asset.getFileSize());
        res.setFileType(asset.getFileType());
        res.setAssetType(asset.getAssetType());
        res.setVersion(asset.getVersion());
        res.setStatus(asset.getStatus().name());
        if (asset.getUploadedBy() != null) {
            res.setUploadedByUsername(asset.getUploadedBy().getUsername());
        }
        res.setCreatedAt(asset.getCreatedAt());
        res.setApprovedAt(asset.getApprovedAt());
        return res;
    }
    public List<Review> getReviewsByAssetId(Long assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản vẽ"));
        // Giả định ReviewRepository có hàm findByAssetId
        return reviewRepository.findByAssetId(asset.getId());
    }
    public Review addComment(Long assetId, String comment, Long reviewerId) {
        Asset asset = assetRepository.findById(assetId).orElseThrow();
        User reviewer = userRepository.findById(reviewerId).orElseThrow();

        Review review = Review.builder()
                .asset(asset)
                .reviewer(reviewer)
                .comment(comment)
                .build();
        return reviewRepository.save(review);
    }
}
