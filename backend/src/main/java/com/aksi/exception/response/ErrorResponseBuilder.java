package com.aksi.exception.response;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import lombok.extern.slf4j.Slf4j;

/**
 * Builder for creating standardized error responses with correlation context.
 * Follows Builder Pattern for consistent error response structure.
 */
@Component
@Slf4j
public class ErrorResponseBuilder {

    /**
     * Create a standardized error response with correlation context
     */
    public ResponseEntity<Map<String, Object>> buildErrorResponse(ErrorContext context) {
        Map<String, Object> body = new HashMap<>();

        // Core error information
        body.put("timestamp", context.getTimestamp());
        body.put("status", context.getStatus().value());
        body.put("error", context.getStatus().getReasonPhrase());
        body.put("message", context.getMessage());
        body.put("path", context.getPath());

        // Add correlation context for better tracing
        addCorrelationContext(body);

        // Add validation errors if present
        if (context.getErrors() != null && !context.getErrors().isEmpty()) {
            body.put("errors", context.getErrors());
        }

        // Add additional context if present
        if (context.getAdditionalContext() != null && !context.getAdditionalContext().isEmpty()) {
            body.put("context", context.getAdditionalContext());
        }

        return new ResponseEntity<>(body, context.getStatus());
    }

    /**
     * Create error response with minimal parameters
     */
    public ResponseEntity<Map<String, Object>> buildErrorResponse(
            HttpStatus status, String message) {
        return buildErrorResponse(ErrorContext.builder()
                .status(status)
                .message(message)
                .timestamp(Instant.now())
                .path(getCurrentPath())
                .build());
    }

    /**
     * Create error response with validation errors
     */
    public ResponseEntity<Map<String, Object>> buildErrorResponse(
            HttpStatus status, String message, List<Map<String, String>> errors) {
        return buildErrorResponse(ErrorContext.builder()
                .status(status)
                .message(message)
                .errors(errors)
                .timestamp(Instant.now())
                .path(getCurrentPath())
                .build());
    }

    /**
     * Add correlation context from MDC to error response for better tracing
     */
    private void addCorrelationContext(Map<String, Object> body) {
        try {
            Map<String, String> tracing = new HashMap<>();

            String correlationId = MDC.get("correlationId");
            if (correlationId != null) {
                tracing.put("correlationId", correlationId);
            }

            String requestId = MDC.get("requestId");
            if (requestId != null) {
                tracing.put("requestId", requestId);
            }

            String userId = MDC.get("userId");
            if (userId != null) {
                tracing.put("userId", userId);
            }

            if (!tracing.isEmpty()) {
                body.put("tracing", tracing);
            }
        } catch (RuntimeException e) {
            // Don't let correlation context extraction break error response
            log.debug("Failed to extract correlation context: {}", e.getMessage());
        }
    }

    /**
     * Get current request path safely for error response context.
     * Note: This is needed internally by ErrorResponseBuilder and cannot
     * use BaseExceptionHandler since this is a different component type.
     */
    private String getCurrentPath() {
        try {
            RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
            if (attrs instanceof ServletRequestAttributes sra) {
                String servletPath = sra.getRequest().getServletPath();
                return servletPath != null ? servletPath : "";
            }
        } catch (IllegalStateException e) {
            // No request context available (e.g., async processing)
            log.trace("Request context not available in ErrorResponseBuilder: {}", e.getMessage());
        }
        return "";
    }

}
