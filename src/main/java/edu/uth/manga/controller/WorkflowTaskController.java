package edu.uth.manga.controller;
import edu.uth.manga.dto.response.ApiResponse;
import edu.uth.manga.dto.request.TaskRequest;
import edu.uth.manga.dto.response.TaskResponse;
import edu.uth.manga.enums.TaskStatus;
import edu.uth.manga.service.WorkflowTaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.AllArgsConstructor;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin("*")
public class WorkflowTaskController {
    private final WorkflowTaskService service;

    // Endpoint lấy toàn bộ danh sách công việc hiển thị lên Kanban Board
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks() {
        ApiResponse<List<TaskResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tải danh sách công việc thành công!");
        response.setData(service.getAllTasks());
        return ResponseEntity.ok(response);
    }

    // Endpoint xử lý form tạo mới một thẻ công việc
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request) {
        ApiResponse<TaskResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo mới công việc thành công!");
        response.setData(service.createTask(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable Long id,
            @RequestParam String user) {
        ApiResponse<TaskResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Giao việc thành công!");
        response.setData(service.assignTask(id, user));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status) {
        ApiResponse<TaskResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật trạng thái thành công!");
        response.setData(service.updateStatus(id, status));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        ApiResponse<TaskResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tải thông tin chi tiết công việc thành công!");
        response.setData(service.getTaskById(id));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        ApiResponse<TaskResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật nội dung công việc thành công!");
        response.setData(service.updateTask(id, request));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Xóa thẻ công việc thành công!");
        response.setData(null);
        return ResponseEntity.ok(response);
    }
}