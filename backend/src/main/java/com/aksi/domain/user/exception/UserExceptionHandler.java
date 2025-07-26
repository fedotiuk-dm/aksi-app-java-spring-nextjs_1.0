package com.aksi.domain.user.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.aksi.api.user.dto.ErrorResponse;
import com.aksi.shared.validation.ValidationConstants;

import lombok.extern.slf4j.Slf4j;

/** Exception handler for user domain exceptions */
@Slf4j
@RestControllerAdvice(basePackages = {"com.aksi.domain.user", "com.aksi.api.user"})
public class UserExceptionHandler {

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUserNotFoundException(
      UserNotFoundException ex, WebRequest request) {
    log.error(ValidationConstants.ExceptionHandlers.USER_NOT_FOUND_LOG, ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error(ValidationConstants.ExceptionHandlers.USER_NOT_FOUND_CODE)
            .message(ex.getMessage())
            .path(
                request
                    .getDescription(false)
                    .replace(ValidationConstants.Exceptions.URI_PREFIX, ""));
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleUserAlreadyExistsException(
      UserAlreadyExistsException ex, WebRequest request) {
    log.warn(ValidationConstants.ExceptionHandlers.USER_ALREADY_EXISTS_LOG, ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.CONFLICT.value())
            .error(ValidationConstants.ExceptionHandlers.USER_ALREADY_EXISTS_CODE)
            .message(ex.getMessage())
            .path(
                request
                    .getDescription(false)
                    .replace(ValidationConstants.Exceptions.URI_PREFIX, ""));
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDeniedException(
      AccessDeniedException ex, WebRequest request) {
    log.warn(ValidationConstants.ExceptionHandlers.ACCESS_DENIED_LOG, ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.FORBIDDEN.value())
            .error(ValidationConstants.ExceptionHandlers.ACCESS_DENIED_CODE)
            .message(
                ex.getMessage() != null
                    ? ex.getMessage()
                    : ValidationConstants.ExceptionHandlers.ACCESS_DENIED_DEFAULT_MESSAGE)
            .path(
                request
                    .getDescription(false)
                    .replace(ValidationConstants.Exceptions.URI_PREFIX, ""));
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      IllegalArgumentException ex, WebRequest request) {
    log.error(ValidationConstants.ExceptionHandlers.INVALID_ARGUMENT_LOG, ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error(ValidationConstants.ExceptionHandlers.INVALID_ARGUMENT_CODE)
            .message(ex.getMessage())
            .path(
                request
                    .getDescription(false)
                    .replace(ValidationConstants.Exceptions.URI_PREFIX, ""));
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }
}
