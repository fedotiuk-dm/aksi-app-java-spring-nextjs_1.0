package com.aksi.domain.auth.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.aksi.api.auth.dto.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/** Exception handler for auth domain */
@Slf4j
@RestControllerAdvice(basePackages = {"com.aksi.domain.auth", "com.aksi.api.auth"})
public class AuthExceptionHandler {

  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleInvalidCredentials(
      InvalidCredentialsException ex, WebRequest request) {
    log.error("Invalid credentials error: {}", ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.UNAUTHORIZED.value())
            .error("INVALID_CREDENTIALS")
            .message(ex.getMessage())
            .path(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  @ExceptionHandler(TokenExpiredException.class)
  public ResponseEntity<ErrorResponse> handleTokenExpired(
      TokenExpiredException ex, WebRequest request) {
    log.error("Token expired error: {}", ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.UNAUTHORIZED.value())
            .error("TOKEN_EXPIRED")
            .message(ex.getMessage())
            .path(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  @ExceptionHandler(InvalidTokenException.class)
  public ResponseEntity<ErrorResponse> handleInvalidToken(
      InvalidTokenException ex, WebRequest request) {
    log.error("Invalid token error: {}", ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.UNAUTHORIZED.value())
            .error("INVALID_TOKEN")
            .message(ex.getMessage())
            .path(request.getDescription(false).replace("uri=", ""));

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }
}
