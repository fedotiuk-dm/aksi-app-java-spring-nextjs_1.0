package com.aksi.controller;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.catalina.connector.ClientAbortException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.aksi.exception.BadRequestException;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.exception.UnauthorizedException;

import lombok.extern.slf4j.Slf4j;

/** Global exception handler for REST API. */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  @Value("${spring.profiles.active:dev}")
  private String activeProfile;

  private boolean productionProfile() {
    return "prod".equals(activeProfile) || "production".equals(activeProfile);
  }

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

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(
      DataIntegrityViolationException e) {
    String message = "Data integrity constraint violation";
    if (productionProfile()) {
      log.error("Data integrity violation: {}", getShortErrorMessage(e));
    } else {
      log.error("Data integrity violation: {}", e.getMessage());
    }
    return createErrorResponse(HttpStatus.CONFLICT, message, null);
  }

  @ExceptionHandler(JpaSystemException.class)
  public ResponseEntity<Map<String, Object>> handleJpaSystemException(JpaSystemException e) {
    String message = "Database system error occurred";
    if (productionProfile()) {
      log.error("JPA system error: {}", getShortErrorMessage(e));
    } else {
      log.error("JPA system error: {}", e.getMessage());
    }
    return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, message, null);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<Map<String, Object>> handleConstraintViolation(
      ConstraintViolationException e) {
    String message = "Database constraint violation";
    if (productionProfile()) {
      log.error("Constraint violation: {}", getShortErrorMessage(e));
    } else {
      log.error("Constraint violation: {}", e.getMessage());
    }
    return createErrorResponse(HttpStatus.BAD_REQUEST, message, null);
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

  @ExceptionHandler(AuthorizationDeniedException.class)
  public ResponseEntity<Map<String, Object>> handleAuthorizationDenied(
      AuthorizationDeniedException e) {
    String path = getPath();
    String method = getMethod();
    log.error("Access denied: {} {} - {}", method, path, e.getMessage());
    return createErrorResponse(HttpStatus.FORBIDDEN, "Access denied", null);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<Map<String, Object>> handleJsonParseError(
      HttpMessageNotReadableException e) {
    log.warn("JSON parse error: {}", e.getMessage());

    String message = "Invalid JSON format";
    if (e.getMessage() != null && e.getMessage().contains("Unexpected value")) {
      // Extract enum error details
      String errorMsg = e.getMessage();
      if (errorMsg.contains("Cannot construct instance")) {
        message =
            "Invalid enum value in JSON. " + errorMsg.substring(errorMsg.indexOf("problem:") + 8);
      }
    }

    return createErrorResponse(HttpStatus.BAD_REQUEST, message, null);
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
      Class<?> requiredType = e.getRequiredType();
      if (requiredType != null && requiredType.isEnum()) {
        Object[] enumConstants = requiredType.getEnumConstants();
        if (enumConstants != null) {
          validValues =
              " Valid values are: "
                  + Arrays.stream(enumConstants)
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
    // Don't handle actuator endpoints - let Spring Boot handle them
    if (ex.getResourcePath().startsWith("actuator/")
        || ex.getResourcePath().startsWith("/actuator/")
        || ex.getResourcePath().contains("management/health")) {
      return null; // Let Spring Boot's actuator handlers process this
    }

    // Simply return 404 for missing static resources without logging
    if (ex.getResourcePath().contains("favicon.ico")) {
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
    String message = e.getMessage();

    if (message != null && message.contains("detached entity passed to persist")) {
      // Extract entity class name for shorter log
      String entityName = "entity";
      if (message.contains("com.aksi.domain")) {
        int start = message.indexOf("com.aksi.domain");
        int end = message.indexOf(";", start);
        if (end == -1) end = message.length();
        String fullClassName = message.substring(start, end);
        entityName = fullClassName.substring(fullClassName.lastIndexOf('.') + 1);
      }
      log.error("Entity relationship error: detached entity passed to persist: {}", entityName);
      return createErrorResponse(
          HttpStatus.INTERNAL_SERVER_ERROR, "Entity relationship error", null);
    }

    log.warn("Invalid data access: {}", message);

    // Extract meaningful error message for enum mismatches
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

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<Map<String, Object>> handleDomainBadRequest(BadRequestException e) {
    log.warn("Bad request: {}", e.getMessage());
    return createErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage(), null);
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

  @ExceptionHandler(NullPointerException.class)
  public ResponseEntity<Map<String, Object>> handleNullPointer(NullPointerException e) {
    if (productionProfile()) {
      log.error("Null pointer error: {}", getShortErrorMessage(e));
    } else {
      log.error("Null pointer error: {}", e.getMessage());
    }
    return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", null);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGeneral(Exception e) {
    // Skip logging for broken pipe exceptions (common with SSE)
    if (e.getCause() instanceof ClientAbortException
        || e.getMessage() != null && e.getMessage().contains("Broken pipe")) {
      log.trace("Client disconnected: {}", e.getMessage());
      return null;
    }

    // Log error details based on profile
    if (productionProfile()) {
      log.error("Unexpected error: {}", getShortErrorMessage(e));
    } else {
      String causeMessage = "N/A";
      try {
        Throwable cause = e.getCause();
        if (cause != null) {
          causeMessage = cause.getMessage() != null ? cause.getMessage() : cause.getClass().getSimpleName();
        }
      } catch (Exception causeException) {
        causeMessage = "Unable to get cause";
      }

      log.error("Unexpected error: {} | Cause: {}", e.getMessage(), causeMessage);
    }

    return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", null);
  }

  /**
   * Creates a standardized error response for API clients. In production environment, reduces log
   * verbosity to prevent information leakage.
   *
   * @param status HTTP status code
   * @param message Error message for client
   * @param errors Optional validation errors list
   * @return ResponseEntity with error details
   */
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
    try {
      RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
      if (attrs instanceof ServletRequestAttributes sra) {
        return sra.getRequest().getServletPath();
      }
    } catch (IllegalStateException ignored) {
      // No request context available
    }
    return "";
  }

  private String getMethod() {
    try {
      RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
      if (attrs instanceof ServletRequestAttributes sra) {
        return sra.getRequest().getMethod();
      }
    } catch (IllegalStateException ignored) {
      // No request context available
    }
    return "";
  }

  /**
   * Extracts a short, meaningful error message from exceptions to reduce log verbosity. Removes
   * stack traces and keeps only the essential error information.
   *
   * @param e The exception to extract message from
   * @return Short error message
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

    if (message.contains("UnsupportedOperationException")) {
      return "Database operation error";
    }

    if (message.contains("array_to_string")) {
      return "Database query error";
    }

    if (message.contains("PluralValuedSimplePathInterpretation")) {
      return "Database field access error";
    }

    // For other errors, take first 200 characters to avoid overly long logs
    if (message.length() > 200) {
      return message.substring(0, 200) + "...";
    }

    return message;
  }
}
