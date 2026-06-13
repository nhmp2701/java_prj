package edu.uth.manga.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success; // Khôi phục trường này
    private T data;
    private String message;

    // Thêm constructor 2 tham số để tương thích ngược với code cũ của bạn
    public ApiResponse(T data, String message) {
        this.success = true; // Mặc định là true nếu có data trả về
        this.data = data;
        this.message = message;
    }
}