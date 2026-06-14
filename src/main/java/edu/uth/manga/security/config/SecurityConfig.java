package edu.uth.manga.security.config;

import edu.uth.manga.security.handler.CustomAuthenticationEntryPoint;
import edu.uth.manga.security.handler.CustomAccessDeniedHandler;
import edu.uth.manga.security.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomAccessDeniedHandler customAccessDeniedHandler,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint
    ) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    }

    /*
     * Password encoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    /*
     * Security config
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                /*
                 * Disable csrf
                 */
                .csrf(csrf -> csrf.disable())

                /*
                 * Stateless session
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .exceptionHandling(exception ->

                        exception

                                .authenticationEntryPoint(
                                        customAuthenticationEntryPoint
                                )

                                .accessDeniedHandler(
                                        customAccessDeniedHandler
                                )
                )
                /*
                 * Authorization
                 */
                .authorizeHttpRequests(auth -> auth

                        /*
                         * Public APIs
                         */
                        .requestMatchers(
                                "/users",
                                "/users/login",
                                "/api/public/**" // ĐÃ MỞ KHÓA API CHO ĐỘC GIẢ TẠI ĐÂY
                        ).permitAll()

                        /*
                         * ADMIN only
                         */
                        .requestMatchers(
                                "/users/all"
                        ).hasRole("ADMIN")

                        /*
                         * USER + ADMIN
                         */
                        .requestMatchers(
                                "/users/profile"
                        ).hasAnyRole(
                                "ADMIN", "READER"
                        )

                        /*
                         * Other APIs
                         */
                        .anyRequest()
                        .authenticated()
                )

                /*
                 * JWT filter
                 */
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}