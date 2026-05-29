package edu.uth.manga.service;

import edu.uth.manga.entity.User;
import edu.uth.manga.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    /*
     * Constructor injection
     */
    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /*
     * Create user
     */
    public User createUser(User user) {

        // Hash password
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    /*
     * Get all users
     */
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    /*
     * Find user by email
     */
    public User findByEmail(String email) {

        return userRepository.findByEmail(email);
    }

    /*
     * Check password login
     */
    public boolean checkPassword(
            String rawPassword,
            String encodedPassword
    ) {

        return passwordEncoder.matches(
                rawPassword,
                encodedPassword
        );
    }
}