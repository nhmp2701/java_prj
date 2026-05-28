package edu.uth.manga.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserCreationRequest {

    // Không được để trống
    @NotBlank(message = "Username must not be blank")
    private String username;

    // Kiểm tra đúng format email
    @Email(message = "Email is invalid")
    @NotBlank(message = "Email must not be blank")
    private String email;

    // Password tối thiểu 6 ký tự
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    // getter/setter
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}