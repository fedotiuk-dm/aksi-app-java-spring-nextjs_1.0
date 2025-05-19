package com.aksi.application.dto.common;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

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
public class ErrorResponse {

    /**
     * Час виникнення помилки.
     */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * HTTP статус код.
     */
    private int status;

    /**
     * Повідомлення про помилку.
     */
    private String message;

    /**
     * Тип помилки (назва винятку).
     */
    private String errorType;

    /**
     * Шлях до ресурсу.
     */
    private String path;

    /**
     * HTTP метод запиту.
     */
    private String method;

    /**
     * Унікальний ідентифікатор помилки.
     */
    private String errorId;

    /**
     * Додаткові деталі помилки (зазвичай для валідації).
     */
    private Map<String, String> errors;

    /**
     * Стек трейс помилки (тільки в dev середовищі).
     */
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

