package com.aksi.service.pricing.validator;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.aksi.api.pricing.dto.DiscountDto;
import com.aksi.api.pricing.dto.DiscountType;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceModifierDto;
import com.aksi.exception.BadRequestException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validator service for pricing domain business rules. Centralizes all pricing-related business
 * validations. Follows OrderValidator pattern for consistent architecture.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PricingValidator {

  /** Validate price calculation request completeness and correctness. */
  public void validatePriceCalculationRequest(PriceCalculationRequest request) {
    if (request == null) {
      throw new BadRequestException("Price calculation request is required");
    }

    if (request.getItems().isEmpty()) {
      throw new BadRequestException("Price calculation request must contain at least one item");
    }

    if (request.getItems().size() > 100) {
      throw new BadRequestException(
          "Too many items in price calculation request: " + request.getItems().size());
    }

    // Validate each item
    for (int i = 0; i < request.getItems().size(); i++) {
      var item = request.getItems().get(i);

      if (item.getPriceListItemId() == null) {
        throw new BadRequestException("Item " + i + ": Price list item ID is required");
      }

      validateQuantity(item.getQuantity(), "Item " + i + " quantity");

      if (item.getModifierCodes() != null) {
        validateModifierCodes(item.getModifierCodes());
      }
    }

    // Validate global modifiers
    if (request.getGlobalModifiers() != null) {
      validateGlobalModifiers(request.getGlobalModifiers());
    }
  }

  /** Validate quantity value. */
  public void validateQuantity(Integer quantity, String fieldName) {
    if (quantity == null) {
      throw new BadRequestException(fieldName + " is required");
    }

    if (quantity <= 0) {
      throw new BadRequestException(fieldName + " must be positive: " + quantity);
    }

    if (quantity > 1000) {
      throw new BadRequestException(fieldName + " too large: " + quantity);
    }
  }

  /** Validate modifier codes format and existence. */
  public void validateModifierCodes(List<String> modifierCodes) {
    if (modifierCodes == null || modifierCodes.isEmpty()) {
      return; // Optional field
    }

    if (modifierCodes.size() > 20) {
      throw new BadRequestException("Too many modifier codes: " + modifierCodes.size());
    }

    for (String code : modifierCodes) {
      if (code == null || code.trim().isEmpty()) {
        throw new BadRequestException("Modifier code cannot be empty");
      }

      if (code.length() > 50) {
        throw new BadRequestException("Modifier code too long: " + code);
      }

      // Basic format validation
      if (!code.matches("^[A-Z0-9_]+$")) {
        log.warn("Modifier code has unexpected format: {}", code);
      }
    }
  }

  /** Validate global modifiers. */
  public void validateGlobalModifiers(
      com.aksi.api.pricing.dto.GlobalPriceModifiers globalModifiers) {
    if (globalModifiers == null) {
      return; // Optional
    }

    // Validate discount percentage only
    if (globalModifiers.getDiscountType() != null) {
      validateDiscountPercentage(
          globalModifiers.getDiscountPercentage(), globalModifiers.getDiscountType());
    }
  }

  /** Validate discount percentage based on discount type. */
  public void validateDiscountPercentage(Integer discountPercentage, DiscountType discountType) {
    if (discountType == null || discountType == DiscountType.NONE) {
      if (discountPercentage != null && discountPercentage != 0) {
        throw new BadRequestException(
            "Discount percentage should not be specified for NONE discount type");
      }
      return;
    }

    // For OTHER type, percentage is required
    if (discountType == DiscountType.OTHER) {
      if (discountPercentage == null) {
        throw new BadRequestException("Discount percentage is required for OTHER discount type");
      }

      if (discountPercentage < 0 || discountPercentage > 100) {
        throw new BadRequestException(
            "Discount percentage must be between 0 and 100: " + discountPercentage);
      }
    } else {
      // For predefined types, percentage must match expected values exactly
      int expectedPercentage = getExpectedDiscountPercentage(discountType);
      if (discountPercentage == null) {
        // Allow null → we will set expected later in calculation layer
        return;
      }
      if (!discountPercentage.equals(expectedPercentage)) {
        throw new BadRequestException(
            "Discount percentage "
                + discountPercentage
                + " doesn't match expected "
                + expectedPercentage
                + " for type "
                + discountType);
      }
    }
  }

  // ===== DTO VALIDATION METHODS =====

  /** Validate PriceModifierDto for creation. */
  public void validatePriceModifierForCreation(PriceModifierDto dto) {
    if (dto == null) {
      throw new BadRequestException("Price modifier DTO is required");
    }

    if (dto.getCode().trim().isEmpty()) {
      throw new BadRequestException("Price modifier code is required");
    }

    if (dto.getCode().length() > 50) {
      throw new BadRequestException("Price modifier code too long: " + dto.getCode());
    }

    if (!dto.getCode().matches("^[A-Z0-9_]+$")) {
      throw new BadRequestException(
          "Price modifier code must contain only uppercase letters, numbers, and underscores: "
              + dto.getCode());
    }

    if (dto.getName().trim().isEmpty()) {
      throw new BadRequestException("Price modifier name is required");
    }

    if (dto.getName().length() > 255) {
      throw new BadRequestException("Price modifier name too long: " + dto.getName());
    }

    if (dto.getType() == null) {
      throw new BadRequestException("Price modifier type is required");
    }

    if (dto.getValue() == null) {
      throw new BadRequestException("Price modifier value is required");
    }

    validateModifierValue(dto.getValue(), dto.getType());
  }

  /** Validate PriceModifierDto for update. */
  public void validatePriceModifierForUpdate(PriceModifierDto dto) {
    validatePriceModifierForCreation(dto);
    // Additional update-specific validations can be added here
  }

  /** Validate DiscountDto for creation. */
  public void validateDiscountForCreation(DiscountDto dto) {
    if (dto == null) {
      throw new BadRequestException("Discount DTO is required");
    }

    if (dto.getCode().trim().isEmpty()) {
      throw new BadRequestException("Discount code is required");
    }

    if (dto.getCode().length() > 50) {
      throw new BadRequestException("Discount code too long: " + dto.getCode());
    }

    if (!dto.getCode().matches("^[A-Z0-9_]+$")) {
      throw new BadRequestException(
          "Discount code must contain only uppercase letters, numbers, and underscores: "
              + dto.getCode());
    }

    if (dto.getName().trim().isEmpty()) {
      throw new BadRequestException("Discount name is required");
    }

    if (dto.getName().length() > 255) {
      throw new BadRequestException("Discount name too long: " + dto.getName());
    }

    if (dto.getPercentage() == null) {
      throw new BadRequestException("Discount percentage is required");
    }

    if (dto.getPercentage() < 0 || dto.getPercentage() > 100) {
      throw new BadRequestException(
          "Discount percentage must be between 0 and 100: " + dto.getPercentage());
    }

    Optional.ofNullable(dto.getDescription())
        .filter(desc -> desc.length() > 1000)
        .ifPresent(desc -> {
          throw new BadRequestException("Discount description too long");
        });
  }

  /** Validate DiscountDto for update. */
  public void validateDiscountForUpdate(DiscountDto dto) {
    validateDiscountForCreation(dto);
    // Additional update-specific validations can be added here
  }

  /** Validate modifier value based on type. */
  private void validateModifierValue(Integer value, com.aksi.api.pricing.dto.ModifierType type) {
    if (value == null) {
      throw new BadRequestException("Modifier value is required");
    }

    switch (type) {
      case PERCENTAGE -> {
        if (value < 0 || value > 10000) { // 10000 basis points = 100%
          throw new BadRequestException(
              "Percentage modifier value must be between 0 and 10000 basis points: " + value);
        }
      }
      case FIXED -> {
        if (value < 0) {
          throw new BadRequestException("Fixed modifier value must be non-negative: " + value);
        }
        if (value > 1000000) { // 10000 UAH max
          throw new BadRequestException("Fixed modifier value too large: " + value);
        }
      }
      default -> log.warn("Unknown modifier type: {}", type);
    }
  }

  /** Get expected discount percentage for predefined discount types. */
  private int getExpectedDiscountPercentage(DiscountType discountType) {
    return switch (discountType) {
      case EVERCARD, MILITARY -> 10;
      case SOCIAL_MEDIA -> 5;
      default -> 0;
    };
  }
}
