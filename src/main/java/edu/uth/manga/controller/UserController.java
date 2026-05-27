package edu.uth.manga.controller;

import edu.uth.manga.entity.User;
import edu.uth.manga.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public User createUser(@RequestBody User user) {

        return userService.createUser(user);
    }

    /*
     * API lấy toàn bộ user
     * GET /users
     */
    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }
}