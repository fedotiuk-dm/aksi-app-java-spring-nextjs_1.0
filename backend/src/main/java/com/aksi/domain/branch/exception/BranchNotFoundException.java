package com.aksi.domain.branch.exception;

import java.util.UUID;

/** Exception для випадку коли філія не знайдена. */
public class BranchNotFoundException extends RuntimeException {

  public BranchNotFoundException(String message) {
    super(message);
  }

  public BranchNotFoundException(UUID branchId) {
    super(String.format("Філію з ID '%s' не знайдено", branchId));
  }

  public BranchNotFoundException(String code, boolean isCode) {
    super(String.format("Філію з кодом '%s' не знайдено", code));
  }

  public BranchNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  // Static factory methods

  public static BranchNotFoundException withId(UUID id) {
    return new BranchNotFoundException("Філія не знайдена з ID: " + id);
  }

  public static BranchNotFoundException withUuid(UUID uuid) {
    return new BranchNotFoundException(String.format("Філію з UUID '%s' не знайдено", uuid));
  }

  public static BranchNotFoundException withCode(String code) {
    return new BranchNotFoundException(String.format("Філію з кодом '%s' не знайдено", code));
  }
}
