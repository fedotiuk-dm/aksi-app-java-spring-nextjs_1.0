package com.aksi.validator;

import org.springframework.stereotype.Component;

import com.aksi.api.customer.dto.CreateCustomerRequest;
import com.aksi.api.customer.dto.InfoSource;
import com.aksi.api.customer.dto.UpdateCustomerRequest;
import com.aksi.exception.BusinessValidationException;

import lombok.RequiredArgsConstructor;

/** Validator for customer-related operations */
@Component
@RequiredArgsConstructor
public class CustomerValidator {

  /**
   * Validate create customer request
   *
   * @param request Create customer request
   * @throws BusinessValidationException if validation fails
   */
  public void validateCreateRequest(CreateCustomerRequest request) {
    // Validate phone
    validatePhoneNumber(request.getPhonePrimary());

    // Validate discount card if provided
    if (request.getDiscountCardNumber() != null) {
      validateDiscountCardNumber(request.getDiscountCardNumber());
    }

    // Validate info source combination
    validateInfoSource(request.getInfoSource(), request.getInfoSourceOther());
  }

  /**
   * Validate update customer request
   *
   * @param request Update customer request
   * @throws BusinessValidationException if validation fails
   */
  public void validateUpdateRequest(UpdateCustomerRequest request) {
    // Validate phone if provided
    if (request.getPhonePrimary() != null) {
      validatePhoneNumber(request.getPhonePrimary());
    }

    // Validate discount card if provided
    if (request.getDiscountCardNumber() != null) {
      validateDiscountCardNumber(request.getDiscountCardNumber());
    }

    // Validate info source combination if provided
    if (request.getInfoSource() != null) {
      validateInfoSource(request.getInfoSource(), request.getInfoSourceOther());
    }
  }

  /**
   * Validate info source and info source other combination
   *
   * @param infoSource Info source type
   * @param infoSourceOther Other info source details
   * @throws BusinessValidationException if validation fails
   */
  private void validateInfoSource(InfoSource infoSource, String infoSourceOther) {
    if (infoSource == InfoSource.OTHER
        && (infoSourceOther == null || infoSourceOther.trim().isEmpty())) {
      throw new BusinessValidationException(
          "Info source details are required when info source is OTHER");
    }

    if (infoSource != InfoSource.OTHER
        && infoSourceOther != null
        && !infoSourceOther.trim().isEmpty()) {
      throw new BusinessValidationException(
          "Info source details should only be provided when info source is OTHER");
    }
  }

  /**
   * Validate phone number format
   *
   * @param phone Phone number
   * @throws BusinessValidationException if validation fails
   */
  private void validatePhoneNumber(String phone) {
    if (phone == null || phone.trim().isEmpty()) {
      throw new BusinessValidationException("Phone number is required");
    }

    // Remove spaces, dashes, parentheses for validation
    String cleanPhone = phone.replaceAll("[\\s\\-()]", "");

    // Check if starts with + and has only digits after
    if (!cleanPhone.matches("^\\+?\\d{10,15}$")) {
      throw new BusinessValidationException("Invalid phone number format");
    }
  }

  /**
   * Validate discount card number format
   *
   * @param discountCardNumber Discount card number
   * @throws BusinessValidationException if validation fails
   */
  private void validateDiscountCardNumber(String discountCardNumber) {
    if (discountCardNumber != null && !discountCardNumber.trim().isEmpty()) {
      // Remove spaces for validation
      String cleanNumber = discountCardNumber.replaceAll("\\s", "");

      // Check format (example: only digits and length)
      if (!cleanNumber.matches("^\\d{6,12}$")) {
        throw new BusinessValidationException("Invalid discount card number format");
      }
    }
  }
}
