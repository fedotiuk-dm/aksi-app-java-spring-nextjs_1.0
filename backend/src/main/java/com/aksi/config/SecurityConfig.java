package com.aksi.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.aksi.domain.auth.security.JwtAuthenticationEntryPoint;
import com.aksi.domain.auth.security.JwtAuthenticationFilter;
import com.aksi.domain.auth.service.UserDetailsProvider;

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
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final Environment environment;
  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final UserDetailsProvider userDetailsProvider;

  @Value("${cors.allowed-origins:http://localhost:3000,http://localhost:3001,http://localhost}")
  private String corsAllowedOrigins;

  /** Password encoder для хешування паролів Використовує BCrypt algorithm з силою 12. */
  @Bean
  public PasswordEncoder passwordEncoder() {
    log.info("🔐 Configuring BCrypt PasswordEncoder with strength 12");
    return new BCryptPasswordEncoder(12);
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http, PasswordEncoder passwordEncoder)
      throws Exception {
    // Перевіряємо чи це dev профіль
    boolean isDevProfile = Arrays.asList(environment.getActiveProfiles()).contains("dev");

    log.info(
        "🔒 Configuring Security for profiles: {}",
        Arrays.toString(environment.getActiveProfiles()));

    http
        // CORS конфігурація
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))

        // CSRF конфігурація для cookie-based auth
        .csrf(
            csrf -> {
              if (isDevProfile) {
                // DEV профіль - CSRF відключено для зручності розробки
                csrf.disable();
                log.info("🔓 DEV mode: CSRF protection disabled");
              } else {
                // PRODUCTION профіль - CSRF увімкнено з cookie repository
                csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                    // Виключаємо деякі endpoints від CSRF перевірки
                    .ignoringRequestMatchers(
                        "/api/auth/login", // Login не потребує CSRF токену
                        "/api/auth/refresh-token", // Refresh використовує свій токен
                        "/v3/api-docs/**", // OpenAPI
                        "/swagger-ui/**", // Swagger UI
                        "/actuator/**" // Actuator endpoints
                        );
                log.info("🔒 PROD mode: CSRF protection enabled with cookie repository");
              }
            })

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
                        // Auth endpoints (логін, logout, refresh token)
                        "/api/auth/login",
                        "/api/auth/logout",
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
    http.authenticationProvider(authenticationProvider(passwordEncoder))
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .exceptionHandling(
            exceptions -> exceptions.authenticationEntryPoint(jwtAuthenticationEntryPoint));
    log.info(
        "🔑 JWT Authentication filter and entry point added to security chain (profile: {})",
        isDevProfile ? "dev" : "prod");

    return http.build();
  }

  /** Configure authentication provider */
  @Bean
  public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
    // Using the recommended constructor-based approach for Spring Security 6.0+
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsProvider);
    authProvider.setPasswordEncoder(passwordEncoder);
    return authProvider;
  }

  /** Configure authentication manager */
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
      throws Exception {
    return config.getAuthenticationManager();
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
