package com.aksi.application.dto.common;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Стандартизований wrapper для всіх успішних API відповідей.
 * Забезпечує консистентний формат для фронтенд розробників і Orval генерації.
 *
 * @param <T> тип даних у відповіді
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Стандартизована відповідь API з даними та метаданими")
public class ApiResponse<T> {

    /**
     * Час створення відповіді.
     */
    @Schema(description = "Час створення відповіді", example = "2024-01-15T10:30:00")
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * HTTP статус код.
     */
    @Schema(description = "HTTP статус код", example = "200")
    private int status;

    /**
     * Повідомлення про результат операції.
     */
    @Schema(description = "Повідомлення про результат операції", example = "Операція виконана успішно")
    private String message;

    /**
     * Основні дані відповіді.
     */
    @Schema(description = "Основні дані відповіді")
    private T data;

    /**
     * Додаткові метадані (пагінація, загальна кількість тощо).
     */
    @Schema(description = "Додаткові метадані відповіді")
    private Object metadata;

    /**
     * Створює успішну відповідь з даними.
     *
     * @param <T> тип даних
     * @param data дані для відповіді
     * @return ApiResponse з даними
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .status(200)
                .message("Успішно")
                .data(data)
                .build();
    }

    /**
     * Створює успішну відповідь з даними та повідомленням.
     *
     * @param <T> тип даних
     * @param data дані для відповіді
     * @param message кастомне повідомлення
     * @return ApiResponse з даними та повідомленням
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .build();
    }

    /**
     * Створює успішну відповідь з даними та метаданими.
     *
     * @param <T> тип даних
     * @param data дані для відповіді
     * @param metadata метадані (пагінація тощо)
     * @return ApiResponse з даними та метаданими
     */
    public static <T> ApiResponse<T> success(T data, Object metadata) {
        return ApiResponse.<T>builder()
                .status(200)
                .message("Успішно")
                .data(data)
                .metadata(metadata)
                .build();
    }

    /**
     * Створює відповідь для створеного ресурсу.
     *
     * @param <T> тип даних
     * @param data створені дані
     * @return ApiResponse зі статусом 201
     */
    public static <T> ApiResponse<T> created(T data) {
        return ApiResponse.<T>builder()
                .status(201)
                .message("Ресурс створено успішно")
                .data(data)
                .build();
    }

    /**
     * Створює відповідь для створеного ресурсу з кастомним повідомленням.
     *
     * @param <T> тип даних
     * @param data створені дані
     * @param message кастомне повідомлення
     * @return ApiResponse зі статусом 201
     */
    public static <T> ApiResponse<T> created(T data, String message) {
        return ApiResponse.<T>builder()
                .status(201)
                .message(message)
                .data(data)
                .build();
    }
}
