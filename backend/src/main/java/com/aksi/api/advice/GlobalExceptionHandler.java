package com.aksi.api.advice;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.aksi.dto.common.ErrorResponse;
import com.aksi.exception.AuthenticationException;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.exception.UserAlreadyExistsException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

/**
 * Глобальний обробник винятків для API
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * Обробка помилок валідації полів
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        log.warn("Помилка валідації: {}", errors);
        
        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Помилка валідації даних",
                errors
        );
    }
    
    /**
     * Обробка помилок порушення обмежень
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> errors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        violation -> getPath(violation),
                        ConstraintViolation::getMessage,
                        (error1, error2) -> error1
                ));
        
        log.warn("Помилка валідації: {}", errors);
        
        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Помилка валідації даних",
                errors
        );
    }
    
    private String getPath(ConstraintViolation<?> violation) {
        return violation.getPropertyPath().toString();
    }
    
    /**
     * Обробка помилки відсутності сутності
     */
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleEntityNotFoundException(EntityNotFoundException ex) {
        log.warn("Сутність не знайдено: {}", ex.getMessage());
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage()
        );
    }
    
    /**
     * Обробка помилки дублікату користувача
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        log.warn("Спроба створити дублікат користувача: {}", ex.getMessage());
        return new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                ex.getMessage()
        );
    }
    
    /**
     * Обробка помилки автентифікації
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleAuthenticationException(AuthenticationException ex) {
        log.warn("Помилка автентифікації: {}", ex.getMessage());
        return new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                ex.getMessage()
        );
    }
    
    /**
     * Обробка помилки доступу
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("Доступ заборонено: {}", ex.getMessage());
        return new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                "Доступ заборонено"
        );
    }
    
    /**
     * Обробка будь-яких інших помилок
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        
        // Розширене логування для діагностики 500 помилок
        log.error("Внутрішня помилка сервера: {}", ex.getMessage(), ex);
        log.error("Стек помилки: ", ex);
        
        if (ex.getCause() != null) {
            log.error("Причина помилки: {}", ex.getCause().getMessage());
        }
        
        // Додатковий логування класу, що викликав помилку
        StackTraceElement[] stackTrace = ex.getStackTrace();
        if (stackTrace.length > 0) {
            log.error("Викликано з: {}.{}({}:{})", 
                stackTrace[0].getClassName(), 
                stackTrace[0].getMethodName(),
                stackTrace[0].getFileName(),
                stackTrace[0].getLineNumber());
        }
        
        return ResponseEntity
                .status(status)
                .body(new ErrorResponse(
                        status.value(),
                        "Внутрішня помилка сервера: " + ex.getMessage()
                ));
    }
    
    /**
     * Обробка помилки некоректних даних
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Помилка некоректних даних: {}", ex.getMessage());
        return new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage()
        );
    }
} 