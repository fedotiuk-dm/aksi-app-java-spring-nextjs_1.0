package com.aksi.exception.handler;

import java.util.Map;

import org.hibernate.PropertyValueException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.exception.formatter.LogMessageFormatter;
import com.aksi.exception.response.ErrorResponseBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Handles database and data access related exceptions.
 * Part of the modular exception handling architecture.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseExceptionHandler extends BaseExceptionHandler {

    private final ErrorResponseBuilder responseBuilder;
    private final LogMessageFormatter logFormatter;

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException e) {
        log.warn(logFormatter.formatErrorMessage("NOT_FOUND", e));
        return responseBuilder.buildErrorResponse(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ConflictException e) {
        log.warn(logFormatter.formatErrorMessage("CONFLICT", e));
        return responseBuilder.buildErrorResponse(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(
            DataIntegrityViolationException e) {

        String userMessage = buildDataIntegrityMessage(e);
        log.error(logFormatter.formatDatabaseError(e));

        return responseBuilder.buildErrorResponse(HttpStatus.CONFLICT, userMessage);
    }

    @ExceptionHandler(JpaSystemException.class)
    public ResponseEntity<Map<String, Object>> handleJpaSystemException(JpaSystemException e) {
        log.error(logFormatter.formatDatabaseError(e));
        return responseBuilder.buildErrorResponse(
                com.aksi.exception.response.ErrorContext.internalError(
                        "Database system error occurred",
                        getCurrentPath()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException e) {
        String userMessage = buildConstraintViolationMessage(e);
        log.error(logFormatter.formatDatabaseError(e));

        return responseBuilder.buildErrorResponse(HttpStatus.BAD_REQUEST, userMessage);
    }

    @ExceptionHandler(PropertyValueException.class)
    public ResponseEntity<Map<String, Object>> handlePropertyValue(PropertyValueException e) {
        String userMessage = buildPropertyValueMessage(e);
        log.error(logFormatter.formatDatabaseError(e));

        return responseBuilder.buildErrorResponse(HttpStatus.BAD_REQUEST, userMessage);
    }

    @ExceptionHandler(IncorrectResultSizeDataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleIncorrectResultSize(
            IncorrectResultSizeDataAccessException e) {

        String userMessage = buildIncorrectResultSizeMessage(e.getMessage());
        log.warn(logFormatter.formatDatabaseError(e));

        return responseBuilder.buildErrorResponse(
                com.aksi.exception.response.ErrorContext.internalError(
                        userMessage,
                        getCurrentPath()));
    }

    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidDataAccess(InvalidDataAccessApiUsageException e) {
        String message = e.getMessage();

        if (message != null && message.contains("detached entity passed to persist")) {
            String entityName = extractEntityName(message);
            log.error("[DATABASE] Entity relationship error: detached entity passed to persist: {}", entityName);
            return responseBuilder.buildErrorResponse(
                    com.aksi.exception.response.ErrorContext.internalError(
                            "Entity relationship error",
                            getCurrentPath()));
        }

        // Handle enum mismatch errors
        if (message != null && message.contains("No enum constant")) {
            String enumDetails = message.substring(message.indexOf("No enum constant"));
            String userMessage = "Invalid enum value. " + enumDetails +
                               ". Please check valid values in API documentation.";
            log.warn(logFormatter.formatDatabaseError(e));
            return responseBuilder.buildErrorResponse(HttpStatus.BAD_REQUEST, userMessage);
        }

        log.warn(logFormatter.formatDatabaseError(e));
        return responseBuilder.buildErrorResponse(HttpStatus.BAD_REQUEST, message);
    }

    /**
     * Build user-friendly data integrity violation message
     */
    private String buildDataIntegrityMessage(DataIntegrityViolationException e) {
        String message = e.getMessage();
        if (message == null) {
            return "Data integrity constraint violation";
        }

        // Common database constraint violations
        if (message.contains("duplicate key") || message.contains("unique constraint")) {
            return "A record with this information already exists";
        }

        if (message.contains("foreign key") || message.contains("violates foreign key constraint")) {
            return "Referenced record does not exist or is in use";
        }

        if (message.contains("not null constraint") || message.contains("cannot be null")) {
            return "Required field is missing";
        }

        return "Data integrity constraint violation";
    }

    /**
     * Build user-friendly constraint violation message
     */
    private String buildConstraintViolationMessage(ConstraintViolationException e) {
        String constraintName = e.getConstraintName();

        if (constraintName != null) {
            // Parse common constraint patterns
            if (constraintName.contains("unique") || constraintName.contains("uk_")) {
                return "A record with this information already exists";
            }

            if (constraintName.contains("check") || constraintName.contains("ck_")) {
                return "Data validation rule violation";
            }

            if (constraintName.contains("fk_") || constraintName.contains("foreign")) {
                return "Referenced record does not exist";
            }
        }

        return "Database constraint violation";
    }

    /**
     * Build user-friendly property value error message
     */
    private String buildPropertyValueMessage(PropertyValueException e) {
        String propertyName = e.getPropertyName();
        if (propertyName != null) {
            return String.format("Required property '%s' is missing or invalid", propertyName);
        }
        return "Required property is missing or invalid";
    }

    /**
     * Build user-friendly incorrect result size message
     */
    private String buildIncorrectResultSizeMessage(String message) {
        if (message != null) {
            if (message.contains("findByCode")) {
                return "Found multiple database records with the same identifier. Please contact support.";
            }
            if (message.contains("unique result")) {
                return "Database integrity error: duplicate records found. Please contact support.";
            }
        }
        return "Database query error: multiple results found when one was expected";
    }

    /**
     * Extract entity name from error message
     */
    private String extractEntityName(String message) {
        if (message.contains("com.aksi.domain")) {
            int start = message.indexOf("com.aksi.domain");
            int end = message.indexOf(";", start);
            if (end == -1) end = message.length();
            String fullClassName = message.substring(start, end);
            return fullClassName.substring(fullClassName.lastIndexOf('.') + 1);
        }
        return "entity";
    }
}
