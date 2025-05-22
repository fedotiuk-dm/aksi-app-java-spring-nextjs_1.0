package com.aksi.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.aksi.application.dto.common.ErrorResponse;
import com.aksi.exception.AuthenticationException;
import com.aksi.exception.BadRequestException;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.exception.ResourceNotFoundException;
import com.aksi.exception.UserAlreadyExistsException;
import com.aksi.exception.handler.ExceptionHandlerComponentsManager;

import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Глобальний обробник винятків для API.
 * Забезпечує уніфікований формат відповіді на помилки для фронтенду.
 * Використовує компонентну систему обробки винятків.
 */
@RestControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final ExceptionHandlerComponentsManager componentsManager;

    /**
     * Обробка помилок валідації полів.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationExceptions(MethodArgumentNotValidException ex) {
        return componentsManager.handleException(ex);
    }

    /**
     * Обробка помилок порушення обмежень.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(ConstraintViolationException ex) {
        return componentsManager.handleException(ex);
    }

    /**
     * Обробка помилки відсутності сутності.
     */
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleEntityNotFoundException(EntityNotFoundException ex) {
        return componentsManager.handleException(ex);
    }

    /**
     * Обробка помилки дублікату користувача.
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return componentsManager.handleException(ex);
    }

    /**
     * Обробка помилки автентифікації.
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleAuthenticationException(AuthenticationException ex) {
        return componentsManager.handleException(ex);
    }

    /**
     * Обробка помилки доступу.
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDeniedException(AccessDeniedException ex) {
        return componentsManager.handleException(ex);
    }

    /**
     * Обробка Resource Not Found помилок.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex) {
        return componentsManager.handleException(ex);
    }

    /**
     * Обробка Bad Request помилок.
     */
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequestException(BadRequestException ex) {
        return componentsManager.handleException(ex);
    }

    /**
     * Обробка помилки некоректних даних.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleIllegalArgumentException(IllegalArgumentException ex) {
        return componentsManager.handleException(ex);
    }

    /**
     * Обробляє помилки перетворення типів аргументів методу, включаючи невалідні UUID.
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return componentsManager.handleException(ex);
    }

    /**
     * Обробка будь-яких інших помилок.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        ErrorResponse errorResponse = componentsManager.handleException(ex);
        return ResponseEntity
                .status(errorResponse.getStatus())
                .body(errorResponse);
    }
}
