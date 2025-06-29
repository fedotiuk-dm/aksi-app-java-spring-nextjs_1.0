package com.aksi.config;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.aksi.api.client.dto.ErrorResponse;
import com.aksi.api.client.dto.FieldError;
import com.aksi.api.client.dto.ValidationErrorResponse;
import com.aksi.domain.client.exception.ClientAlreadyExistsException;
import com.aksi.domain.client.exception.ClientNotFoundException;
import com.aksi.domain.client.exception.ClientValidationException;

import lombok.extern.slf4j.Slf4j;

/**
 * Global Exception Handler використовує згенеровані OpenAPI DTO схеми
 * для стандартизованої обробки помилок у всьому API
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Обробка помилок валідації (Bean Validation)
     * Повертає ValidationErrorResponse зі списком помилок полів
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, WebRequest request) {

        log.warn("Validation error: {}", ex.getMessage());

        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new FieldError(
                        error.getField(),
                        error.getDefaultMessage()
                ).rejectedValue(error.getRejectedValue())
                 .code(error.getCode()))
                .toList();

        ValidationErrorResponse response = new ValidationErrorResponse(
                OffsetDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                "Дані не пройшли валідацію",
                getPath(request),
                fieldErrors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Обробка бізнес-помилок валідації з Client Domain
     */
    @ExceptionHandler(ClientValidationException.class)
    public ResponseEntity<ErrorResponse> handleClientValidationException(
            ClientValidationException ex, WebRequest request) {

        log.warn("Client validation error: {}", ex.getMessage());

        ErrorResponse response = new ErrorResponse(
                OffsetDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Business Validation Error",
                ex.getMessage(),
                getPath(request)
        ).traceId(generateTraceId());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Обробка помилки "Клієнт не знайдений"
     */
    @ExceptionHandler(ClientNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleClientNotFoundException(
            ClientNotFoundException ex, WebRequest request) {

        log.warn("Client not found: {}", ex.getMessage());

        ErrorResponse response = new ErrorResponse(
                OffsetDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Client Not Found",
                ex.getMessage(),
                getPath(request)
        ).traceId(generateTraceId());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Обробка помилки "Клієнт вже існує"
     */
    @ExceptionHandler(ClientAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleClientAlreadyExistsException(
            ClientAlreadyExistsException ex, WebRequest request) {

        log.warn("Client already exists: {}", ex.getMessage());

        ErrorResponse response = new ErrorResponse(
                OffsetDateTime.now(),
                HttpStatus.CONFLICT.value(),
                "Client Already Exists",
                ex.getMessage(),
                getPath(request)
        ).traceId(generateTraceId());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    /**
     * Обробка всіх інших непередбачених помилок
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, WebRequest request) {

        log.error("Unexpected error occurred", ex);

        ErrorResponse response = new ErrorResponse(
                OffsetDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "Сталася внутрішня помилка сервера",
                getPath(request)
        ).traceId(generateTraceId());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Допоміжний метод для отримання шляху запиту
     */
    private String getPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }

    /**
     * Генерація унікального ідентифікатора для відстеження помилки
     */
    private String generateTraceId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
