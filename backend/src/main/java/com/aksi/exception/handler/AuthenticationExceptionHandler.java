package com.aksi.exception.handler;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.aksi.exception.UnauthorizedException;
import com.aksi.exception.formatter.LogMessageFormatter;
import com.aksi.exception.response.ErrorResponseBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Handles authentication and authorization related exceptions.
 * Part of the modular exception handling architecture.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthenticationExceptionHandler extends BaseExceptionHandler {

    private final ErrorResponseBuilder responseBuilder;
    private final LogMessageFormatter logFormatter;

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedException e) {
        log.warn(logFormatter.formatAuthError("Unauthorized access", getCurrentUser()));
        return responseBuilder.buildErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException e) {
        log.warn(logFormatter.formatAuthError("Bad credentials", getCurrentUser()));
        log.debug("Original BadCredentialsException exception message: {}", e.getMessage());
        return responseBuilder.buildErrorResponse(HttpStatus.UNAUTHORIZED, "Invalid username or password");
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, Object>> handleDisabled(DisabledException e) {
        log.warn(logFormatter.formatAuthError("Account disabled", getCurrentUser()));
        log.debug("Original DisabledException exception message: {}", e.getMessage());
        return responseBuilder.buildErrorResponse(HttpStatus.UNAUTHORIZED, "Account is disabled");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthentication(AuthenticationException e) {
        log.warn(logFormatter.formatErrorMessage("AUTHENTICATION", e));
        return responseBuilder.buildErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication failed");
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAuthorizationDenied(AuthorizationDeniedException e) {
        String requestContext = getRequestContext();

        log.error("Access denied: {} - {} | user: {}",
                requestContext, e.getMessage(), getCurrentUser());

        return responseBuilder.buildErrorResponse(HttpStatus.FORBIDDEN, "Access denied");
    }
}
