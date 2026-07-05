package edu.uth.manga.service.impl;

import edu.uth.manga.dto.request.TaskRequest;
import edu.uth.manga.dto.response.TaskResponse;
import edu.uth.manga.entity.WorkflowTask;
import edu.uth.manga.enums.TaskStatus;
import edu.uth.manga.exception.ResourceNotFoundException;
import edu.uth.manga.repository.WorkflowTaskRepository;
import edu.uth.manga.repository.ChapterRepository;
import edu.uth.manga.entity.Chapter;
import edu.uth.manga.service.WorkflowTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkflowTaskServiceImpl implements WorkflowTaskService {
    private final WorkflowTaskRepository repository;
    private final ChapterRepository chapterRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        WorkflowTask.WorkflowTaskBuilder builder = WorkflowTask.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .assignedTo(request.getAssignedTo())
                .status(request.getStatus());
        
        if (request.getChapterId() != null) {
            Chapter chapter = chapterRepository.findById(request.getChapterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Chapter không tồn tại với id = " + request.getChapterId()));
            builder.chapter(chapter);
        }

        WorkflowTask task = builder.build();
        return mapToResponse(repository.save(task));
    }

    @Override
    @Transactional
    public TaskResponse assignTask(Long taskId, String user) {
        WorkflowTask task = repository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task không tồn tại với id = " + taskId));
        task.setAssignedTo(user);
        return mapToResponse(repository.save(task));
    }

    @Override
    @Transactional
    public TaskResponse updateStatus(Long taskId, TaskStatus status) {
        WorkflowTask task = repository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task không tồn tại với id = " + taskId));
        task.setStatus(status);
        return mapToResponse(repository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId) {
        WorkflowTask task = repository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task không tồn tại với id = " + taskId));
        return mapToResponse(task);
    }

    @Override
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
        if (request.getChapterId() != null) {
            Chapter chapter = chapterRepository.findById(request.getChapterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Chapter không tồn tại với id = " + request.getChapterId()));
            task.setChapter(chapter);
        }

        return mapToResponse(repository.save(task));
    }

    @Override
    @Transactional
    public void deleteTask(Long taskId) {
        WorkflowTask task = repository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task không tồn tại với id = " + taskId));
        repository.delete(task);
    }

    private TaskResponse mapToResponse(WorkflowTask task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .assignedTo(task.getAssignedTo())
                .status(task.getStatus())
                .chapterId(task.getChapter() != null ? task.getChapter().getId() : null)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}

