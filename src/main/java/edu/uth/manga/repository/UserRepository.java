package edu.uth.manga.repository;

import edu.uth.manga.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository
        extends JpaRepository<User, Long> {

    /*
     * Tìm user theo email
     */
    User findByEmail(String email);
}