package com.taskmanager.service;

import com.taskmanager.domain.enums.TaskStatus;
import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {
    TaskResponse createTask(TaskRequest request);
    TaskResponse getTaskById(Long id);
    Page<TaskResponse> getAllTasks(Pageable pageable, TaskStatus status);
    TaskResponse updateTask(Long id, TaskRequest request);
    void deleteTask(Long id);
}
