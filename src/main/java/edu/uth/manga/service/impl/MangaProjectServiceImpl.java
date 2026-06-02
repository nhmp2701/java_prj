package edu.uth.manga.service.impl;

import edu.uth.manga.entity.MangaProject;
import edu.uth.manga.exception.ResourceNotFoundException;
import edu.uth.manga.repository.MangaProjectRepository;
import edu.uth.manga.service.MangaProjectService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MangaProjectServiceImpl implements MangaProjectService {
    private final MangaProjectRepository projectRepository;
    public MangaProjectServiceImpl(
            MangaProjectRepository projectRepository
    ) {
        this.projectRepository = projectRepository;
    }
    @Override
    public MangaProject createProject(MangaProject project)
    {
        return projectRepository.save(project);
    }
    @Override
    public List<MangaProject> getAllProjects() {
        return projectRepository.findAll();
    }
    @Override
    public MangaProject getProjectById(Long id)
    {
        return projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    @Override
    public MangaProject updateProject(Long id, MangaProject project)
    {
        MangaProject existingProject = getProjectById(id);
        existingProject.setTitle(project.getTitle());
        existingProject.setDescription(project.getDescription());
        existingProject.setStatus(project.getStatus());
        existingProject.setStartDate(project.getStartDate());
        existingProject.setEndDate(project.getEndDate());
        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(Long id)
    {
        MangaProject project = getProjectById(id);
        projectRepository.delete(project);
    }
}