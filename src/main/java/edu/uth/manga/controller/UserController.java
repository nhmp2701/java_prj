package edu.uth.manga.controller;
import edu.uth.manga.dto.response.ApiResponse;
import edu.uth.manga.dto.request.LoginRequest;
import edu.uth.manga.dto.request.UserCreationRequest;
import edu.uth.manga.dto.response.LoginResponse;
import edu.uth.manga.dto.response.UserResponse;
import edu.uth.manga.entity.User;
import edu.uth.manga.enums.RoleType;
import edu.uth.manga.security.service.JwtService;
import edu.uth.manga.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import java.util.List;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;

    // Register API
    @PostMapping
    public ApiResponse<UserResponse> createUser(
            @Valid @RequestBody UserCreationRequest request
    ) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(RoleType.READER);

        User savedUser = userService.createUser(user);

        UserResponse response = new UserResponse();

        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());

        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage("User created successfully");
        apiResponse.setData(response);

        return apiResponse;
    }

    // Login API
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {
        User user = userService.findByEmail(request.getEmail());
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        boolean isPasswordCorrect = userService.checkPassword(request.getPassword(), user.getPassword());

        if (!isPasswordCorrect) {
            throw new RuntimeException("Password is incorrect");
        }

        String token = jwtService.generateToken(user);
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        ApiResponse<LoginResponse> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage("Login successfully");
        apiResponse.setData(response);
        return apiResponse;
    }

    // Get all users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();

        List<UserResponse> responses = users.stream().map(user -> {
                    UserResponse response = new UserResponse();
                    response.setId(user.getId());
                    response.setUsername(user.getUsername());
                    response.setEmail(user.getEmail());
                    response.setRole(user.getRole());
                    return response;
                }).toList();

        ApiResponse<List<UserResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage("Get all users successfully");
        apiResponse.setData(responses);
        return apiResponse;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/profile")
    public ApiResponse<UserResponse> getProfile(
            Authentication authentication
    ) {
        // Lấy email từ JWT
        String email = authentication.getName();

        // Tìm user trong database
        User user = userService.findByEmail(email);

        // Convert entity -> DTO
        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        // Standard response
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();

        apiResponse.setSuccess(true);
        apiResponse.setMessage("Get profile successfully");
        apiResponse.setData(response);

        return apiResponse;
    }

    @GetMapping("/count-readers")
    public ApiResponse<Long> getReaderCount() {
        long count = userService.getAllUsers().stream()
                .filter(u -> u.getRole() == edu.uth.manga.enums.RoleType.READER)
                .count();
        ApiResponse<Long> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage("Lấy số lượng độc giả thành công");
        apiResponse.setData(count);
        return apiResponse;
    }
}