package com.aksi.controller;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.catalina.connector.ClientAbortException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.exception.UnauthorizedException;

import lombok.extern.slf4j.Slf4j;

/** Global exception handler for REST API. */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedException e) {
    log.warn("Unauthorized access: {}", e.getMessage());
    return createErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage(), null);
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleNotFound(NotFoundException e) {
    log.warn("Resource not found: {}", e.getMessage());
    return createErrorResponse(HttpStatus.NOT_FOUND, e.getMessage(), null);
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<Map<String, Object>> handleConflict(ConflictException e) {
    log.warn("Resource conflict: {}", e.getMessage());
    return createErrorResponse(HttpStatus.CONFLICT, e.getMessage(), null);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException e) {
    log.warn("Bad credentials: {}", e.getMessage());
    return createErrorResponse(HttpStatus.UNAUTHORIZED, "Invalid username or password", null);
  }

  @ExceptionHandler(DisabledException.class)
  public ResponseEntity<Map<String, Object>> handleDisabled(DisabledException e) {
    log.warn("Account disabled: {}", e.getMessage());
    return createErrorResponse(HttpStatus.UNAUTHORIZED, "Account is disabled", null);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<Map<String, Object>> handleAuthentication(AuthenticationException e) {
    log.warn("Authentication error: {}", e.getMessage());
    return createErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication failed", null);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {
    List<Map<String, String>> errors =
        e.getBindingResult().getFieldErrors().stream()
            .map(
                error -> {
                  Map<String, String> errorMap = new HashMap<>();
                  errorMap.put("field", error.getField());
                  errorMap.put("message", error.getDefaultMessage());
                  return errorMap;
                })
            .collect(Collectors.toList());

    return createErrorResponse(HttpStatus.BAD_REQUEST, "Validation failed", errors);
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<Map<String, Object>> handleMethodArgumentTypeMismatch(
      MethodArgumentTypeMismatchException e) {
    log.warn("Method argument type mismatch: {}", e.getMessage());

    String message = e.getMessage();
    if (message.contains("No enum constant")) {
      String parameterName = e.getName();
      Object invalidValue = e.getValue();

      // Extract valid enum values from the cause if it's an enum type
      String validValues = "";
      if (e.getRequiredType() != null && e.getRequiredType().isEnum()) {
        Object[] enumConstants = e.getRequiredType().getEnumConstants();
        if (enumConstants != null) {
          validValues =
              " Valid values are: "
                  + java.util.Arrays.stream(enumConstants)
                      .map(Object::toString)
                      .collect(Collectors.joining(", "));
        }
      }

      message =
          String.format(
              "Invalid value '%s' for parameter '%s'.%s", invalidValue, parameterName, validValues);
    }

    return createErrorResponse(HttpStatus.BAD_REQUEST, message, null);
  }

  @ExceptionHandler(NoResourceFoundException.class)
  public ResponseEntity<?> handleNoResourceFound(NoResourceFoundException ex) {
    // Simply return 404 for missing static resources without logging
    if (ex.getResourcePath().contains("favicon.ico")
        || ex.getResourcePath().contains("management/health")) {
      return ResponseEntity.notFound().build();
    }

    log.debug("Resource not found: {}", ex.getResourcePath());
    return ResponseEntity.notFound().build();
  }

  @ExceptionHandler({AsyncRequestNotUsableException.class, ClientAbortException.class})
  public void handleAsyncRequestErrors(Exception ex) {
    // These are expected when clients disconnect from SSE streams
    // Used by Spring Boot Admin - do not log or return response
    log.trace("Client disconnected from async request: {}", ex.getMessage());
  }

  @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
  public ResponseEntity<Map<String, Object>> handleMediaTypeNotSupported(
      HttpMediaTypeNotSupportedException ex) {
    String message =
        String.format(
            "Content type '%s' is not supported. Expected: %s",
            ex.getContentType(), MediaType.APPLICATION_JSON_VALUE);

    log.debug("Unsupported media type: {}", ex.getContentType());

    return createErrorResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE, message, null);
  }

  @ExceptionHandler(InvalidDataAccessApiUsageException.class)
  public ResponseEntity<Map<String, Object>> handleInvalidDataAccess(
      InvalidDataAccessApiUsageException e) {
    log.warn("Invalid data access: {}", e.getMessage());

    // Extract meaningful error message for enum mismatches
    String message = e.getMessage();
    if (message != null && message.contains("No enum constant")) {
      // Extract enum type and value from error message
      String enumDetails = message.substring(message.indexOf("No enum constant"));
      message =
          "Invalid enum value. "
              + enumDetails
              + ". Please check valid values in API documentation.";
    }

    return createErrorResponse(HttpStatus.BAD_REQUEST, message, null);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException e) {
    log.warn("Illegal argument: {}", e.getMessage());

    // Enhanced error message for enum-related errors
    String message = e.getMessage();
    if (message != null && message.contains("No enum constant")) {
      // Extract the problematic value if possible
      message =
          "Invalid enum value. " + message + ". Please check valid values in API documentation.";
    }

    return createErrorResponse(HttpStatus.BAD_REQUEST, message, null);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGeneral(Exception e) {
    // Skip logging for broken pipe exceptions (common with SSE)
    if (e.getCause() instanceof ClientAbortException
        || e.getMessage() != null && e.getMessage().contains("Broken pipe")) {
      log.trace("Client disconnected: {}", e.getMessage());
      return null;
    }

    log.error("Unexpected error", e);
    return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", null);
  }

  private ResponseEntity<Map<String, Object>> createErrorResponse(
      HttpStatus status, String message, List<Map<String, String>> errors) {
    Map<String, Object> body = new HashMap<>();
    body.put("timestamp", Instant.now());
    body.put("status", status.value());
    body.put("error", status.getReasonPhrase());
    body.put("message", message);
    body.put("path", getPath());
    if (errors != null && !errors.isEmpty()) {
      body.put("errors", errors);
    }
    return new ResponseEntity<>(body, status);
  }

  private String getPath() {
    jakarta.servlet.http.HttpServletRequest request =
        (jakarta.servlet.http.HttpServletRequest)
            org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()
                .resolveReference(
                    org.springframework.web.context.request.RequestAttributes.REFERENCE_REQUEST);
    assert request != null;
    return request.getServletPath();
  }
}
