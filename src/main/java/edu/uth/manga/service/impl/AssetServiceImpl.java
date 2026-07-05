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
    private final edu.uth.manga.repository.ChapterRepository chapterRepository;
    private final edu.uth.manga.repository.WorkflowTaskRepository workflowTaskRepository;

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
        
        org.springframework.web.multipart.MultipartFile file = request.getFile();
        String originalFilename = file.getOriginalFilename();
        String filename = System.currentTimeMillis() + "_" + originalFilename;
        
        try {
            java.io.File uploadDir = new java.io.File("uploads");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            java.io.File dest = new java.io.File(uploadDir, filename);
            file.transferTo(dest.getAbsoluteFile());
        } catch (java.io.IOException e) {
            throw new RuntimeException("Lỗi lưu file: " + e.getMessage());
        }
        
        String fileUrl = "http://localhost:8080/api/public/assets/files/" + filename;
        
        Asset.AssetBuilder builder = Asset.builder()
                .fileName(originalFilename)
                .fileUrl(fileUrl)
                .fileSize(file.getSize())
                .fileType(file.getContentType())
                .assetType(request.getAssetType())
                .description(request.getDescription())
                .version(1)
                .uploadedBy(user)
                .status(AssetStatus.PENDING);

        if (request.getChapterId() != null) {
            builder.chapter(chapterRepository.findById(request.getChapterId()).orElse(null));
        }
        if (request.getTaskId() != null) {
            builder.task(workflowTaskRepository.findById(request.getTaskId()).orElse(null));
        }

        Asset asset = builder.build();
        return convertToResponse(assetRepository.save(asset));
    }
    @Override
    public List<AssetResponse> getAllAssets() {
        return assetRepository.findAll().stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public AssetResponse approveAsset(Long id, String notes, Long approverId) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản vẽ"));
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

        User rejecter = userRepository.findById(rejecterId).orElseThrow();

        // Cập nhật trạng thái thành REJECTED để đuổi Artist đi sửa
        asset.setStatus(AssetStatus.REJECTED);
        asset.setApprovedAt(null);
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
        if (asset.getChapter() != null) {
            res.setChapterId(asset.getChapter().getId());
        }
        if (asset.getTask() != null) {
            res.setTaskId(asset.getTask().getId());
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
    @Override
    public void deleteAsset(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản vẽ"));
        // Delete all related reviews first
        List<Review> reviews = reviewRepository.findByAssetId(id);
        reviewRepository.deleteAll(reviews);

        // Delete physical file
        try {
            String fileUrl = asset.getFileUrl();
            if (fileUrl != null && fileUrl.contains("/api/public/assets/files/")) {
                String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                java.io.File file = new java.io.File("uploads", filename);
                if (file.exists()) {
                    file.delete();
                }
            }
        } catch (Exception e) {
            // Ignore file deletion error
        }

        assetRepository.delete(asset);
    }
}
