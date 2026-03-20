package com.taskmanager.dto;

import com.taskmanager.domain.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {
    
    @NotBlank(message = "Title is required and cannot be blank")
    private String title;
    
    private String description;
    
    private TaskStatus status;
}
