package com.aksi.domain.auth.exception;

/** Виняток для невалідних токенів. */
public class InvalidTokenException extends RuntimeException {

  public InvalidTokenException(String message) {
    super(message);
  }

  public InvalidTokenException(String message, Throwable cause) {
    super(message, cause);
  }

  public static InvalidTokenException refreshToken() {
    return new InvalidTokenException("Невалідний refresh токен: недійсний або закінчився");
  }
}
