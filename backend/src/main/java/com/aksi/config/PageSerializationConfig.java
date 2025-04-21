package com.aksi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;

import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація для правильної серіалізації сторінкових даних (Page<T>).
 * Усуває попередження:
 * "Serializing PageImpl instances as-is is not supported, meaning that there is no guarantee about the stability of the resulting JSON structure!"
 */
@Configuration
@EnableSpringDataWebSupport
@Slf4j
public class PageSerializationConfig {

    /**
     * Налаштування кастомізатора для обробки Pageable параметрів.
     * 
     * @return PageableHandlerMethodArgumentResolverCustomizer для налаштування параметрів пагінації
     */
    @Bean
    public PageableHandlerMethodArgumentResolverCustomizer customizer() {
        log.info("Налаштування кастомізатора пагінації для стабільної JSON структури");
        return pageableResolver -> {
            pageableResolver.setOneIndexedParameters(true); // Пагінація починається з 1, а не з 0
            pageableResolver.setMaxPageSize(100); // Обмеження максимального розміру сторінки
            pageableResolver.setFallbackPageable(PageRequest.of(0, 20)); // За замовчуванням
        };
    }
}
