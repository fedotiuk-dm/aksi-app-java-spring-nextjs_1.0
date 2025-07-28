package com.aksi.domain.item.validation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.aksi.api.item.dto.ItemCalculationRequest;
import com.aksi.api.item.dto.ItemPhotoUploadRequest;
import com.aksi.domain.item.constant.ItemConstants;

import lombok.extern.slf4j.Slf4j;

/** Validation service for item domain operations. */
@Slf4j
@Service
public class ItemValidationService {

  /**
   * Validate item calculation request.
   *
   * @param request calculation request
   * @throws IllegalArgumentException if validation fails
   */
  public void validateCalculationRequest(ItemCalculationRequest request) {
    List<String> errors = new ArrayList<>();

    // Validate price list item ID
    if (request.getPriceListItemId() == null) {
      errors.add("Price list item ID is required");
    }

    // Validate quantity
    if (request.getQuantity() == null) {
      errors.add("Quantity is required");
    } else if (request.getQuantity().compareTo(ItemConstants.MIN_QUANTITY) < 0) {
      errors.add("Quantity must be at least " + ItemConstants.MIN_QUANTITY);
    } else if (request.getQuantity().compareTo(ItemConstants.MAX_QUANTITY) > 0) {
      errors.add("Quantity cannot exceed " + ItemConstants.MAX_QUANTITY);
    }

    // Validate color
    if (request.getColor() == null) {
      errors.add("Color is required");
    }

    // Check for errors
    if (!errors.isEmpty()) {
      String errorMessage = String.join(", ", errors);
      log.error("Validation failed for calculation request: {}", errorMessage);
      throw new IllegalArgumentException(errorMessage);
    }
  }

  /**
   * Validate photo upload request.
   *
   * @param request photo upload request
   * @throws IllegalArgumentException if validation fails
   */
  public void validatePhotoUploadRequest(ItemPhotoUploadRequest request) {
    List<String> errors = new ArrayList<>();

    // Validate photo data
    if (!StringUtils.hasText(request.getPhotoData())) {
      errors.add("Photo data is required");
    }

    // Validate MIME type
    if (!StringUtils.hasText(request.getMimeType())) {
      errors.add("MIME type is required");
    } else if (!isValidMimeType(request.getMimeType())) {
      errors.add("Invalid MIME type. Allowed types: image/jpeg, image/png, image/webp");
    }

    // Validate file name
    if (!StringUtils.hasText(request.getFileName())) {
      errors.add("File name is required");
    }

    // Check for errors
    if (!errors.isEmpty()) {
      String errorMessage = String.join(", ", errors);
      log.error("Validation failed for photo upload: {}", errorMessage);
      throw new IllegalArgumentException(errorMessage);
    }
  }

  /**
   * Validate search parameters.
   *
   * @param page page number
   * @param size page size
   * @throws IllegalArgumentException if validation fails
   */
  public void validatePaginationParams(Integer page, Integer size) {
    if (page != null && page < 0) {
      throw new IllegalArgumentException("Page number cannot be negative");
    }

    if (size != null) {
      if (size <= 0) {
        throw new IllegalArgumentException("Page size must be positive");
      }
      if (size > 100) {
        throw new IllegalArgumentException("Page size cannot exceed 100");
      }
    }
  }

  /**
   * Validate code parameter.
   *
   * @param code code to validate
   * @param fieldName field name for error message
   * @throws IllegalArgumentException if validation fails
   */
  public void validateCode(String code, String fieldName) {
    if (!StringUtils.hasText(code)) {
      throw new IllegalArgumentException(fieldName + " is required");
    }

    if (code.length() < ItemConstants.CODE_MIN_LENGTH
        || code.length() > ItemConstants.CODE_MAX_LENGTH) {
      throw new IllegalArgumentException(
          String.format(
              "%s length must be between %d and %d characters",
              fieldName, ItemConstants.CODE_MIN_LENGTH, ItemConstants.CODE_MAX_LENGTH));
    }
  }

  /** Check if MIME type is valid. */
  private boolean isValidMimeType(String mimeType) {
    return "image/jpeg".equals(mimeType)
        || "image/png".equals(mimeType)
        || "image/webp".equals(mimeType);
  }
}
