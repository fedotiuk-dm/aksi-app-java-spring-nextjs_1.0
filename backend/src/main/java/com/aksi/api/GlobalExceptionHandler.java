package com.aksi.api;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
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
import com.aksi.exception.BadRequestException;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.exception.ResourceNotFoundException;
import com.aksi.exception.UserAlreadyExistsException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Глобальний обробник винятків для API
 * Забезпечує уніфікований формат відповіді на помилки для фронтенду
 */
@RestControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final Environment environment;
    private final HttpServletRequest request;
    
    @Value("${spring.profiles.active:production}")
    private String activeProfile;
    
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
        
        return ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Помилка валідації даних")
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(generateErrorId())
                .errors(errors)
                .build();
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
        
        return ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Помилка валідації даних")
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(generateErrorId())
                .errors(errors)
                .build();
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
        return ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(generateErrorId())
                .build();
    }
    
    /**
     * Обробка помилки дублікату користувача
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        log.warn("Спроба створити дублікат користувача: {}", ex.getMessage());
        return ErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(generateErrorId())
                .build();
    }
    
    /**
     * Обробка помилки автентифікації
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleAuthenticationException(AuthenticationException ex) {
        log.warn("Помилка автентифікації: {}", ex.getMessage());
        return ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(ex.getMessage())
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(generateErrorId())
                .build();
    }
    
    /**
     * Обробка помилки доступу
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("Доступ заборонено: {}", ex.getMessage());
        return ErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .message("Доступ заборонено")
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(generateErrorId())
                .build();
    }
    
    /**
     * Обробка Resource Not Found помилок
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.warn("Ресурс не знайдено: {}", ex.getMessage());
        return ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(generateErrorId())
                .build();
    }
    
    /**
     * Обробка Bad Request помилок
     */
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequestException(BadRequestException ex) {
        log.warn("Некоректний запит: {}", ex.getMessage());
        return ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(generateErrorId())
                .build();
    }
    
    /**
     * Обробка будь-яких інших помилок
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String errorId = generateErrorId();
        
        // Розширене логування для діагностики 500 помилок
        log.error("Внутрішня помилка сервера [{}]: {}", errorId, ex.getMessage(), ex);
        log.error("Стек помилки [{}]: ", errorId, ex);
        
        if (ex.getCause() != null) {
            log.error("Причина помилки [{}]: {}", errorId, ex.getCause().getMessage());
        }
        
        // Додатковий логування класу, що викликав помилку
        StackTraceElement[] stackTrace = ex.getStackTrace();
        if (stackTrace.length > 0) {
            log.error("Викликано з [{}]: {}.{}({}:{})", 
                errorId,
                stackTrace[0].getClassName(), 
                stackTrace[0].getMethodName(),
                stackTrace[0].getFileName(),
                stackTrace[0].getLineNumber());
        }
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(status.value())
                .message("Внутрішня помилка сервера: " + ex.getMessage())
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(errorId)
                .build();
                
        // Додаємо стек трейс тільки для dev середовища
        if (isDevelopmentEnvironment()) {
            addStackTraceToResponse(ex, errorResponse);
        }
        
        return ResponseEntity
                .status(status)
                .body(errorResponse);
    }
    
    /**
     * Обробка помилки некоректних даних
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Помилка некоректних даних: {}", ex.getMessage());
        return ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(generateErrorId())
                .build();
    }
    
    /**
     * Перевірка, чи це середовище розробки
     */
    private boolean isDevelopmentEnvironment() {
        return Arrays.asList(environment.getActiveProfiles()).contains("dev") || 
               "dev".equals(activeProfile) ||
               Arrays.asList(environment.getActiveProfiles()).contains("development") ||
               "development".equals(activeProfile) ||
               Arrays.asList(environment.getActiveProfiles()).contains("local") ||
               "local".equals(activeProfile);
    }
    
    /**
     * Генерація унікального ідентифікатора помилки
     */
    private String generateErrorId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
    
    /**
     * Додавання стеку помилки до відповіді (тільки для dev середовища)
     */
    private void addStackTraceToResponse(Exception ex, ErrorResponse errorResponse) {
        StackTraceElement[] stackTrace = ex.getStackTrace();
        // Обмежуємо до перших 10 рядків стеку, щоб не перевантажувати відповідь
        int maxStackTraceLines = Math.min(stackTrace.length, 10);
        
        for (int i = 0; i < maxStackTraceLines; i++) {
            StackTraceElement element = stackTrace[i];
            String line = String.format("%s.%s(%s:%d)", 
                element.getClassName(),
                element.getMethodName(),
                element.getFileName(),
                element.getLineNumber());
            errorResponse.addStackTraceLine(line);
        }
        
        // Якщо є причина помилки, додаємо її також
        if (ex.getCause() != null) {
            errorResponse.addStackTraceLine("Caused by: " + ex.getCause().toString());
        }
    }
} 