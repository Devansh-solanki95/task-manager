package com.taskmanager.repository;

import com.taskmanager.domain.entity.Task;
import com.taskmanager.domain.enums.TaskStatus;
import com.taskmanager.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByStatusAndUser(TaskStatus status, User user, Pageable pageable);
    Page<Task> findByUser(User user, Pageable pageable);
    Optional<Task> findByIdAndUser(Long id, User user);
}
