package edu.uth.manga.service;

import edu.uth.manga.entity.User;
import edu.uth.manga.enums.RoleType;
import java.util.List;

public interface UserService {
    User createUser(User user);
    List<User> getAllUsers();
    User findByEmail(String email);
    boolean checkPassword(String rawPassword, String encodedPassword);
    User updateUserRole(Long userId, RoleType newRole);
}