package edu.uth.manga.dto.response;
import edu.uth.manga.enums.RoleType;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private RoleType role;

    //getter/setter

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public RoleType getRole() {
        return role;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }
}
