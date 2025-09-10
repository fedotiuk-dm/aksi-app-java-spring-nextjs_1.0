package com.aksi.exception.handler;

import java.util.Map;

import org.apache.catalina.connector.ClientAbortException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.aksi.exception.formatter.LogMessageFormatter;
import com.aksi.exception.response.ErrorContext;
import com.aksi.exception.response.ErrorResponseBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Handles runtime and general exceptions that don't fit into other categories.
 * Part of the modular exception handling architecture.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RuntimeExceptionHandler extends BaseExceptionHandler {

    private final ErrorResponseBuilder responseBuilder;
    private final LogMessageFormatter logFormatter;

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException e) {
        String message = e.getMessage();

        // Handle specific runtime exception patterns
        if (message != null) {
            if (message.contains("Failed to deserialize CalculationFormula")) {
                log.warn("[FORMULA_DESERIALIZATION] {}", message);
                return responseBuilder.buildErrorResponse(HttpStatus.BAD_REQUEST,
                        "Invalid calculation formula format. Please check formula syntax.");
            }

            if (message.contains("Transaction silently rolled back")) {
                log.warn("[TRANSACTION_ROLLBACK] {}", message);
                return responseBuilder.buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Database operation failed due to concurrent modification");
            }
        }

        log.error(logFormatter.formatErrorMessage("RUNTIME", e));
        return responseBuilder.buildErrorResponse(
                ErrorContext.internalError(
                        "Internal server error occurred",
                        getCurrentPath()));
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, Object>> handleNullPointer(NullPointerException e) {
        log.error(logFormatter.formatErrorMessage("NULL_POINTER", e));
        return responseBuilder.buildErrorResponse(
                ErrorContext.internalError(
                        "Internal server error",
                        getCurrentPath()));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleNoResourceFound(NoResourceFoundException e) {
        String resourcePath = e.getResourcePath();

        // Don't handle actuator endpoints - let Spring Boot handle them
        if (resourcePath.startsWith("actuator/") ||
            resourcePath.startsWith("/actuator/") ||
            resourcePath.contains("management/health")) {
            return null; // Let Spring Boot's actuator handlers process this
        }

        // Simply return 404 for missing favicon without logging
        if (resourcePath.contains("favicon.ico")) {
            return ResponseEntity.notFound().build();
        }

        log.debug("[RESOURCE_NOT_FOUND] Resource path: {}", resourcePath);
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler({AsyncRequestNotUsableException.class, ClientAbortException.class})
    public void handleAsyncRequestErrors(Exception e) {
        // These are expected when clients disconnect from SSE streams
        // Used by Spring Boot Admin - do not log or return response
        log.trace("[CLIENT_DISCONNECT] Client disconnected from async request: {}", e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception e) {
        // Skip logging for broken pipe exceptions (common with SSE)
        if (isBrokenPipeException(e)) {
            log.trace("[CLIENT_DISCONNECT] Client disconnected: {}", e.getMessage());
            return null;
        }

        log.error(logFormatter.formatErrorMessage("GENERAL", e));
        return responseBuilder.buildErrorResponse(
                ErrorContext.internalError(
                        "Internal server error",
                        getCurrentPath()));
    }

    /**
     * Check if exception is related to client disconnect (broken pipe)
     */
    private boolean isBrokenPipeException(Exception e) {
        return (e.getCause() instanceof ClientAbortException) ||
               (e.getMessage() != null && e.getMessage().contains("Broken pipe"));
    }
}
