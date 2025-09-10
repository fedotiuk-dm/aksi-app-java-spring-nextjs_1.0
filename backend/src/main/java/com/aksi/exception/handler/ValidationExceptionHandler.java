package com.aksi.exception.handler;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Component;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.aksi.exception.BadRequestException;
import com.aksi.exception.formatter.LogMessageFormatter;
import com.aksi.exception.response.ErrorResponseBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Handles validation and request parsing related exceptions.
 * Part of the modular exception handling architecture.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ValidationExceptionHandler extends BaseExceptionHandler {

    private final ErrorResponseBuilder responseBuilder;
    private final LogMessageFormatter logFormatter;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {
        List<Map<String, String>> errors = e.getBindingResult().getFieldErrors().stream()
                .map(error -> {
                    Map<String, String> errorMap = new HashMap<>();
                    errorMap.put("field", error.getField());
                    errorMap.put("message", error.getDefaultMessage());

                    // Log individual validation error with correlation context
                    log.warn(logFormatter.formatValidationError(
                            error.getField(),
                            error.getRejectedValue(),
                            error.getDefaultMessage()));

                    return errorMap;
                })
                .collect(Collectors.toList());

        log.warn("[VALIDATION] Request validation failed with {} field errors", errors.size());
        return responseBuilder.buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation failed", errors);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException e) {

        String message = buildTypeMismatchMessage(e);
        log.warn(logFormatter.formatErrorMessage("TYPE_MISMATCH", e));

        return responseBuilder.buildErrorResponse(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleJsonParseError(HttpMessageNotReadableException e) {
        String message = buildJsonParseErrorMessage(e);
        log.warn(logFormatter.formatErrorMessage("JSON_PARSE", e));

        return responseBuilder.buildErrorResponse(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException e) {

        String message = String.format(
                "Content type '%s' is not supported. Expected: %s",
                e.getContentType(), MediaType.APPLICATION_JSON_VALUE);

        log.debug("[MEDIA_TYPE] Unsupported media type: {}", e.getContentType());
        return responseBuilder.buildErrorResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE, message);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> handleDomainBadRequest(BadRequestException e) {
        log.warn(logFormatter.formatErrorMessage("BAD_REQUEST", e));
        return responseBuilder.buildErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException e) {
        String message = e.getMessage();

        // Handle enum-related errors specially
        if (message != null && message.contains("No enum constant")) {
            return handleEnumError(e, message);
        }

        log.warn(logFormatter.formatErrorMessage("ILLEGAL_ARGUMENT", e));
        return responseBuilder.buildErrorResponse(HttpStatus.BAD_REQUEST, message);
    }

    /**
     * Handle enum-related errors with helpful messages
     */
    private ResponseEntity<Map<String, Object>> handleEnumError(IllegalArgumentException e, String message) {
        String enumValue = extractEnumValueFromError(message);
        String enumType = extractEnumTypeFromError(message);

        if (enumType != null && enumType.contains("GameModifierType") && enumValue != null) {
            String[] validValues = {"TIMING", "SUPPORT", "MODE", "QUALITY", "EXTRA",
                                   "PROMOTIONAL", "SEASONAL", "SPELLS", "RANK", "PROGRESSION",
                                   "COSMETIC", "SOCIAL", "GUIDANCE", "ACHIEVEMENT", "SERVICE"};

            String errorMessage = String.format(
                    "Invalid game modifier type '%s'. Valid types are: %s",
                    enumValue, String.join(", ", validValues));

            log.error("CRITICAL: Database contains invalid modifier type '{}'. Run database migration to fix this.", enumValue);
            log.warn(logFormatter.formatEnumError("GameModifierType", enumValue, validValues));

            return responseBuilder.buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
        }

        // Generic enum error
        String errorMessage = "Invalid enum value. " + message + ". Please check valid values in API documentation.";
        log.warn(logFormatter.formatErrorMessage("ENUM_ERROR", e));

        return responseBuilder.buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
    }

    /**
     * Build user-friendly type mismatch error message
     */
    private String buildTypeMismatchMessage(MethodArgumentTypeMismatchException e) {
        String message = e.getMessage();
        if (message.contains("No enum constant")) {
            String parameterName = e.getName();
            Object invalidValue = e.getValue();

            // Extract valid enum values from the cause if it's an enum type
            String validValues = "";
            Class<?> requiredType = e.getRequiredType();
            if (requiredType != null && requiredType.isEnum()) {
                Object[] enumConstants = requiredType.getEnumConstants();
                if (enumConstants != null) {
                    validValues = " Valid values are: " +
                            Arrays.stream(enumConstants)
                                    .map(Object::toString)
                                    .collect(Collectors.joining(", "));
                }
            }

            return String.format("Invalid value '%s' for parameter '%s'.%s",
                    invalidValue, parameterName, validValues);
        }

        return message;
    }

    /**
     * Build user-friendly JSON parse error message
     */
    private String buildJsonParseErrorMessage(HttpMessageNotReadableException e) {
        String message = "Invalid JSON format";

        if (e.getMessage() != null && e.getMessage().contains("Unexpected value")) {
            String errorMsg = e.getMessage();
            if (errorMsg.contains("Cannot construct instance")) {
                message = "Invalid enum value in JSON. " +
                        errorMsg.substring(errorMsg.indexOf("problem:") + 8);
            }
        }

        return message;
    }

    /**
     * Extract enum value from error message
     */
    private String extractEnumValueFromError(String errorMessage) {
        try {
            int lastDotIndex = errorMessage.lastIndexOf('.');
            if (lastDotIndex != -1 && lastDotIndex < errorMessage.length() - 1) {
                return errorMessage.substring(lastDotIndex + 1);
            }
        } catch (Exception e) {
            log.debug("Failed to extract enum value from error message: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Extract enum type from error message
     */
    private String extractEnumTypeFromError(String errorMessage) {
        try {
            if (errorMessage.contains("com.aksi")) {
                int start = errorMessage.indexOf("com.aksi");
                int end = errorMessage.lastIndexOf('.');
                if (end > start) {
                    return errorMessage.substring(start, end);
                }
            }
        } catch (Exception e) {
            log.debug("Failed to extract enum type from error message: {}", e.getMessage());
        }
        return null;
    }
}
