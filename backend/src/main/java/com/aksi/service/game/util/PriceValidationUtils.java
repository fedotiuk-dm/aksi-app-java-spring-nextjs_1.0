package com.aksi.service.game.util;

import com.aksi.exception.ConflictException;

import lombok.extern.slf4j.Slf4j;

/**
 * Utility class for price-related validations. Provides reusable validation patterns for price
 * values across game services.
 */
@Slf4j
public final class PriceValidationUtils {

  private PriceValidationUtils() {
    // Utility class
  }

  /**
   * Validate price values (base price and price per level).
   *
   * @param basePrice Base price in kopiykas
   * @param pricePerLevel Price per level in kopiykas
   * @throws ConflictException if prices are invalid
   */
  public static void validatePrices(Integer basePrice, Integer pricePerLevel) {
    if (basePrice != null && basePrice < 0) {
      log.error("Base price must be non-negative, got: {}", basePrice);
      throw new ConflictException("Base price must be non-negative");
    }

    if (pricePerLevel != null && pricePerLevel < 0) {
      log.error("Price per level must be non-negative, got: {}", pricePerLevel);
      throw new ConflictException("Price per level must be non-negative");
    }
  }
}
