package com.aksi.domain.auth.exception;

/** Виняток для невалідних токенів Domain-specific RuntimeException. */
public class InvalidTokenException extends RuntimeException {

  public InvalidTokenException() {
    super("Токен недійсний або закінчився");
  }

  public InvalidTokenException(String message) {
    super(message);
  }

  public InvalidTokenException(String tokenType, String reason) {
    super("Невалідний " + tokenType + " токен: " + reason);
  }

  public static InvalidTokenException refreshToken() {
    return new InvalidTokenException("refresh", "недійсний або закінчився");
  }

  public static InvalidTokenException accessToken() {
    return new InvalidTokenException("access", "недійсний або закінчився");
  }

  public InvalidTokenException(String message, Throwable cause) {
    super(message, cause);
  }
}
