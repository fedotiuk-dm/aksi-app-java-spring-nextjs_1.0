package com.aksi.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація безпеки Spring Security.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Slf4j
public class SecurityConfig {

    /**
     * Налаштування ланцюжка фільтрів безпеки.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("Налаштування SecurityFilterChain");

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sess -> sess
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/", false)
                .permitAll())
            .logout(logout -> logout.permitAll())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    // Swagger/OpenAPI - розширений список
                    "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**",
                    "/swagger-resources/**", "/webjars/**", "/swagger",
                    "/api-docs", "/api-docs/**", "/swagger-ui/index.html",
                    "/docs", "/docs/**",
                    // Actuator
                    "/actuator/**",
                    // Auth endpoints (API)
                    "/api/auth/**",
                    // Всі API endpoints
                    "/api/**",
                    // Vaadin ресурси (статичні файли)
                    "/VAADIN/**", "/frontend/**", "/images/**", "/icons/**",
                    "/connect/**", "/vite/**",
                    // Vaadin внутрішні запити (важливо для WebSocket)
                    "/vaadinServlet/**", "/vaadinServlet/UIDL/**",
                    "/vaadinServlet/HEARTBEAT/**", "/vaadinServlet/PUSH/**",
                    // Authentication pages
                    "/login", "/logout"
                ).permitAll()
                // Vaadin framework внутрішні запити
                .requestMatchers(SecurityUtils::isFrameworkInternalRequest).permitAll()
                // Vaadin UI сторінки потребують авторизації (крім login/logout)
                .requestMatchers("/", "/dashboard", "/dashboard/**", "/clients/**", "/orders/**")
                .authenticated()
                // Решта запитів - дозволяємо
                .anyRequest().permitAll()
            );

        return http.build();
    }

    /**
     * Конфігурація CORS.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Менеджер автентифікації.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
