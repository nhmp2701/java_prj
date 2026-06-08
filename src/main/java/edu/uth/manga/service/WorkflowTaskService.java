package edu.uth.manga.service;

import edu.uth.manga.dto.request.TaskRequest;
import edu.uth.manga.dto.response.TaskResponse;
import edu.uth.manga.entity.WorkflowTask;
import edu.uth.manga.enums.TaskStatus;
import edu.uth.manga.exception.ResourceNotFoundException;
import edu.uth.manga.repository.WorkflowTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkflowTaskService {
    private final WorkflowTaskRepository repository;

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        WorkflowTask task = WorkflowTask.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .assignedTo(request.getAssignedTo())
                .status(request.getStatus())
                .build();
        return mapToResponse(repository.save(task));
    }

    @Transactional
    public TaskResponse assignTask(Long taskId, String user) {
        WorkflowTask task = repository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task không tồn tại với id = " + taskId));
        task.setAssignedTo(user);
        return mapToResponse(repository.save(task));
    }

    @Transactional
    public TaskResponse updateStatus(Long taskId, TaskStatus status) {
        WorkflowTask task = repository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task không tồn tại với id = " + taskId));
        task.setStatus(status);
        return mapToResponse(repository.save(task));
    }

    // Tìm kiếm và lấy thông tin một công việc cụ thể phục vụ xem chi tiết
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId) {
        WorkflowTask task = repository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task không tồn tại với id = " + taskId));
        return mapToResponse(task);
    }

    // Xử lý nghiệp vụ cập nhật thông tin chi tiết (Tiêu đề, mô tả,...) của thẻ công việc
    @Transactional
    public TaskResponse updateTask(Long taskId, TaskRequest request) {
        WorkflowTask task = repository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task không tồn tại với id = " + taskId));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getAssignedTo() != null) {
            task.setAssignedTo(request.getAssignedTo());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        return mapToResponse(repository.save(task));
    }

    // Xử lý xóa bỏ thẻ công việc khi người dùng tương tác nút xóa trên UI
    @Transactional
    public void deleteTask(Long taskId) {
        WorkflowTask task = repository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task không tồn tại với id = " + taskId));
        repository.delete(task);
    }

    // Hàm bổ trợ đóng vai trò ánh xạ dữ liệu, chuyển đổi đối tượng dữ liệu Entity sang dữ liệu dạng DTO Response
    private TaskResponse mapToResponse(WorkflowTask task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .assignedTo(task.getAssignedTo())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}