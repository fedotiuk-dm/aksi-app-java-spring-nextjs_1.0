package com.aksi.domain.user.exception;

import java.util.UUID;

/** Exception thrown when user is not found */
public class UserNotFoundException extends RuntimeException {

  public UserNotFoundException(UUID id) {
    super("User not found with ID: " + id);
  }

  public UserNotFoundException(String username) {
    super("User not found with username: " + username);
  }

  public UserNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
