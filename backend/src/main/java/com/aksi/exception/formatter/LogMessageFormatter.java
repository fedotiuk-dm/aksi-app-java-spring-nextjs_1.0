package com.aksi.exception.formatter;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * Formats log messages for exceptions with correlation context and clean output.
 * Provides different formatting strategies for different environments.
 */
@Component
@Slf4j
public class LogMessageFormatter {

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    /**
     * Format error message for logging with correlation context
     */
    public String formatErrorMessage(String errorType, Exception e) {
        StringBuilder message = new StringBuilder();

        // Add error type and basic message
        message.append("[").append(errorType).append("] ");

        if (e.getMessage() != null) {
            if (isProductionProfile()) {
                message.append(getShortErrorMessage(e));
            } else {
                message.append(e.getMessage());
            }
        } else {
            message.append(e.getClass().getSimpleName());
        }

        // Add correlation context for better tracing
        String correlationContext = getCorrelationContext();
        if (!correlationContext.isEmpty()) {
            message.append(" | ").append(correlationContext);
        }

        return message.toString();
    }

    /**
     * Format validation error message
     */
    public String formatValidationError(String fieldName, Object invalidValue, String constraint) {
        return String.format("[VALIDATION] Field '%s' with value '%s' failed constraint: %s",
                fieldName, invalidValue, constraint);
    }

    /**
     * Format database error message
     */
    public String formatDatabaseError(Exception e) {
        String message = e.getMessage();
        if (message == null) {
            return "[DATABASE] " + e.getClass().getSimpleName();
        }

        // Extract meaningful database error information
        if (message.contains("duplicate key value")) {
            return "[DATABASE] Duplicate key constraint violation";
        }

        if (message.contains("foreign key constraint")) {
            return "[DATABASE] Foreign key constraint violation";
        }

        if (message.contains("not-null property")) {
            return "[DATABASE] Required field is null";
        }

        if (message.contains("detached entity")) {
            return "[DATABASE] Entity relationship error";
        }

        if (isProductionProfile()) {
            return "[DATABASE] " + getShortErrorMessage(e);
        }

        return "[DATABASE] " + message;
    }

    /**
     * Format enum error message with valid values
     */
    public String formatEnumError(String enumType, String invalidValue, String[] validValues) {
        return String.format("[ENUM] Invalid %s value '%s'. Valid values: [%s]",
                enumType, invalidValue, String.join(", ", validValues));
    }

    /**
     * Format authentication error message
     */
    public String formatAuthError(String operation, String user) {
        return String.format("[AUTH] %s failed for user: %s", operation, user);
    }

    /**
     * Get correlation context for logging
     */
    private String getCorrelationContext() {
        StringBuilder context = new StringBuilder();

        String correlationId = MDC.get("correlationId");
        if (correlationId != null) {
            context.append("correlationId=").append(correlationId);
        }

        String userId = MDC.get("userId");
        if (userId != null) {
            if (!context.isEmpty()) context.append(", ");
            context.append("user=").append(userId);
        }

        String method = MDC.get("method");
        String uri = MDC.get("uri");
        if (method != null && uri != null) {
            if (!context.isEmpty()) context.append(", ");
            context.append("request=").append(method).append(" ").append(uri);
        }

        return context.toString();
    }

    /**
     * Check if we're running in production profile
     */
    private boolean isProductionProfile() {
        return "prod".equals(activeProfile) || "production".equals(activeProfile);
    }

    /**
     * Extract short error message for production logging
     */
    private String getShortErrorMessage(Exception e) {
        if (e == null) {
            return "Unknown error";
        }

        String message = e.getMessage();
        if (message == null) {
            return e.getClass().getSimpleName();
        }

        // Extract meaningful parts from common error messages
        if (message.contains("detached entity passed to persist")) {
            return "Database entity error";
        }

        if (message.contains("ConstraintViolationException")) {
            return "Database constraint violation";
        }

        if (message.contains("DataIntegrityViolationException")) {
            return "Data integrity constraint violation";
        }

        if (message.contains("JpaSystemException")) {
            return "Database system error";
        }

        if (message.contains("array_to_string")) {
            return "Database query error";
        }

        // For other errors, take first 150 characters to avoid overly long logs
        if (message.length() > 150) {
            return message.substring(0, 150) + "...";
        }

        return message;
    }
}
