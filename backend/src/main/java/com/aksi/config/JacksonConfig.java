package com.aksi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * Jackson ObjectMapper configuration. Configures JSON serialization settings for the application.
 */
@Configuration
public class JacksonConfig {

  @Bean
  public ObjectMapper objectMapper() {
    ObjectMapper mapper = new ObjectMapper();

    // Register JavaTimeModule for Java 8 time support
    mapper.registerModule(new JavaTimeModule());

    // Configure to write dates as timestamps
    mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    // Pretty print for development (can be disabled in production)
    mapper.enable(SerializationFeature.INDENT_OUTPUT);

    return mapper;
  }
}
