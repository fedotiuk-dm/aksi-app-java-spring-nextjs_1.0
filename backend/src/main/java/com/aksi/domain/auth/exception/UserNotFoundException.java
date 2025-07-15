package com.aksi.domain.auth.exception;

import java.util.UUID;

/** Виняток коли користувач не знайдений. */
public class UserNotFoundException extends RuntimeException {

  public UserNotFoundException(UUID userId) {
    super("Користувач не знайдений з ID: " + userId);
  }
}
