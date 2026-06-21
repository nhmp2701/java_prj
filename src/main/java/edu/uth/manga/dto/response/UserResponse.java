package edu.uth.manga.dto.response;
import edu.uth.manga.enums.RoleType;
import lombok.Setter;
import lombok.ToString;
import lombok.Getter;

@Getter
@Setter
@ToString
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private RoleType role;

}
