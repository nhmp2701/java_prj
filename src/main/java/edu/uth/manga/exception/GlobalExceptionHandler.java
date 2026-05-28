package edu.uth.manga.exception;

import edu.uth.manga.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Object> handleValidationException(MethodArgumentNotValidException exception) {
        // Lấy message lỗi đầu tiên
        String mesage = exception.getBindingResult().getFieldError().getDefaultMessage();
        ApiResponse<Object> response = new ApiResponse<>();

        response.setSuccess(false);
        response.setMessage(mesage);
        response.setData(null);

        return response;
    }

    // Handle runtime errors
    @ExceptionHandler(Exception.class)
    public ApiResponse<Object> handleRuntimeException(RuntimeException exception) {
        ApiResponse<Object> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setMessage(exception.getMessage());
        response.setData(null);

        return response;
    }
}
