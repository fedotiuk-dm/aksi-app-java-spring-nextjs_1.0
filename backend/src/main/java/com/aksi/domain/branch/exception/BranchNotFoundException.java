package com.aksi.domain.branch.exception;

/** Exception thrown when a branch is not found by ID or other criteria. */
public class BranchNotFoundException extends RuntimeException {

  public BranchNotFoundException(String message) {
    super(message);
  }

  public BranchNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
