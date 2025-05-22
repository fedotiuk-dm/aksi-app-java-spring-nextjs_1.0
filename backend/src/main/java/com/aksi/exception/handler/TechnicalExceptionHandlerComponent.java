package com.aksi.exception.handler;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.aksi.application.dto.common.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для обробки технічних помилок.
 */
@Component
@Slf4j
public class TechnicalExceptionHandlerComponent extends AbstractExceptionHandlerComponent {

    /**
     * Конструктор з ініціалізацією підтримуваних типів винятків.
     */
    public TechnicalExceptionHandlerComponent() {
        super(
            MethodArgumentTypeMismatchException.class,
            Exception.class
        );
    }

    @Override
    public int getOrder() {
        return 1000; // Нижчий пріоритет для загальних помилок
    }

    /**
     * Обробка помилок перетворення типів аргументів методу.
     *
     * @param ex виняток перетворення типів
     * @return відповідь з помилкою
     */
    public ErrorResponse handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.BAD_REQUEST);

        String paramName = ex.getName();
        String errorMessage;

        // Перевіряємо, чи це помилка перетворення UUID
        Class<?> requiredType = ex.getRequiredType();
        if (requiredType != null && "UUID".equals(requiredType.getSimpleName())) {
            errorMessage = String.format(
                "Параметр '%s' має бути валідним UUID у форматі 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'",
                paramName);
            log.warn("Помилка перетворення UUID для запиту {} {}: параметр={}, значення={}",
                request.getMethod(), request.getRequestURI(), paramName, ex.getValue(), ex);
        } else {
            errorMessage = String.format(
                "Параметр '%s' має недопустимий формат",
                paramName);
            log.warn("Загальна помилка перетворення типу для запиту {} {}: параметр={}, значення={}",
                request.getMethod(), request.getRequestURI(), paramName, ex.getValue(), ex);
        }

        Map<String, String> errors = new HashMap<>();
        errors.put(paramName, errorMessage);

        ErrorResponse response = createErrorResponse(
            HttpStatus.BAD_REQUEST,
            "Некоректний формат параметра запиту",
            ex,
            errors,
            errorId
        );

        clearMDC();
        return response;
    }

    /**
     * Обробка загальних винятків.
     *
     * @param ex загальний виняток
     * @return відповідь з помилкою
     */
    public ErrorResponse handleGenericException(Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String errorId = generateErrorId();
        setMDC(errorId, status);

        // Розширене логування для діагностики 500 помилок
        log.error("Внутрішня помилка сервера для запиту {} {}", request.getMethod(), request.getRequestURI(), ex);

        // Додаткове логування для діагностики
        logCallerInfo(ex);
        logRequestDetails();
        logCauseIfPresent(ex);

        ErrorResponse errorResponse = createErrorResponse(
            status,
            "Внутрішня помилка сервера",
            ex,
            errorId
        );

        // Додаємо стек трейс тільки для dev середовища
        if (isDevelopmentEnvironment()) {
            addStackTraceToResponse(ex, errorResponse);
        }

        // Очистка MDC
        clearMDC();

        return errorResponse;
    }
}
