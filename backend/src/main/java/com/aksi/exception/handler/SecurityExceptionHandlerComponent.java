package com.aksi.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import com.aksi.application.dto.common.ErrorResponse;
import com.aksi.exception.AuthenticationException;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для обробки помилок пов'язаних з безпекою.
 */
@Component
@Slf4j
public class SecurityExceptionHandlerComponent extends AbstractExceptionHandlerComponent {

    /**
     * Конструктор з ініціалізацією підтримуваних типів винятків.
     */
    public SecurityExceptionHandlerComponent() {
        super(
            AccessDeniedException.class,
            AuthenticationException.class
        );
    }

    @Override
    public int getOrder() {
        return 150; // Високий пріоритет для помилок безпеки
    }

    /**
     * Обробка помилки доступу.
     *
     * @param ex виняток доступу
     * @return відповідь з помилкою
     */
    public ErrorResponse handleAccessDeniedException(AccessDeniedException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.FORBIDDEN);

        logException("Доступ заборонено", ex);

        ErrorResponse response = createErrorResponse(
            HttpStatus.FORBIDDEN,
            "Доступ заборонено",
            ex,
            errorId
        );

        clearMDC();
        return response;
    }

    /**
     * Обробка помилки автентифікації.
     *
     * @param ex виняток автентифікації
     * @return відповідь з помилкою
     */
    public ErrorResponse handleAuthenticationException(AuthenticationException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.UNAUTHORIZED);

        logException("Помилка автентифікації", ex);

        ErrorResponse response = createErrorResponse(
            HttpStatus.UNAUTHORIZED,
            ex.getMessage(),
            ex,
            errorId
        );

        clearMDC();
        return response;
    }
}
