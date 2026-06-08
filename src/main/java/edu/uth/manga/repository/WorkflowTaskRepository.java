package edu.uth.manga.repository;

import edu.uth.manga.entity.WorkflowTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkflowTaskRepository
        extends JpaRepository<WorkflowTask, Long> {

}