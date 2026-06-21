package edu.uth.manga.entity;

import edu.uth.manga.enums.RoleType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email", name = "UK_users_email"),
    @UniqueConstraint(columnNames = "username", name = "UK_users_username")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

// Kế thừa để có id, createdAt, updatedAt tự động
public class User extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private RoleType role;
}