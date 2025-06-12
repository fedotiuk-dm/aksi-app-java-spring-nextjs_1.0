package com.aksi.application.dto.common;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Уніфікований DTO для відповіді з помилкою.
 * Створений для забезпечення консистентного формату помилок для фронтенд розробників
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Стандартизована відповідь з помилкою")
public class ErrorResponse {

    /**
     * Час виникнення помилки.
     */
    @Schema(description = "Час виникнення помилки", example = "2024-01-15T10:30:00")
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * HTTP статус код.
     */
    @Schema(description = "HTTP статус код", example = "400")
    private int status;

    /**
     * Повідомлення про помилку.
     */
    @Schema(description = "Повідомлення про помилку", example = "Неправильні дані запиту")
    private String message;

    /**
     * Тип помилки (назва винятку).
     */
    @Schema(description = "Тип помилки", example = "ValidationException")
    private String errorType;

    /**
     * Шлях до ресурсу.
     */
    @Schema(description = "Шлях до ресурсу", example = "/api/v1/wizard/stage1")
    private String path;

    /**
     * HTTP метод запиту.
     */
    @Schema(description = "HTTP метод запиту", example = "POST")
    private String method;

    /**
     * Унікальний ідентифікатор помилки.
     */
    @Schema(description = "Унікальний ідентифікатор помилки", example = "ERR-2024-001-12345")
    private String errorId;

    /**
     * Додаткові деталі помилки (зазвичай для валідації).
     */
    @Schema(description = "Додаткові деталі помилки", example = "{ \"firstName\": \"Ім'я є обов'язковим\", \"phone\": \"Неправильний формат телефону\" }")
    private Map<String, String> errors;

    /**
     * Стек трейс помилки (тільки в dev середовищі).
     */
    @Schema(description = "Стек трейс помилки (тільки в dev)")
    private List<String> stackTrace;

    /**
     * Додавання рядка стеку до списку.
     * @param line параметр line
     */
    public void addStackTraceLine(String line) {
        if (stackTrace == null) {
            stackTrace = new ArrayList<>();
        }
        stackTrace.add(line);
    }

    /**
     * Конструктор для простої помилки без деталей.
     * @param status HTTP статус код
     * @param message повідомлення про помилку
     */
    public ErrorResponse(int status, String message) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
    }

    /**
     * Конструктор для помилки з деталями валідації.
     * @param status HTTP статус код
     * @param message повідомлення про помилку
     * @param errors деталі помилок валідації
     */
    public ErrorResponse(int status, String message, Map<String, String> errors) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}

