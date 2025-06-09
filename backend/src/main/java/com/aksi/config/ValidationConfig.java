package com.aksi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

/**
 * Конфігурація для Jakarta Bean Validation.
 */
@Configuration
public class ValidationConfig {

    /**
     * Bean для Jakarta Bean Validation Validator.
     */
    @Bean
    public Validator validator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        return factory.getValidator();
    }
}
