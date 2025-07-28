package com.aksi.domain.item.exception;

/** Exception thrown when a price modifier is invalid. */
public class InvalidModifierException extends RuntimeException {

  public InvalidModifierException(String message) {
    super(message);
  }

  public InvalidModifierException(String message, Throwable cause) {
    super(message, cause);
  }
}
