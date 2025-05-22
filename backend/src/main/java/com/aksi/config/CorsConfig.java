package com.aksi.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.env.Environment;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Розширена конфігурація для CORS.
 * Цей клас реєструє глобальний CORS фільтр, який буде застосовуватися
 * до всіх запитів, включаючи Authentication і OPTIONS запити
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class CorsConfig {

    private final Environment environment;

    @Value("${spring.web.cors.allowed-origins:http://localhost:3000,http://127.0.0.1:3000,http://frontend:3000}")
    private String allowedOriginsString;

    /**
     * Створюємо і реєструємо CORS фільтр з високим пріоритетом.
     * @return реєстрація фільтра CORS з налаштуванням високого пріоритету
     */
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        // Розділяємо рядок з дозволеними джерелами на список
        List<String> allowedOrigins = Arrays.asList(allowedOriginsString.split(","));

        // Додаємо всі дозволені джерела
        allowedOrigins.forEach(origin -> {
            config.addAllowedOrigin(origin.trim());
            log.debug("Додано дозволене джерело CORS: {}", origin.trim());
        });

        // Додаткові дозволені джерела для різних середовищ
        if (Arrays.asList(environment.getActiveProfiles()).contains("dev")) {
            // Додаткові джерела для розробки
            config.addAllowedOrigin("http://localhost:8080");
            config.addAllowedOrigin("http://localhost:8081");
            log.debug("Додано додаткові джерела для dev-середовища");
        }

        // Дозволяємо всі заголовки
        config.addAllowedHeader("*");

        // Експозиція важливих заголовків для клієнта
        config.addExposedHeader("Authorization");
        config.addExposedHeader("Content-Disposition"); // Для завантаження файлів
        config.addExposedHeader("X-Total-Count"); // Для пагінації
        config.addExposedHeader("Access-Control-Allow-Origin");
        config.addExposedHeader("Access-Control-Allow-Credentials");

        // Дозволяємо всі методи
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("PATCH");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("HEAD");

        // Збільшуємо час кешування пре-флайт запитів
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));

        // Надаємо високий пріоритет, щоб фільтр виконувався перед усіма іншими
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);

        log.info("CORS фільтр успішно налаштовано з {} дозволеними джерелами", allowedOrigins.size());

        return bean;
    }
}
