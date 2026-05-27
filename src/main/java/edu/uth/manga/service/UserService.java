package edu.uth.manga.service;

import edu.uth.manga.entity.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    List<User> getAllUsers();
}