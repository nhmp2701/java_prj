package edu.uth.manga.dto.response;
// <T> là data c thể là bất kỳ kiểu nào
public class ApiResponse<T> {
    // API thành công hay thất bại
    private boolean success;
    // Thông báo
    private String message;
    // Dữ liệu trả về
    private T data;
    // getter/settor

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
