package com.aksi.domain.auth.exception;

/** Exception thrown when token is expired */
public class TokenExpiredException extends RuntimeException {

  public TokenExpiredException() {
    super("Token has expired");
  }

  public TokenExpiredException(String message) {
    super(message);
  }

  public TokenExpiredException(String message, Throwable cause) {
    super(message, cause);
  }
}
