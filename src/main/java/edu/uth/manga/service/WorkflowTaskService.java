package edu.uth.manga.service;

import edu.uth.manga.dto.request.TaskRequest;
import edu.uth.manga.dto.response.TaskResponse;
import edu.uth.manga.enums.TaskStatus;
import java.util.List;

public interface WorkflowTaskService {
    List<TaskResponse> getAllTasks();
    TaskResponse createTask(TaskRequest request);
    TaskResponse assignTask(Long taskId, String user);
    TaskResponse updateStatus(Long taskId, TaskStatus status);
    TaskResponse getTaskById(Long taskId);
    TaskResponse updateTask(Long taskId, TaskRequest request);
    void deleteTask(Long taskId);
}