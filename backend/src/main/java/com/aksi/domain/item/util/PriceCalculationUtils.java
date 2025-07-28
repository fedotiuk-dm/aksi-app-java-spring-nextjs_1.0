package com.aksi.domain.item.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.Locale;

import com.aksi.domain.item.constant.ItemConstants;
import com.aksi.domain.item.enums.ModifierType;

/** Utility class for price calculations and formatting */
public final class PriceCalculationUtils {

  private static final NumberFormat UAH_FORMAT =
      NumberFormat.getCurrencyInstance(new Locale("uk", "UA"));

  private PriceCalculationUtils() {
    // Private constructor to prevent instantiation
  }

  /**
   * Round price to 2 decimal places using HALF_UP rounding
   *
   * @param price the price to round
   * @return rounded price
   */
  public static BigDecimal roundPrice(BigDecimal price) {
    if (price == null) {
      return BigDecimal.ZERO;
    }
    return price.setScale(2, RoundingMode.HALF_UP);
  }

  /**
   * Format price as Ukrainian currency
   *
   * @param price the price to format
   * @return formatted price string (e.g., "150,00 ₴")
   */
  public static String formatPriceUAH(BigDecimal price) {
    if (price == null) {
      return formatPriceUAH(BigDecimal.ZERO);
    }
    return UAH_FORMAT.format(price);
  }

  /**
   * Calculate percentage of a value
   *
   * @param value the base value
   * @param percentage the percentage (e.g., 30 for 30%)
   * @return calculated percentage amount
   */
  public static BigDecimal calculatePercentage(BigDecimal value, BigDecimal percentage) {
    if (value == null || percentage == null) {
      return BigDecimal.ZERO;
    }
    return value.multiply(percentage).divide(ItemConstants.ONE_HUNDRED, 4, RoundingMode.HALF_UP);
  }

  /**
   * Apply percentage modifier to a price
   *
   * @param price the base price
   * @param percentage the percentage to apply
   * @return modified price
   */
  public static BigDecimal applyPercentageModifier(BigDecimal price, BigDecimal percentage) {
    if (price == null || percentage == null) {
      return price != null ? price : BigDecimal.ZERO;
    }
    BigDecimal multiplier =
        BigDecimal.ONE.add(percentage.divide(ItemConstants.ONE_HUNDRED, 4, RoundingMode.HALF_UP));
    return price.multiply(multiplier);
  }

  /**
   * Validate price is positive
   *
   * @param price the price to validate
   * @param fieldName name of the field for error message
   * @throws IllegalArgumentException if price is negative or zero
   */
  public static void validatePositivePrice(BigDecimal price, String fieldName) {
    if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
      throw new IllegalArgumentException(fieldName + " must be positive");
    }
  }

  /**
   * Ensure minimum price
   *
   * @param price the calculated price
   * @return price or minimum price if less
   */
  public static BigDecimal ensureMinimumPrice(BigDecimal price) {
    if (price == null || price.compareTo(ItemConstants.MIN_PRICE) < 0) {
      return ItemConstants.MIN_PRICE;
    }
    return price;
  }

  /**
   * Calculate total with quantity
   *
   * @param unitPrice price per unit
   * @param quantity quantity
   * @return total price
   */
  public static BigDecimal calculateTotal(BigDecimal unitPrice, BigDecimal quantity) {
    if (unitPrice == null || quantity == null) {
      return BigDecimal.ZERO;
    }
    return unitPrice.multiply(quantity);
  }

  /**
   * Get modifier type display name in Ukrainian
   *
   * @param type the modifier type
   * @return display name
   */
  public static String getModifierTypeDisplayName(ModifierType type) {
    if (type == null) {
      return "Невідомий";
    }
    return switch (type) {
      case PERCENTAGE -> "Відсоток";
      case FIXED_AMOUNT -> "Фіксована сума";
    };
  }

  /**
   * Format modifier value for display
   *
   * @param value the modifier value
   * @param type the modifier type
   * @return formatted string
   */
  public static String formatModifierValue(BigDecimal value, ModifierType type) {
    if (value == null || type == null) {
      return "";
    }

    return switch (type) {
      case PERCENTAGE -> value.stripTrailingZeros().toPlainString() + "%";
      case FIXED_AMOUNT -> formatPriceUAH(value);
    };
  }

  /**
   * Compare prices with tolerance for floating point comparison
   *
   * @param price1 first price
   * @param price2 second price
   * @return true if prices are equal within tolerance
   */
  public static boolean pricesEqual(BigDecimal price1, BigDecimal price2) {
    if (price1 == null && price2 == null) {
      return true;
    }
    if (price1 == null || price2 == null) {
      return false;
    }

    // Compare with 2 decimal places precision
    BigDecimal rounded1 = roundPrice(price1);
    BigDecimal rounded2 = roundPrice(price2);
    return rounded1.compareTo(rounded2) == 0;
  }

  /**
   * Calculate discount amount from original and discounted prices
   *
   * @param originalPrice the original price
   * @param discountedPrice the discounted price
   * @return discount amount
   */
  public static BigDecimal calculateDiscountAmount(
      BigDecimal originalPrice, BigDecimal discountedPrice) {
    if (originalPrice == null || discountedPrice == null) {
      return BigDecimal.ZERO;
    }
    return originalPrice.subtract(discountedPrice).max(BigDecimal.ZERO);
  }

  /**
   * Calculate discount percentage from original and discounted prices
   *
   * @param originalPrice the original price
   * @param discountedPrice the discounted price
   * @return discount percentage
   */
  public static BigDecimal calculateDiscountPercentage(
      BigDecimal originalPrice, BigDecimal discountedPrice) {
    if (originalPrice == null
        || discountedPrice == null
        || originalPrice.compareTo(BigDecimal.ZERO) == 0) {
      return BigDecimal.ZERO;
    }

    BigDecimal discount = calculateDiscountAmount(originalPrice, discountedPrice);
    return discount
        .multiply(ItemConstants.ONE_HUNDRED)
        .divide(originalPrice, 2, RoundingMode.HALF_UP);
  }
}
