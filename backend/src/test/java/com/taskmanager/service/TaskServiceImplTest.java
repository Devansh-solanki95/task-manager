package com.taskmanager.service;

import com.taskmanager.domain.entity.Task;
import com.taskmanager.domain.entity.User;
import com.taskmanager.domain.enums.TaskStatus;
import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.mapper.TaskMapper;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.UserDetailsImpl;
import com.taskmanager.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskMapper taskMapper;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task task;
    private User testUser;
    private TaskRequest taskRequest;
    private TaskResponse taskResponse;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .password("pass")
                .createdAt(LocalDateTime.now())
                .build();

        task = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .status(TaskStatus.PENDING)
                .user(testUser)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        taskRequest = new TaskRequest();
        taskRequest.setTitle("Test Task");
        taskRequest.setDescription("Test Description");
        taskRequest.setStatus(TaskStatus.PENDING);

        taskResponse = new TaskResponse();
        taskResponse.setId(1L);
        taskResponse.setTitle("Test Task");
        taskResponse.setDescription("Test Description");
        taskResponse.setStatus(TaskStatus.PENDING);
    }

    private void mockSecurityContext() {
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testuser", "pass");
        given(securityContext.getAuthentication()).willReturn(authentication);
        given(authentication.getPrincipal()).willReturn(userDetails);
        SecurityContextHolder.setContext(securityContext);
        given(userRepository.findById(1L)).willReturn(Optional.of(testUser));
    }

    @Test
    void createTask_ReturnsTaskResponse() {
        // given
        mockSecurityContext();
        given(taskMapper.toEntity(any(TaskRequest.class))).willReturn(task);
        given(taskRepository.save(any(Task.class))).willReturn(task);
        given(taskMapper.toResponse(any(Task.class))).willReturn(taskResponse);

        // when
        TaskResponse savedTask = taskService.createTask(taskRequest);

        // then
        assertThat(savedTask).isNotNull();
        assertThat(savedTask.getTitle()).isEqualTo("Test Task");
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void getTaskById_ReturnsTaskResponse() {
        // given
        mockSecurityContext();
        given(taskRepository.findByIdAndUser(1L, testUser)).willReturn(Optional.of(task));
        given(taskMapper.toResponse(task)).willReturn(taskResponse);

        // when
        TaskResponse foundTask = taskService.getTaskById(1L);

        // then
        assertThat(foundTask).isNotNull();
        assertThat(foundTask.getId()).isEqualTo(1L);
    }

    @Test
    void getAllTasks_ReturnsPageOfTaskResponse() {
        // given
        mockSecurityContext();
        Page<Task> taskPage = new PageImpl<>(List.of(task));
        given(taskRepository.findByUser(any(User.class), any(PageRequest.class))).willReturn(taskPage);
        given(taskMapper.toResponse(any(Task.class))).willReturn(taskResponse);

        PageRequest pageRequest = PageRequest.of(0, 10);

        // when
        Page<TaskResponse> result = taskService.getAllTasks(pageRequest, null);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }
}
