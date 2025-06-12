package com.aksi.util;

import org.springframework.http.ResponseEntity;

import com.aksi.application.dto.common.ApiResponse;

import lombok.experimental.UtilityClass;

/**
 * Утиліти для спрощення роботи з відповідями контролерів Order Wizard.
 * Мінімальний набір методів для уникнення дублювання коду.
 */
@UtilityClass
public class ControllerUtils {

    /**
     * Створює успішну відповідь з даними.
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(T data) {
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * Створює успішну відповідь з даними та повідомленням.
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(T data, String message) {
        return ResponseEntity.ok(ApiResponse.success(data, message));
    }

    /**
     * Створює відповідь для створеного ресурсу.
     */
    public static <T> ResponseEntity<ApiResponse<T>> created(T data) {
        return ResponseEntity.status(201).body(ApiResponse.created(data));
    }

    /**
     * Створює відповідь для створеного ресурсу з повідомленням.
     */
    public static <T> ResponseEntity<ApiResponse<T>> created(T data, String message) {
        return ResponseEntity.status(201).body(ApiResponse.created(data, message));
    }
}
