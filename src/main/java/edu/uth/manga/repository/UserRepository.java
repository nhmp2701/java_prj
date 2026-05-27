package edu.uth.manga.repository;

import edu.uth.manga.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/*
 * JpaRepository<User, Long>
 *
 * User  = entity quản lý
 * Long  = kiểu dữ liệu của id
 */
public interface UserRepository extends JpaRepository<User, Long> {

}