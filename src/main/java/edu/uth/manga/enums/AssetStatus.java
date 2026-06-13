package edu.uth.manga.enums;
public enum AssetStatus {
    DRAFT,      // Vừa tải lên, đang là bản nháp
    PENDING,    // Đang chờ Editor/Lead duyệt
    APPROVED,   // Đã được phê duyệt
    REJECTED,   // Bị từ chối, yêu cầu Artist sửa lại
    ARCHIVED    // Đã lưu trữ
}