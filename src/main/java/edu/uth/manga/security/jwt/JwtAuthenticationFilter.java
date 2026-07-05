package edu.uth.manga.security.jwt;

import edu.uth.manga.security.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import lombok.AllArgsConstructor;
import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Lấy Authorization header
        String authHeader = request.getHeader("Authorization");

        // Nếu không có Bearer token -> đi tiếp
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Cắt token ra khỏi Bearer
        String token = authHeader.substring(7);

        // Validate token
        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Lấy email
        String email = jwtService.extractEmail(token);

        // Lấy role
        String role = jwtService.extractRole(token);
        Long userId = jwtService.extractUserId(token);

        request.setAttribute("currentUserId", userId);

        // Tạo authentication object
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        User.builder()
                                .username(email)
                                .password("")
                                .roles(role)
                                .build(),
                        null,

                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );

        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // Set authentication vào security context
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // Đi tiếp request
        filterChain.doFilter(request, response);
    }
}