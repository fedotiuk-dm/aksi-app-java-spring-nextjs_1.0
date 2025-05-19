package com.aksi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація JSON серіалізації.
 */
@Configuration
@Slf4j
public class JacksonConfig {

    /**
     * Налаштування ObjectMapper для більш предбачуваної серіалізації.
     * @return налаштований ObjectMapper для серіалізації/десеріалізації JSON
     */
    @Bean
    public ObjectMapper objectMapper() {
        log.info("Налаштування ObjectMapper");
        ObjectMapper mapper = new ObjectMapper();

        // Додаємо підтримку Java 8 Date/Time API (LocalDateTime, LocalDate, тощо)
        mapper.registerModule(new JavaTimeModule());

        // Вимикаємо серіалізацію дат як масиви timestamp
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        // Не включати null поля
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        return mapper;
    }
}
