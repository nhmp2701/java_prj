package edu.uth.manga.controller;

import edu.uth.manga.dto.response.ApiResponse;
import edu.uth.manga.dto.request.AssetUploadRequest;
import edu.uth.manga.dto.request.ReviewRequest;
import edu.uth.manga.dto.response.AssetResponse;
import edu.uth.manga.dto.response.ReviewResponse;
import edu.uth.manga.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {
    private final AssetService assetService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ApiResponse<List<AssetResponse>> getAllAssets() {
        return new ApiResponse<>(assetService.getAllAssets(), "Lấy danh sách bản vẽ thành công");
    }

    // API UPLOAD FILE (Frontend gửi file ảnh lên)
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD', 'CREATOR')")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<AssetResponse> uploadAsset(
            @ModelAttribute AssetUploadRequest request,
            @RequestAttribute("currentUserId") Long userId) {

        AssetResponse responseData = assetService.uploadAsset(request, userId);
        return new ApiResponse<>(responseData, "Tải lên bản vẽ thành công!");
    }

    // API PHÊ DUYỆT BÀI
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'TEAM_LEAD')")
    @PostMapping("/{id}/approve")
    public ApiResponse<AssetResponse> approveAsset(
            @PathVariable Long id,
            @RequestParam(required = false) String notes,
            @RequestAttribute("currentUserId") Long approverId) {

        AssetResponse responseData = assetService.approveAsset(id, notes, approverId);
        return new ApiResponse<>(responseData, "Đã phê duyệt bản vẽ thành công!");
    }

    // API TỪ CHỐI BÀI (Yêu cầu sửa lại)
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'TEAM_LEAD')")
    @PostMapping("/{id}/reject")
    public ApiResponse<AssetResponse> rejectAsset(
            @PathVariable Long id,
            @RequestBody ReviewRequest request,
            @RequestAttribute("currentUserId") Long rejecterId) {

        AssetResponse responseData = assetService.rejectAsset(id, request, rejecterId);
        return new ApiResponse<>(responseData, "Đã từ chối bản vẽ và gửi yêu cầu chỉnh sửa.");
    }

    // API LẤY DANH SÁCH BÌNH LUẬN CỦA 1 BẢN VẼ
    @GetMapping("/{id}/reviews")
    public ApiResponse<List<ReviewResponse>> getReviewsByAssetId(@PathVariable Long id) {
        List<ReviewResponse> responses = assetService.getReviewsByAssetId(id).stream()
                .map(review -> new ReviewResponse(
                        review.getId(),
                        review.getComment(),
                        review.getStatus(),
                        review.getReviewer().getUsername(),
                        review.getCreatedAt()
                )).toList();

        return new ApiResponse<>(responses, "Lấy danh sách bình luận thành công");
    }

    // API THÊM BÌNH LUẬN ĐỘC LẬP (TRAO ĐỔI)
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/comments")
    public ApiResponse<ReviewResponse> addComment(
            @PathVariable Long id,
            @RequestParam String comment,
            @RequestAttribute("currentUserId") Long userId) {

        var savedReview = assetService.addComment(id, comment, userId);

        ReviewResponse response = new ReviewResponse(
                savedReview.getId(),
                savedReview.getComment(),
                savedReview.getStatus(),
                savedReview.getReviewer().getUsername(),
                savedReview.getCreatedAt()
        );

        return new ApiResponse<>(response, "Đã thêm bình luận thành công");
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD', 'CREATOR')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
        return new ApiResponse<>(null, "Xóa bản vẽ thành công");
    }
}
