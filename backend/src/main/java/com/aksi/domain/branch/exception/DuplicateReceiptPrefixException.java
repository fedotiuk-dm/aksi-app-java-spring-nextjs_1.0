package com.aksi.domain.branch.exception;

/**
 * Exception thrown when attempting to create a branch with a receipt prefix that already exists.
 */
public class DuplicateReceiptPrefixException extends RuntimeException {

  public DuplicateReceiptPrefixException(String message) {
    super(message);
  }

  public DuplicateReceiptPrefixException(String message, Throwable cause) {
    super(message, cause);
  }
}
