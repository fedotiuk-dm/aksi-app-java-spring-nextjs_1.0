package com.aksi.domain.auth.exception;

import java.util.UUID;

/** Виняток коли користувач не знайдений Domain-specific RuntimeException. */
public class UserNotFoundException extends RuntimeException {

  public UserNotFoundException(String message) {
    super(message);
  }

  public UserNotFoundException(UUID userId) {
    super("Користувач не знайдений з ID: " + userId);
  }

  public UserNotFoundException(String field, String value) {
    super("Користувач не знайдений з " + field + ": " + value);
  }

  public UserNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
