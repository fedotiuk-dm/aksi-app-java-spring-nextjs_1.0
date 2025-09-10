package com.aksi.exception.response;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;

import lombok.Builder;
import lombok.Data;

/**
 * Data class representing error context information.
 * Used with ErrorResponseBuilder for creating structured error responses.
 */
@Data
@Builder
public class ErrorContext {

    private HttpStatus status;
    private String message;
    private Instant timestamp;
    private String path;

    @Builder.Default
    private List<Map<String, String>> errors = null;

    @Builder.Default
    private Map<String, Object> additionalContext = null;

    /**
     * Create simple error context
     */
    public static ErrorContext simple(HttpStatus status, String message, String path) {
        return ErrorContext.builder()
                .status(status)
                .message(message)
                .path(path)
                .timestamp(Instant.now())
                .build();
    }

    /**
     * Create validation error context
     */
    public static ErrorContext validation(String message, String path, List<Map<String, String>> errors) {
        return ErrorContext.builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(message)
                .path(path)
                .errors(errors)
                .timestamp(Instant.now())
                .build();
    }

    /**
     * Create internal server error context
     */
    public static ErrorContext internalError(String message, String path) {
        return ErrorContext.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message(message)
                .path(path)
                .timestamp(Instant.now())
                .build();
    }
}
