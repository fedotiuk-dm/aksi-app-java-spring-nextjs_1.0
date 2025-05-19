package com.aksi.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація безпеки Spring Security.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Налаштування ланцюжка фільтрів безпеки.
     * @param http об'єкт HttpSecurity
     * @return налаштований SecurityFilterChain
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("Налаштування SecurityFilterChain");
        try {
            // Визначення активного профілю
            String activeProfile = System.getProperty("spring.profiles.active",
                    System.getenv("SPRING_PROFILES_ACTIVE") != null ?
                        System.getenv("SPRING_PROFILES_ACTIVE") : "dev");

            // Загальні URL-шляхи, доступні всім
            String[] publicUrls = {
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/webjars/**",
                "/swagger-resources/**",
                "/actuator/**"
            };

            // Спільна конфігурація для всіх профілів
            http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

            // Специфічна конфігурація залежно від профілю
            if ("dev".equals(activeProfile)) {
                http.authorizeHttpRequests(auth -> auth
                    .requestMatchers(publicUrls).permitAll()
                    .anyRequest().permitAll()
                );
            } else {
                http.authorizeHttpRequests(auth -> auth
                    .requestMatchers(publicUrls).permitAll()
                    .requestMatchers("/auth/**").permitAll()
                    .anyRequest().authenticated()
                );
            }

            log.info("SecurityFilterChain успішно налаштовано");
            return http.build();
        } catch (Exception e) {
            log.error("Помилка при налаштуванні SecurityFilterChain: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Конфігурація CORS (Cross-Origin Resource Sharing).
     * @return джерело конфігурації CORS для забезпечення міждоменних запитів
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        configuration.setAllowCredentials(false); // Змінюємо на false при allowedOrigins="*"
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Менеджер автентифікації для логіну та реєстрації.
     * @param config конфігурація
     * @return менеджер автентифікації для обробки запитів авторизації
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
