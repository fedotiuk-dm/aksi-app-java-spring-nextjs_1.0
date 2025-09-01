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

  /**
   * Validate that price is non-negative.
   *
   * @param price Price value
   * @param fieldName Field name for error message
   * @throws ConflictException if price is negative
   */
  public static void validateNonNegativePrice(Integer price, String fieldName) {
    if (price != null && price < 0) {
      log.error("{} must be non-negative, got: {}", fieldName, price);
      throw new ConflictException(fieldName + " must be non-negative");
    }
  }

  /**
   * Validate that price is positive (greater than 0).
   *
   * @param price Price value
   * @param fieldName Field name for error message
   * @throws ConflictException if price is not positive
   */
  public static void validatePositivePrice(Integer price, String fieldName) {
    if (price != null && price <= 0) {
      log.error("{} must be positive, got: {}", fieldName, price);
      throw new ConflictException(fieldName + " must be positive");
    }
  }

  /**
   * Validate price range.
   *
   * @param price Price value
   * @param fieldName Field name for error message
   * @param minPrice Minimum price (inclusive)
   * @param maxPrice Maximum price (inclusive)
   * @throws ConflictException if price is out of range
   */
  public static void validatePriceRange(
      Integer price, String fieldName, int minPrice, int maxPrice) {
    if (price != null && (price < minPrice || price > maxPrice)) {
      log.error("{} must be between {} and {}, got: {}", fieldName, minPrice, maxPrice, price);
      throw new ConflictException(fieldName + " must be between " + minPrice + " and " + maxPrice);
    }
  }

  /**
   * Apply minimum price constraint (set to minimum if below).
   *
   * @param price Current price
   * @param minPrice Minimum price
   * @return Adjusted price (minimum if below, original if above)
   */
  public static int applyMinPrice(int price, int minPrice) {
    return Math.max(price, minPrice);
  }

  /**
   * Apply maximum price constraint (set to maximum if above).
   *
   * @param price Current price
   * @param maxPrice Maximum price
   * @return Adjusted price (maximum if above, original if below)
   */
  public static int applyMaxPrice(int price, int maxPrice) {
    return Math.min(price, maxPrice);
  }

  /**
   * Calculate new price with multiplier and ensure non-negative result.
   *
   * @param originalPrice Original price
   * @param multiplier Multiplier to apply
   * @return New price (non-negative)
   */
  public static int calculateMultipliedPrice(int originalPrice, double multiplier) {
    int newPrice = (int) Math.round(originalPrice * multiplier);
    return Math.max(0, newPrice); // Ensure non-negative
  }
}
