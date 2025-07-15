package com.aksi.domain.auth.exception;

/** Виняток для невірних облікових даних. */
public class InvalidCredentialsException extends RuntimeException {

  public InvalidCredentialsException(String message) {
    super(message);
  }
}
