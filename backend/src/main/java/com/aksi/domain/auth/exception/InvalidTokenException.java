package com.aksi.domain.auth.exception;

import com.aksi.shared.validation.ValidationConstants;

/** Exception thrown when token is invalid */
public class InvalidTokenException extends RuntimeException {

  public InvalidTokenException() {
    super(ValidationConstants.Messages.DEFAULT_INVALID_TOKEN);
  }

  public InvalidTokenException(String message) {
    super(message);
  }

  public InvalidTokenException(String message, Throwable cause) {
    super(message, cause);
  }
}
