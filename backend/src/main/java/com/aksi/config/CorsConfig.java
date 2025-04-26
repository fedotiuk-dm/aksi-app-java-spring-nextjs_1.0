package com.aksi.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Додаткова конфігурація для CORS.
 * Цей клас реєструє глобальний CORS фільтр, який буде застосовуватися
 * до всіх запитів, включаючи Authentication і OPTIONS запити
 */
@Configuration
public class CorsConfig {

    /**
     * Створюємо і реєструємо CORS фільтр з високим пріоритетом.
     * @return реєстрація фільтра CORS з налаштуванням високого пріоритету
     */
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Дозволяємо локальний доступ
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://127.0.0.1:3000");
        // Дозволяємо доступ з Docker контейнера
        config.addAllowedOrigin("http://frontend:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        
        // Надаємо високий пріоритет, щоб фільтр виконувався перед усіма іншими
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        
        return bean;
    }
} 
