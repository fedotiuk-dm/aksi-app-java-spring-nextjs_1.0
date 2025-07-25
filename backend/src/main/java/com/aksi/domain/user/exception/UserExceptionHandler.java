package com.aksi.domain.user.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.aksi.api.user.dto.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/** Exception handler for user domain exceptions */
@Slf4j
@RestControllerAdvice(basePackages = {"com.aksi.domain.user", "com.aksi.api.user"})
public class UserExceptionHandler {

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUserNotFoundException(
      UserNotFoundException ex, WebRequest request) {
    log.error("User not found: {}", ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error("USER_NOT_FOUND")
            .message(ex.getMessage())
            .path(request.getDescription(false).replace("uri=", ""));
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleUserAlreadyExistsException(
      UserAlreadyExistsException ex, WebRequest request) {
    log.warn("User already exists: {}", ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.CONFLICT.value())
            .error("USER_ALREADY_EXISTS")
            .message(ex.getMessage())
            .path(request.getDescription(false).replace("uri=", ""));
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDeniedException(
      AccessDeniedException ex, WebRequest request) {
    log.warn("Access denied: {}", ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.FORBIDDEN.value())
            .error("ACCESS_DENIED")
            .message(
                ex.getMessage() != null
                    ? ex.getMessage()
                    : "You don't have permission to perform this action")
            .path(request.getDescription(false).replace("uri=", ""));
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      IllegalArgumentException ex, WebRequest request) {
    log.error("Invalid argument: {}", ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("INVALID_ARGUMENT")
            .message(ex.getMessage())
            .path(request.getDescription(false).replace("uri=", ""));
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }
}
