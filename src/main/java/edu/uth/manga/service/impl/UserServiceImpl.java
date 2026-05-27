package edu.uth.manga.service.impl;

import edu.uth.manga.entity.User;
import edu.uth.manga.repository.UserRepository;
import edu.uth.manga.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    /*
     * Constructor Injection
     * Spring tự inject UserRepository vào đây
     */
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(User user) {

        // lưu user vào database
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {

        // lấy toàn bộ user
        return userRepository.findAll();
    }
}