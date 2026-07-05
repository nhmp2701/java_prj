package edu.uth.manga.security.config;

import edu.uth.manga.security.handler.CustomAuthenticationEntryPoint;
import edu.uth.manga.security.handler.CustomAccessDeniedHandler;
import edu.uth.manga.security.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import lombok.RequiredArgsConstructor;
import java.util.Arrays;

@RequiredArgsConstructor
@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    // Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configure CORS with restricted origins
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:8080",
            "https://yourdomain.com"
            // Add your allowed origins here
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Security config
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        http
                // Enable CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Disable csrf
                .csrf(csrf -> csrf.disable())
                // Stateless session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception ->
                        exception
                                .authenticationEntryPoint(customAuthenticationEntryPoint)
                                .accessDeniedHandler(customAccessDeniedHandler)
                )
                // Authorization
                .authorizeHttpRequests(auth -> auth
                        // Public APIs for registration, login, and reader-friendly content
                        .requestMatchers("/users", "/users/login", "/api/public/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/projects", "/projects/**", "/api/chapters/manga/**").authenticated()

                        // Admin-only user management
                        .requestMatchers("/users/all").hasRole("ADMIN")
                        .requestMatchers("/users/profile").authenticated()

                        // Project management
                        .requestMatchers(HttpMethod.POST, "/projects").hasAnyRole("ADMIN", "TEAM_LEAD")
                        .requestMatchers(HttpMethod.PUT, "/projects/**").hasAnyRole("ADMIN", "TEAM_LEAD")
                        .requestMatchers(HttpMethod.DELETE, "/projects/**").hasRole("ADMIN")

                        // Chapter workflow
                        .requestMatchers(HttpMethod.POST, "/api/chapters").hasAnyRole("ADMIN", "TEAM_LEAD", "CREATOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/chapters/*/status").hasAnyRole("ADMIN", "TEAM_LEAD", "CREATOR", "EDITOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/chapters/*/publish").hasAnyRole("ADMIN", "TEAM_LEAD")

                        // Asset and review flows
                        .requestMatchers("/api/assets/upload").hasAnyRole("ADMIN", "TEAM_LEAD", "CREATOR")
                        .requestMatchers("/api/assets/*/approve", "/api/assets/*/reject").hasAnyRole("ADMIN", "EDITOR", "TEAM_LEAD")
                        .requestMatchers("/api/assets/*/comments").authenticated()

                        // Task board access
                        .requestMatchers("/api/tasks/**").hasAnyRole("ADMIN", "TEAM_LEAD", "CREATOR", "EDITOR")

                        // All other endpoints require authentication
                        .anyRequest()
                        .authenticated()
                )

                // JWT filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
