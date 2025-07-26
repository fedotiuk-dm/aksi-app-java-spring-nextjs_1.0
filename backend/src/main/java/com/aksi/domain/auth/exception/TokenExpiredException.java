package com.aksi.domain.auth.exception;

import com.aksi.shared.validation.ValidationConstants;

/** Exception thrown when token is expired */
public class TokenExpiredException extends RuntimeException {

  public TokenExpiredException() {
    super(ValidationConstants.Messages.DEFAULT_TOKEN_EXPIRED);
  }

  public TokenExpiredException(String message) {
    super(message);
  }

  public TokenExpiredException(String message, Throwable cause) {
    super(message, cause);
  }
}
