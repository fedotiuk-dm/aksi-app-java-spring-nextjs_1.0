package com.aksi.domain.auth.exception;

/** Виняток для невірних облікових даних Domain-specific RuntimeException */
public class InvalidCredentialsException extends RuntimeException {

  public InvalidCredentialsException() {
    super("Невірний логін або пароль");
  }

  public InvalidCredentialsException(String message) {
    super(message);
  }

  public InvalidCredentialsException(String username, String reason) {
    super("Невірні облікові дані для користувача " + username + ": " + reason);
  }

  public InvalidCredentialsException(String message, Throwable cause) {
    super(message, cause);
  }
}
