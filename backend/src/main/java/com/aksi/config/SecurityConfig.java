package com.aksi.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.extern.slf4j.Slf4j;

/**
 * Security configuration for the application. - Development profile: security disabled for easier
 * development - Production profile: cookie-based authentication with session storage
 */
@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  @Value("${app.cors.allowed-origins:http://localhost:3000}")
  private String allowedOrigins;

  private final UserDetailsService userDetailsService;

  public SecurityConfig(UserDetailsService userDetailsService) {
    this.userDetailsService = userDetailsService;
    log.info(
        "🔐 Configuring SecurityConfig with UserDetailsService: {}",
        userDetailsService.getClass().getSimpleName());
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(
      AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  @Bean
  @Profile("dev")
  public SecurityFilterChain devFilterChain(HttpSecurity http) throws Exception {
    log.info("🔓 DEV Security: All endpoints are open without authentication");

    return http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
        .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
        .build();
  }

  @Bean
  @Profile("!dev")
  public SecurityFilterChain prodFilterChain(HttpSecurity http) throws Exception {
    log.info("🔒 PROD Security: Authentication required for protected endpoints");
    log.info("🔐 Using UserDetailsService: {}", userDetailsService.getClass().getSimpleName());

    // Configure authentication with our UserDetailsService
    AuthenticationManagerBuilder authBuilder =
        http.getSharedObject(AuthenticationManagerBuilder.class);
    authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());

    http
        // CORS configuration
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))

        // Session management
        .sessionManagement(
            session ->
                session
                    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                    .maximumSessions(1)
                    .maxSessionsPreventsLogin(false))

        // CSRF protection with cookie repository
        .csrf(
            csrf ->
                csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .ignoringRequestMatchers("/api/auth/login"))

        // Authorization rules
        .authorizeHttpRequests(
            auth ->
                auth
                    // Public API endpoints
                    .requestMatchers("/api/auth/login")
                    .permitAll()

                    // OpenAPI documentation
                    .requestMatchers(
                        "/v3/api-docs/**", "/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                    .permitAll()

                    // Actuator endpoints
                    .requestMatchers("/management/**")
                    .hasRole("ADMIN")

                    // Admin endpoints
                    .requestMatchers("/api/users/**")
                    .hasRole("ADMIN")

                    // All other API endpoints require authentication
                    .requestMatchers("/api/**")
                    .authenticated()

                    // Everything else
                    .anyRequest()
                    .authenticated())

        // Logout configuration
        .logout(
            logout ->
                logout
                    .logoutUrl("/api/auth/logout")
                    .deleteCookies("AKSISESSIONID", "XSRF-TOKEN")
                    .invalidateHttpSession(true)
                    .clearAuthentication(true));

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // Parse allowed origins from comma-separated string
    List<String> origins = Arrays.asList(allowedOrigins.split(","));
    configuration.setAllowedOrigins(origins);

    // Allow all standard HTTP methods
    configuration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

    // Allow common headers
    configuration.setAllowedHeaders(
        Arrays.asList(
            "Authorization", "Content-Type", "Accept", "X-Requested-With", "X-XSRF-TOKEN"));

    // Expose headers that frontend might need
    configuration.setExposedHeaders(
        Arrays.asList("X-Total-Count", "X-Page-Number", "X-Page-Size", "X-Total-Pages"));

    // Allow credentials (cookies)
    configuration.setAllowCredentials(true);

    // Cache preflight response for 1 hour
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    log.info("🌐 CORS configured for origins: {}", origins);
    log.info("🍪 CORS allows credentials: {}", configuration.getAllowCredentials());

    return source;
  }
}
