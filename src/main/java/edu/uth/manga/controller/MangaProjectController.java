package edu.uth.manga.controller;

import edu.uth.manga.dto.response.ApiResponse;
import edu.uth.manga.dto.request.MangaProjectCreationRequest;
import edu.uth.manga.entity.MangaProject;
import edu.uth.manga.service.MangaProjectService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import edu.uth.manga.dto.response.MangaProjectResponse;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/projects")
public class MangaProjectController {
    private final MangaProjectService projectService;

    // createProject()
    @PostMapping
    public ApiResponse<MangaProjectResponse> createProject(
            @Valid @RequestBody MangaProjectCreationRequest request) {
        MangaProject project = toEntity(request);
        MangaProject savedProject = projectService.createProject(project);
        return buildResponse(toResponse(savedProject), "Project created successfully");
    }

    // getAllProjects()
    @GetMapping
    public ApiResponse<List<MangaProjectResponse>> getAllProjects() {
        List<MangaProject> projects = projectService.getAllProjects();
        List<MangaProjectResponse> responses = projects.stream()
                .map(this::toResponse)
                .toList();
        return buildResponse(responses, "Get all projects successfully");
    }

    // getProjectById()
    @GetMapping("/{id}")
    public ApiResponse<MangaProjectResponse> getProjectById(
            @PathVariable Long id) {
        MangaProject project = projectService.getProjectById(id);
        return buildResponse(toResponse(project), "Get project successfully");
    }

    // updateProject()
    @PutMapping("/{id}")
    public ApiResponse<MangaProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody MangaProjectCreationRequest request) {
        MangaProject project = toEntity(request);
        MangaProject updateProject = projectService.updateProject(id, project);
        return buildResponse(toResponse(updateProject), "Update project successfully");
    }

    private MangaProject toEntity(MangaProjectCreationRequest request) {
        MangaProject project = new MangaProject();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setStatus(request.getStatus());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setCoverUrl(request.getCoverUrl());
        project.setAuthorName(request.getAuthorName());
        return project;
    }

    private MangaProjectResponse toResponse(MangaProject project) {
        MangaProjectResponse response = new MangaProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setStatus(project.getStatus());
        response.setStartDate(project.getStartDate());
        response.setEndDate(project.getEndDate());
        response.setCoverUrl(project.getCoverUrl());
        response.setAuthorName(project.getAuthorName());
        return response;
    }

    private <T> ApiResponse<T> buildResponse(T data, String message) {
        ApiResponse<T> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage(message);
        apiResponse.setData(data);
        return apiResponse;
    }

    // deleteProject()
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProject(
            @PathVariable Long id) {
        projectService.deleteProject(id);
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage("Project deleted successfully");
        apiResponse.setData("Deleted project id = " + id);
        return apiResponse;
    }
}
