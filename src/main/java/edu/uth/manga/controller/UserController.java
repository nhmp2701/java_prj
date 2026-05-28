package edu.uth.manga.controller;

import edu.uth.manga.entity.User;
import edu.uth.manga.enums.RoleType;
import edu.uth.manga.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import edu.uth.manga.dto.request.UserCreationRequest;
import edu.uth.manga.dto.response.ApiResponse;
import edu.uth.manga.dto.response.UserResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    /*
     * Spring tự inject UserService
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /*
     * API tạo user
     * POST /users
     */
    @PostMapping
    public ApiResponse<UserResponse> createUser(
            @Valid @RequestBody UserCreationRequest request
    ) {

        // Tạo user entity
        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(RoleType.ADMIN);

        // Save database
        User savedUser = userService.createUser(user);

        // Convert entity -> response DTO
        UserResponse response = new UserResponse();

        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());

        // Create standardized response
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();

        apiResponse.setSuccess(true);
        apiResponse.setMessage("User created successfully");
        apiResponse.setData(response);

        return apiResponse;
    }

    /*
     * API lấy toàn bộ user
     * GET /users
     */
    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {

        // Lấy danh sách user từ database
        List<User> users = userService.getAllUsers();

        // Tạo list response DTO
        List<UserResponse> responses = users.stream().map(user -> {

            UserResponse response = new UserResponse();

            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole());

            return response;

        }).toList();

        // Create standardized response
        ApiResponse<List<UserResponse>> apiResponse = new ApiResponse<>();

        apiResponse.setSuccess(true);
        apiResponse.setMessage("Get all users successfully");
        apiResponse.setData(responses);

        return apiResponse;
    }
}