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
        MangaProject project = new MangaProject();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setStatus(request.getStatus());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        MangaProject savedProject = projectService.createProject(project);
        MangaProjectResponse response = new MangaProjectResponse();
        response.setId(savedProject.getId());
        response.setTitle(savedProject.getTitle());
        response.setDescription(savedProject.getDescription());
        response.setStatus(savedProject.getStatus());
        response.setStartDate(savedProject.getStartDate());
        response.setEndDate(savedProject.getEndDate());
        ApiResponse<MangaProjectResponse> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage("Project created successfully");
        apiResponse.setData(response);
        return apiResponse;
    }

    // getAllProjects()
    @GetMapping
    public ApiResponse<List<MangaProjectResponse>> getAllProjects() {
        List<MangaProject> projects = projectService.getAllProjects();
        List<MangaProjectResponse> responses = projects.stream().map(project -> {
            MangaProjectResponse response = new MangaProjectResponse();
            response.setId(project.getId());
            response.setTitle(project.getTitle());
            response.setDescription(project.getDescription());
            response.setStatus(project.getStatus());
            response.setStartDate(project.getStartDate());
            response.setEndDate(project.getEndDate());
            return response;
        }).toList();
        ApiResponse<List<MangaProjectResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage("Get all projects successfully");
        apiResponse.setData(responses);
        return apiResponse;
    }

    // getProjectById()
    @GetMapping("/{id}")
    public ApiResponse<MangaProjectResponse> getProjectById(
            @PathVariable Long id) {
        MangaProject project = projectService.getProjectById(id);
        MangaProjectResponse response = new MangaProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setStatus(project.getStatus());
        response.setStartDate(project.getStartDate());
        response.setEndDate(project.getEndDate());
        ApiResponse<MangaProjectResponse> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage("Get project successfully");
        apiResponse.setData(response);
        return apiResponse;
    }

    // updateProject()
    @PutMapping("/{id}")
    public ApiResponse<MangaProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody MangaProjectCreationRequest request) {
        MangaProject project = new MangaProject();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setStatus(request.getStatus());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        MangaProject updateProject = projectService.updateProject(id, project);
        MangaProjectResponse response = new MangaProjectResponse();
        response.setId(updateProject.getId());
        response.setTitle(updateProject.getTitle());
        response.setDescription(updateProject.getDescription());
        response.setStatus(updateProject.getStatus());
        response.setStartDate(updateProject.getStartDate());
        response.setEndDate(updateProject.getEndDate());
        ApiResponse<MangaProjectResponse> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage("Update project successfully");
        apiResponse.setData(response);
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
