package com.aksi.domain.branch.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.aksi.api.branch.dto.ErrorResponse;
import com.aksi.shared.validation.ValidationConstants;

import lombok.extern.slf4j.Slf4j;

/** Exception handler for branch domain */
@Slf4j
@RestControllerAdvice(basePackages = {"com.aksi.domain.branch", "com.aksi.api.branch"})
public class BranchExceptionHandler {

  @ExceptionHandler(BranchNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleBranchNotFound(
      BranchNotFoundException ex, WebRequest request) {
    log.error(ValidationConstants.Exceptions.BRANCH_NOT_FOUND_LOG, ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error(ValidationConstants.Exceptions.BRANCH_NOT_FOUND_CODE)
            .message(ex.getMessage())
            .path(
                request
                    .getDescription(false)
                    .replace(ValidationConstants.Exceptions.URI_PREFIX, ""));

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }

  @ExceptionHandler(DuplicateReceiptPrefixException.class)
  public ResponseEntity<ErrorResponse> handleDuplicateReceiptPrefix(
      DuplicateReceiptPrefixException ex, WebRequest request) {
    log.error(ValidationConstants.Exceptions.DUPLICATE_RECEIPT_PREFIX_LOG, ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.CONFLICT.value())
            .error(ValidationConstants.Exceptions.DUPLICATE_RECEIPT_PREFIX_CODE)
            .message(ex.getMessage())
            .path(
                request
                    .getDescription(false)
                    .replace(ValidationConstants.Exceptions.URI_PREFIX, ""));

    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }

  @ExceptionHandler(InvalidWorkingScheduleException.class)
  public ResponseEntity<ErrorResponse> handleInvalidWorkingSchedule(
      InvalidWorkingScheduleException ex, WebRequest request) {
    log.error(ValidationConstants.Exceptions.INVALID_WORKING_SCHEDULE_LOG, ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse()
            .timestamp(Instant.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error(ValidationConstants.Exceptions.INVALID_WORKING_SCHEDULE_CODE)
            .message(ex.getMessage())
            .path(
                request
                    .getDescription(false)
                    .replace(ValidationConstants.Exceptions.URI_PREFIX, ""));

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }
}
