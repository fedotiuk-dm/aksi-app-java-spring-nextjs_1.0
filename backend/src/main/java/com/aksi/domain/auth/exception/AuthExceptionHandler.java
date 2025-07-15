package com.aksi.domain.auth.exception;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.openapitools.jackson.nullable.JsonNullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.aksi.api.auth.dto.ErrorResponse;
import com.aksi.api.auth.dto.ValidationErrorResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * Global exception handler for authentication and authorization exceptions. Handles auth-specific
 * exceptions and maps them to appropriate HTTP responses.
 */
@RestControllerAdvice
@Slf4j
public class AuthExceptionHandler {

  /** Handle invalid credential's exception. */
  @ExceptionHandler({InvalidCredentialsException.class, BadCredentialsException.class})
  public ResponseEntity<ErrorResponse> handleInvalidCredentials(Exception ex, WebRequest request) {
    log.debug("Invalid credentials: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setMessage("Невірний логін або пароль");
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
    errorResponse.setError("INVALID_CREDENTIALS");
    errorResponse.setPath(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  /** Handle user blocked exception. */
  @ExceptionHandler({UserBlockedException.class, LockedException.class, DisabledException.class})
  public ResponseEntity<ErrorResponse> handleUserBlocked(Exception ex, WebRequest request) {
    log.debug("User blocked: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setMessage("Користувач заблокований або неактивний");
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(HttpStatus.FORBIDDEN.value());
    errorResponse.setError("USER_BLOCKED");
    errorResponse.setPath(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
  }

  /** Handle invalid token exception. */
  @ExceptionHandler(InvalidTokenException.class)
  public ResponseEntity<ErrorResponse> handleInvalidToken(
      InvalidTokenException ex, WebRequest request) {
    log.debug("Invalid token: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setMessage(ex.getMessage());
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
    errorResponse.setError("INVALID_TOKEN");
    errorResponse.setPath(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  /** Handle user didn't find an exception. */
  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUserNotFound(
      UserNotFoundException ex, WebRequest request) {
    log.debug("User not found: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setMessage("Користувач не знайдений");
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
    errorResponse.setError("USER_NOT_FOUND");
    errorResponse.setPath(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }

  /** Handle Spring validation errors. */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(
      MethodArgumentNotValidException ex, WebRequest request) {
    log.debug("Validation error: {}", ex.getMessage());

    List<com.aksi.api.auth.dto.FieldError> fieldErrors =
        ex.getBindingResult().getFieldErrors().stream()
            .map(this::convertFieldError)
            .collect(Collectors.toList());

    ValidationErrorResponse errorResponse = new ValidationErrorResponse();
    errorResponse.setMessage("Помилка валідації даних");
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
    errorResponse.setError("VALIDATION_ERROR");
    errorResponse.setPath(request.getDescription(false).replace("uri=", ""));
    errorResponse.setErrors(fieldErrors);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  /** Handle generic authentication exceptions. */
  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ErrorResponse> handleAuthenticationException(
      AuthenticationException ex, WebRequest request) {
    log.debug("Authentication error: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setMessage("Помилка автентифікації");
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
    errorResponse.setError("AUTHENTICATION_ERROR");
    errorResponse.setPath(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  /** Handle access denied exceptions. */
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDenied(
      AccessDeniedException ex, WebRequest request) {
    log.debug("Access denied: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setMessage("Доступ заборонено");
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(HttpStatus.FORBIDDEN.value());
    errorResponse.setError("ACCESS_DENIED");
    errorResponse.setPath(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
  }

  /** Handle IllegalStateException from controllers. */
  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ErrorResponse> handleIllegalState(
      IllegalStateException ex, WebRequest request) {
    log.error("Illegal state: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setMessage("Внутрішня помилка сервера");
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
    errorResponse.setError("INTERNAL_ERROR");
    errorResponse.setPath(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }

  /** Convert Spring FieldError to API FieldError. */
  private com.aksi.api.auth.dto.FieldError convertFieldError(FieldError fieldError) {
    com.aksi.api.auth.dto.FieldError apiFieldError = new com.aksi.api.auth.dto.FieldError();
    apiFieldError.setField(fieldError.getField());
    apiFieldError.setMessage(fieldError.getDefaultMessage());
    apiFieldError.setCode(fieldError.getCode());
    apiFieldError.setRejectedValue(JsonNullable.of(fieldError.getRejectedValue()));
    return apiFieldError;
  }
}
