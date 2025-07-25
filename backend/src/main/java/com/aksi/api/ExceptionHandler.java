package com.aksi.api;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.openapitools.jackson.nullable.JsonNullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.aksi.api.auth.dto.ErrorResponse;
import com.aksi.api.auth.dto.FieldError;
import com.aksi.api.auth.dto.ValidationErrorResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * Global exception handler for validation and general errors Handles exceptions that are not caught
 * by domain-specific handlers
 */
@Slf4j
@RestControllerAdvice
public class ExceptionHandler {

  /** Handle validation errors from @Valid annotations */
  @org.springframework.web.bind.annotation.ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(
      MethodArgumentNotValidException ex, WebRequest request) {

    log.warn("Validation failed: {}", ex.getMessage());

    // Collect all field validation errors
    List<FieldError> fieldErrors = extractFieldErrors(ex.getBindingResult());

    ValidationErrorResponse response =
        new ValidationErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("VALIDATION_FAILED")
            .message("Validation failed for one or more fields")
            .errors(fieldErrors)
            .path(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.badRequest().body(response);
  }

  /** Handle general runtime exceptions */
  @org.springframework.web.bind.annotation.ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleRuntimeException(
      RuntimeException ex, WebRequest request) {

    log.error("Unhandled runtime exception", ex);

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("INTERNAL_SERVER_ERROR")
            .message("An unexpected error occurred")
            .path(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }

  /** Extract field errors from binding result */
  private List<FieldError> extractFieldErrors(BindingResult bindingResult) {
    return bindingResult.getFieldErrors().stream()
        .map(
            error -> {
              FieldError fieldError = new FieldError();
              fieldError.setField(error.getField());
              fieldError.setCode(error.getCode());
              fieldError.setMessage(error.getDefaultMessage());

              // Handle rejected value
              Object rejectedValue = error.getRejectedValue();
              if (rejectedValue != null) {
                fieldError.setRejectedValue(JsonNullable.of(rejectedValue));
              }

              return fieldError;
            })
        .collect(Collectors.toList());
  }
}
