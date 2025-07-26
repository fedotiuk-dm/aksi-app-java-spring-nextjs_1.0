package com.aksi.domain.branch.exception;

/**
 * Exception thrown when working schedule validation fails. This can happen when: - Not all 7 days
 * are provided - Duplicate days are provided - Invalid time ranges (open >= close) - Working day
 * without proper times
 */
public class InvalidWorkingScheduleException extends RuntimeException {

  public InvalidWorkingScheduleException(String message) {
    super(message);
  }

  public InvalidWorkingScheduleException(String message, Throwable cause) {
    super(message, cause);
  }
}
