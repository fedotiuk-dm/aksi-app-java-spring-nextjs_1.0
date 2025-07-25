package com.aksi.domain.auth.exception;

/** Exception thrown when token is invalid */
public class InvalidTokenException extends RuntimeException {

  public InvalidTokenException() {
    super("Invalid token");
  }

  public InvalidTokenException(String message) {
    super(message);
  }

  public InvalidTokenException(String message, Throwable cause) {
    super(message, cause);
  }
}
