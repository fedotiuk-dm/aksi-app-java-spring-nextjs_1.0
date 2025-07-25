package com.aksi.domain.user.exception;

/** Exception thrown when trying to create a user that already exists */
public class UserAlreadyExistsException extends RuntimeException {

  public UserAlreadyExistsException(String field, String value) {
    super(String.format("User already exists with %s: %s", field, value));
  }

  public UserAlreadyExistsException(String message) {
    super(message);
  }

  public UserAlreadyExistsException(String message, Throwable cause) {
    super(message, cause);
  }
}
