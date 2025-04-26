package com.aksi.exception;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Модель для уніфікованої відповіді API з помилками.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {
    
    /**
     * HTTP статус помилки.
     */
    private int status;
    
    /**
     * Загальне повідомлення про помилку.
     */
    private String message;
    
    /**
     * Детальний список помилок (для валідації полів).
     */
    private Map<String, String> errors;
    
    /**
     * Час виникнення помилки.
     */
    private LocalDateTime timestamp;
} 
