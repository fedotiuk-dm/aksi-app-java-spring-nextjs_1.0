package com.aksi.domain.auth.exception;

import com.aksi.shared.validation.ValidationConstants;

/** Exception thrown when user provides invalid credentials */
public class InvalidCredentialsException extends RuntimeException {

  public InvalidCredentialsException() {
    super(ValidationConstants.Messages.DEFAULT_INVALID_CREDENTIALS);
  }

  public InvalidCredentialsException(String message) {
    super(message);
  }

  public InvalidCredentialsException(String message, Throwable cause) {
    super(message, cause);
  }
}
