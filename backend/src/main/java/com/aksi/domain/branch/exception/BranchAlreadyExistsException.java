package com.aksi.domain.branch.exception;

/** Exception для випадку коли філія з таким кодом вже існує. */
public class BranchAlreadyExistsException extends RuntimeException {

  public BranchAlreadyExistsException(String message) {
    super(message);
  }

  public static BranchAlreadyExistsException forCode(String code) {
    return new BranchAlreadyExistsException(String.format("Філія з кодом '%s' вже існує", code));
  }

  public BranchAlreadyExistsException(String message, Throwable cause) {
    super(message, cause);
  }
}
