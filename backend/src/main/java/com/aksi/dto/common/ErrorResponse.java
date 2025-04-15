package com.aksi.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO для відповіді з помилкою
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    
    /**
     * Час виникнення помилки
     */
    private LocalDateTime timestamp = LocalDateTime.now();
    
    /**
     * HTTP статус код
     */
    private int status;
    
    /**
     * Повідомлення про помилку
     */
    private String message;
    
    /**
     * Додаткові деталі помилки
     */
    private Map<String, String> errors;
    
    /**
     * Конструктор для простої помилки без деталей
     * @param status HTTP статус код
     * @param message повідомлення про помилку
     */
    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }
    
    /**
     * Конструктор для помилки з деталями валідації
     * @param status HTTP статус код
     * @param message повідомлення про помилку
     * @param errors деталі помилок валідації
     */
    public ErrorResponse(int status, String message, Map<String, String> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
} 