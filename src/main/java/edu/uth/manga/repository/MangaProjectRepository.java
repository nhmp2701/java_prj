package edu.uth.manga.repository;

import edu.uth.manga.entity.MangaProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MangaProjectRepository extends JpaRepository<MangaProject, Long> {

}