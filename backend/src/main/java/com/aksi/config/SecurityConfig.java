package com.aksi.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.aksi.config.security.JwtAuthenticationEntryPoint;
import com.aksi.config.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація Spring Security для AKSI Dry Cleaning Order System.
 *
 * <p>Особливості: - OpenAPI документація доступна без авторизації - CORS налаштований для frontend
 * - Профіль розробки (dev) має мінімальну безпеку - Production використовує JWT авторизацію
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

  private final Environment environment;
  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

  @Value("${cors.allowed-origins:http://localhost:3000,http://localhost:3001}")
  private String corsAllowedOrigins;

  /** Password encoder для хешування паролів Використовує BCrypt algorithm з силою 12. */
  @Bean
  public PasswordEncoder passwordEncoder() {
    log.info("🔐 Configuring BCrypt PasswordEncoder with strength 12");
    return new BCryptPasswordEncoder(12);
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // Перевіряємо чи це dev профіль
    boolean isDevProfile = Arrays.asList(environment.getActiveProfiles()).contains("dev");

    log.info(
        "🔒 Configuring Security for profiles: {}",
        Arrays.toString(environment.getActiveProfiles()));

    http
        // CORS конфігурація
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))

        // CSRF відключено для REST API
        .csrf(AbstractHttpConfigurer::disable)

        // Session management - stateless для REST API
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // Авторизація запитів
        .authorizeHttpRequests(
            authz -> {
              if (isDevProfile) {
                // DEV профіль - дозволяємо все для розробки
                log.info("🔓 DEV mode: allowing all requests");
                authz.anyRequest().permitAll();
              } else {
                // PRODUCTION профіль - налаштована безпека
                authz
                    // Публічні endpoints (без авторизації)
                    .requestMatchers(
                        // Auth endpoints (логін, refresh token)
                        "/api/auth/login",
                        "/api/auth/refresh-token",

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
                        "/error")
                    .permitAll()

                    // Всі інші requests потребують авторизації
                    .anyRequest()
                    .authenticated();
              }
            });

    // Додаємо JWT фільтр перед UsernamePasswordAuthenticationFilter
    if (!isDevProfile) {
      http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
          .exceptionHandling(
              exceptions -> exceptions.authenticationEntryPoint(jwtAuthenticationEntryPoint));
      log.info("🔑 JWT Authentication filter and entry point added to security chain");
    }

    return http.build();
  }

  /** CORS конфігурація для роботи з frontend. */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // Дозволені origins (frontend URLs) - винесено в окремий метод
    configuration.setAllowedOriginPatterns(getAllowedOrigins());

    // Дозволені HTTP методи
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

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

  /** Отримання дозволених origins для CORS. */
  private List<String> getAllowedOrigins() {
    String[] origins = corsAllowedOrigins.split(",");
    return Arrays.stream(origins)
        .map(String::trim) // Видаляємо пробіли
        .toList();
  }
}
