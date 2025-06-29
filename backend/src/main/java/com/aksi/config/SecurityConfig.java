package com.aksi.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація Spring Security для AKSI Dry Cleaning Order System.
 *
 * Особливості:
 * - OpenAPI документація доступна без авторизації
 * - CORS налаштований для frontend
 * - Профіль розробки (dev) має мінімальну безпеку
 * - Production використовує JWT авторизацію
 */
@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final Environment environment;

    /**
     * Password encoder для хешування паролів
     * Використовує BCrypt algorithm з силою 12
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        log.info("🔐 Configuring BCrypt PasswordEncoder with strength 12");
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Перевіряємо чи це dev профіль
        boolean isDevProfile = Arrays.asList(environment.getActiveProfiles()).contains("dev");

        log.info("🔒 Configuring Security for profiles: {}",
                 Arrays.toString(environment.getActiveProfiles()));

        http
            // CORS конфігурація
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // CSRF відключено для REST API
            .csrf(csrf -> csrf.disable())

            // Session management - stateless для REST API
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Авторизація запитів
            .authorizeHttpRequests(authz -> {
                if (isDevProfile) {
                    // DEV профіль - дозволяємо все для розробки
                    log.info("🔓 DEV mode: allowing all requests");
                    authz.anyRequest().permitAll();
                } else {
                    // PRODUCTION профіль - налаштована безпека
                    authz
                        // Публічні endpoints (без авторизації)
                        .requestMatchers(
                            // OpenAPI документація
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/swagger-resources/**",
                            "/webjars/**",

                            // Health checks
                            "/actuator/health/**",
                            "/actuator/info",

                            // Статичні ресурси
                            "/favicon.ico",
                            "/error"
                        ).permitAll()

                        // Всі інші requests потребують авторизації
                        .anyRequest().authenticated();
                }
            });

        // HTTP Basic для development (тимчасово)
        if (!isDevProfile) {
            http.httpBasic(basic -> {});
        }

        return http.build();
    }

    /**
     * CORS конфігурація для роботи з frontend
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Дозволені origins (frontend URLs)
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",     // Next.js dev server
            "http://localhost",          // Traefik frontend
            "https://aksi.com.ua",       // Production frontend
            "https://*.aksi.com.ua"      // Production subdomains
        ));

        // Дозволені HTTP методи
        configuration.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        // Дозволені headers
        configuration.setAllowedHeaders(List.of("*"));

        // Дозволяємо credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // Кешування preflight запитів
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        log.info("🌐 CORS configured for origins: {}", configuration.getAllowedOriginPatterns());

        return source;
    }
}
