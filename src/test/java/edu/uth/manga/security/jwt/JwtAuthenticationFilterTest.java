package edu.uth.manga.security.jwt;

import edu.uth.manga.security.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    @Test
    void doFilterInternal_setsCurrentUserIdAttributeFromToken() throws ServletException, IOException {
        when(request.getHeader("Authorization")).thenReturn("Bearer test-token");
        when(jwtService.isTokenValid("test-token")).thenReturn(true);
        when(jwtService.extractEmail("test-token")).thenReturn("artist@example.com");
        when(jwtService.extractRole("test-token")).thenReturn("ARTIST");
        when(jwtService.extractUserId("test-token")).thenReturn(42L);

        filter.doFilterInternal(request, response, filterChain);

        verify(request).setAttribute("currentUserId", 42L);
        verify(filterChain).doFilter(request, response);
    }
}
