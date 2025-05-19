package com.aksi.util;

import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

/**
 * Утилітарний клас для формування стандартизованих API-відповідей.
 * Спрощує формування та логування відповідей у контролерах.
 */
@UtilityClass
@Slf4j
public class ApiResponseUtils {

    // ========== 2XX: Успішні відповіді ==========

    /**
     * Створює API-відповідь зі статусом 200 OK.
     *
     * @param <T> тип даних відповіді
     * @param data дані для включення у відповідь
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з даними та статусом 200 OK
     */
    public <T> ResponseEntity<T> ok(T data, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.debug(logMessage, logArgs);
        }
        return ResponseEntity.ok(data);
    }

    /**
     * Створює API-відповідь зі статусом 201 Created.
     *
     * @param <T> тип даних відповіді
     * @param data дані для включення у відповідь
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з даними та статусом 201 Created
     */
    public <T> ResponseEntity<T> created(T data, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.debug(logMessage, logArgs);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(data);
    }

    /**
     * Створює API-відповідь зі статусом 204 No Content.
     *
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity без тіла та зі статусом 204 No Content
     */
    public ResponseEntity<Void> noContent(String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.debug(logMessage, logArgs);
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * Створює API-відповідь зі статусом 202 Accepted.
     *
     * @param <T> тип даних відповіді
     * @param data дані для включення у відповідь (опціонально)
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з даними та статусом 202 Accepted
     */
    public <T> ResponseEntity<T> accepted(T data, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.debug(logMessage, logArgs);
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(data);
    }

    // ========== 4XX: Помилки клієнта ==========

    /**
     * Створює API-відповідь зі статусом 400 Bad Request.
     *
     * @param message повідомлення про помилку
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з повідомленням про помилку та статусом 400
     */
    public ResponseEntity<Map<String, String>> badRequest(String message, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.warn(logMessage, logArgs);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("error", message));
    }

    /**
     * Створює API-відповідь зі статусом 401 Unauthorized.
     *
     * @param message повідомлення про помилку
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з повідомленням про помилку та статусом 401
     */
    public ResponseEntity<Map<String, String>> unauthorized(String message, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.warn(logMessage, logArgs);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", message));
    }

    /**
     * Створює API-відповідь зі статусом 403 Forbidden.
     *
     * @param message повідомлення про помилку
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з повідомленням про помилку та статусом 403
     */
    public ResponseEntity<Map<String, String>> forbidden(String message, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.warn(logMessage, logArgs);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Collections.singletonMap("error", message));
    }

    /**
     * Створює API-відповідь зі статусом 404 Not Found.
     *
     * @param message повідомлення про помилку
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з повідомленням про помилку та статусом 404
     */
    public ResponseEntity<Map<String, String>> notFound(String message, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.warn(logMessage, logArgs);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("error", message));
    }

    /**
     * Створює API-відповідь зі статусом 409 Conflict.
     *
     * @param message повідомлення про помилку
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з повідомленням про помилку та статусом 409
     */
    public ResponseEntity<Map<String, String>> conflict(String message, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.warn(logMessage, logArgs);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Collections.singletonMap("error", message));
    }

    /**
     * Створює API-відповідь зі статусом 422 Unprocessable Entity.
     *
     * @param validationErrors карта помилок валідації
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з помилками валідації та статусом 422
     */
    public ResponseEntity<Map<String, Object>> validationError(
            Map<String, Object> validationErrors, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.warn(logMessage, logArgs);
        }
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(validationErrors);
    }

    // ========== 5XX: Помилки сервера ==========

    /**
     * Створює API-відповідь зі статусом 500 Internal Server Error.
     *
     * @param message повідомлення про помилку
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з повідомленням про помилку та статусом 500
     */
    public ResponseEntity<Map<String, String>> internalServerError(
            String message, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.error(logMessage, logArgs);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", message));
    }

    /**
     * Створює API-відповідь зі статусом 503 Service Unavailable.
     *
     * @param message повідомлення про помилку
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з повідомленням про помилку та статусом 503
     */
    public ResponseEntity<Map<String, String>> serviceUnavailable(
            String message, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            log.error(logMessage, logArgs);
        }
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Collections.singletonMap("error", message));
    }

    // ========== Загальні методи ==========

    /**
     * Створює API-відповідь з власним статусом.
     *
     * @param <T> тип даних відповіді
     * @param status HTTP статус для відповіді
     * @param data дані для включення у відповідь
     * @param logMessage повідомлення для логування (необов'язкове)
     * @param logArgs аргументи для форматування повідомлення логування
     * @return ResponseEntity з даними та вказаним статусом
     */
    public <T> ResponseEntity<T> status(HttpStatus status, T data, String logMessage, Object... logArgs) {
        if (logMessage != null) {
            if (status.is5xxServerError()) {
                log.error(logMessage, logArgs);
            } else if (status.is4xxClientError()) {
                log.warn(logMessage, logArgs);
            } else {
                log.debug(logMessage, logArgs);
            }
        }
        return ResponseEntity.status(status).body(data);
    }
}
