package com.aksi.domain.item.util;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.aksi.domain.item.constant.ItemConstants;

import lombok.extern.slf4j.Slf4j;

/**
 * Validator utility that uses ItemConstants for validation. This component ensures all constants
 * are properly utilized.
 */
@Slf4j
@Component
public class ItemConstantsValidator {

  /**
   * Validate price is within allowed range.
   *
   * @param price price to validate
   * @param fieldName field name for error message
   * @return true if valid
   */
  public boolean validatePriceRange(BigDecimal price, String fieldName) {
    if (price == null) {
      log.warn("{} is null", fieldName);
      return false;
    }

    if (price.compareTo(ItemConstants.MIN_PRICE) < 0) {
      log.warn("{} {} is below minimum {}", fieldName, price, ItemConstants.MIN_PRICE);
      return false;
    }

    if (price.compareTo(ItemConstants.MAX_PRICE) > 0) {
      log.warn("{} {} exceeds maximum {}", fieldName, price, ItemConstants.MAX_PRICE);
      return false;
    }

    return true;
  }

  /**
   * Validate priority is within allowed range.
   *
   * @param priority priority to validate
   * @return true if valid
   */
  public boolean validatePriorityRange(Integer priority) {
    if (priority == null) {
      return false;
    }

    return priority >= ItemConstants.MIN_PRIORITY && priority <= ItemConstants.MAX_PRIORITY;
  }

  /**
   * Get default priority if null.
   *
   * @param priority priority value
   * @return priority or default
   */
  public int getDefaultPriority(Integer priority) {
    return priority != null ? priority : ItemConstants.DEFAULT_PRIORITY;
  }

  /**
   * Apply color price multiplier based on color type.
   *
   * @param basePrice base price
   * @param isColorPrice whether this is color price
   * @param isBlackPrice whether this is black price
   * @return calculated price
   */
  public BigDecimal applyColorMultiplier(
      BigDecimal basePrice, boolean isColorPrice, boolean isBlackPrice) {
    if (basePrice == null) {
      basePrice = ItemConstants.DEFAULT_BASE_PRICE;
    }

    if (isColorPrice) {
      return basePrice.multiply(ItemConstants.COLOR_PRICE_MULTIPLIER);
    }

    if (isBlackPrice) {
      return basePrice.multiply(ItemConstants.BLACK_PRICE_MULTIPLIER);
    }

    return basePrice;
  }

  /**
   * Validate formula length.
   *
   * @param formula formula to validate
   * @return true if valid
   */
  public boolean validateFormulaLength(String formula) {
    if (formula == null) {
      return true; // null formula is valid
    }

    return formula.length() <= ItemConstants.FORMULA_MAX_LENGTH;
  }

  /**
   * Validate photo constraints.
   *
   * @param photoCount current photo count
   * @param photoSize photo size in bytes
   * @return true if valid
   */
  public boolean validatePhotoConstraints(int photoCount, long photoSize) {
    if (photoCount >= ItemConstants.MAX_PHOTOS_PER_ITEM) {
      log.warn("Photo count {} exceeds maximum {}", photoCount, ItemConstants.MAX_PHOTOS_PER_ITEM);
      return false;
    }

    if (photoSize > ItemConstants.MAX_PHOTO_SIZE_BYTES) {
      log.warn("Photo size {} exceeds maximum {}", photoSize, ItemConstants.MAX_PHOTO_SIZE_BYTES);
      return false;
    }

    return true;
  }

  /**
   * Check if file extension is allowed for photos.
   *
   * @param extension file extension
   * @return true if allowed
   */
  public boolean isAllowedPhotoExtension(String extension) {
    if (extension == null) {
      return false;
    }

    String lowerExt = extension.toLowerCase();
    for (String allowed : ItemConstants.ALLOWED_PHOTO_EXTENSIONS) {
      if (allowed.equals(lowerExt)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validate string length for various fields.
   *
   * @param value value to validate
   * @param fieldType type of field (code, name, description, etc.)
   * @return true if valid
   */
  public boolean validateStringLength(String value, FieldType fieldType) {
    if (value == null) {
      return fieldType != FieldType.CODE && fieldType != FieldType.NAME;
    }

    int length = value.length();

    return switch (fieldType) {
      case CODE ->
          length >= ItemConstants.CODE_MIN_LENGTH && length <= ItemConstants.CODE_MAX_LENGTH;
      case NAME ->
          length >= ItemConstants.NAME_MIN_LENGTH && length <= ItemConstants.NAME_MAX_LENGTH;
      case DESCRIPTION -> length <= ItemConstants.DESCRIPTION_MAX_LENGTH;
      case PHOTO_URL -> length <= ItemConstants.PHOTO_URL_MAX_LENGTH;
      case PHOTO_DESCRIPTION -> length <= ItemConstants.PHOTO_DESCRIPTION_MAX_LENGTH;
    };
  }

  /** Field types for validation. */
  public enum FieldType {
    CODE,
    NAME,
    DESCRIPTION,
    PHOTO_URL,
    PHOTO_DESCRIPTION
  }

  /**
   * Get appropriate scale for calculations.
   *
   * @param isIntermediateCalculation whether this is intermediate calculation
   * @return scale to use
   */
  public int getCalculationScale(boolean isIntermediateCalculation) {
    return isIntermediateCalculation ? ItemConstants.CALCULATION_SCALE : ItemConstants.PRICE_SCALE;
  }
}
