package com.aksi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/** Exception thrown when business validation rules are violated. Returns HTTP 400 Bad Request. */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BusinessValidationException extends RuntimeException {

  public BusinessValidationException(String message) {
    super(message);
  }

  public BusinessValidationException(String message, Throwable cause) {
    super(message, cause);
  }
}
