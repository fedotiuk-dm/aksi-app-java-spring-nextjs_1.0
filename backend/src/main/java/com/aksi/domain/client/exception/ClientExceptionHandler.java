package com.aksi.domain.client.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.aksi.api.client.dto.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/** Exception handler for client-related exceptions */
@RestControllerAdvice
@Slf4j
public class ClientExceptionHandler {

  @ExceptionHandler(ClientNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleClientNotFoundException(
      ClientNotFoundException ex, WebRequest request) {
    log.error("Client not found: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
    errorResponse.setError("Not Found");
    errorResponse.setMessage(ex.getMessage());
    errorResponse.setPath(request.getDescription(false).replace("uri=", ""));
    errorResponse.setTimestamp(Instant.now());

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }

  @ExceptionHandler(DuplicateClientException.class)
  public ResponseEntity<ErrorResponse> handleDuplicateClientException(
      DuplicateClientException ex, WebRequest request) {
    log.error("Duplicate client: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setStatus(HttpStatus.CONFLICT.value());
    errorResponse.setError("Conflict");
    errorResponse.setMessage(ex.getMessage());
    errorResponse.setPath(request.getDescription(false).replace("uri=", ""));
    errorResponse.setTimestamp(Instant.now());

    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }
}
