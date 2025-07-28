package com.aksi.domain.item.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.aksi.api.item.dto.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/** Global exception handler for item domain. */
@Slf4j
@RestControllerAdvice(basePackages = {"com.aksi.api.item.controller", "com.aksi.domain.item"})
public class ItemDomainExceptionHandler {

  @ExceptionHandler(ServiceCategoryNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleServiceCategoryNotFound(
      ServiceCategoryNotFoundException ex, WebRequest request) {
    log.error("Service category not found: {}", ex.getMessage());
    return createErrorResponse(
        ex.getMessage(), HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", request);
  }

  @ExceptionHandler(PriceListItemNotFoundException.class)
  public ResponseEntity<ErrorResponse> handlePriceListItemNotFound(
      PriceListItemNotFoundException ex, WebRequest request) {
    log.error("Price list item not found: {}", ex.getMessage());
    return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND, "ITEM_NOT_FOUND", request);
  }

  @ExceptionHandler(PriceModifierNotFoundException.class)
  public ResponseEntity<ErrorResponse> handlePriceModifierNotFound(
      PriceModifierNotFoundException ex, WebRequest request) {
    log.error("Price modifier not found: {}", ex.getMessage());
    return createErrorResponse(
        ex.getMessage(), HttpStatus.NOT_FOUND, "MODIFIER_NOT_FOUND", request);
  }

  @ExceptionHandler(ItemPhotoNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleItemPhotoNotFound(
      ItemPhotoNotFoundException ex, WebRequest request) {
    log.error("Item photo not found: {}", ex.getMessage());
    return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND, "PHOTO_NOT_FOUND", request);
  }

  @ExceptionHandler(FormulaCalculationException.class)
  public ResponseEntity<ErrorResponse> handleFormulaCalculationError(
      FormulaCalculationException ex, WebRequest request) {
    log.error("Formula calculation error: {}", ex.getMessage(), ex);
    return createErrorResponse(
        ex.getMessage(), HttpStatus.BAD_REQUEST, "CALCULATION_ERROR", request);
  }

  @ExceptionHandler(InvalidModifierException.class)
  public ResponseEntity<ErrorResponse> handleInvalidModifier(
      InvalidModifierException ex, WebRequest request) {
    log.error("Invalid modifier: {}", ex.getMessage());
    return createErrorResponse(
        ex.getMessage(), HttpStatus.BAD_REQUEST, "INVALID_MODIFIER", request);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgument(
      IllegalArgumentException ex, WebRequest request) {
    log.error("Invalid argument: {}", ex.getMessage());
    return createErrorResponse(
        ex.getMessage(), HttpStatus.BAD_REQUEST, "INVALID_ARGUMENT", request);
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ErrorResponse> handleIllegalState(
      IllegalStateException ex, WebRequest request) {
    log.error("Invalid state: {}", ex.getMessage());
    return createErrorResponse(ex.getMessage(), HttpStatus.CONFLICT, "INVALID_STATE", request);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericError(Exception ex, WebRequest request) {
    log.error("Unexpected error", ex);
    return createErrorResponse(
        "An unexpected error occurred",
        HttpStatus.INTERNAL_SERVER_ERROR,
        "INTERNAL_ERROR",
        request);
  }

  /** Create error response. */
  private ResponseEntity<ErrorResponse> createErrorResponse(
      String message, HttpStatus status, String errorCode, WebRequest request) {
    String path = request.getDescription(false);
    if (path.startsWith("uri=")) {
      path = path.substring(4);
    }

    ErrorResponse errorResponse = new ErrorResponse();
    errorResponse.setError(errorCode);
    errorResponse.setMessage(message);
    errorResponse.setTimestamp(Instant.now());
    errorResponse.setStatus(status.value());
    errorResponse.setPath(path);

    return ResponseEntity.status(status).body(errorResponse);
  }
}
