package edu.uth.manga.service;

import edu.uth.manga.entity.MangaProject;

import java.util.List;

public interface MangaProjectService {

    MangaProject createProject(MangaProject project);

    List<MangaProject> getAllProjects();

    MangaProject getProjectById(Long id);

    MangaProject updateProject(Long id, MangaProject project);

    void deleteProject(Long id);
}