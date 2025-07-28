package com.aksi.domain.item.constant;

import java.math.BigDecimal;
import java.util.Set;

/** Constants for the item domain */
public final class ItemConstants {

  private ItemConstants() {
    // Private constructor to prevent instantiation
  }

  /** Default values */
  public static final BigDecimal DEFAULT_BASE_PRICE = BigDecimal.ZERO;

  public static final BigDecimal DEFAULT_MODIFIER_VALUE = BigDecimal.ONE;
  public static final BigDecimal MIN_PRICE = new BigDecimal("0.01");
  public static final BigDecimal MAX_PRICE = new BigDecimal("999999.99");
  public static final BigDecimal MIN_QUANTITY = BigDecimal.ONE;
  public static final BigDecimal MAX_QUANTITY = new BigDecimal("9999");
  public static final int DEFAULT_PRIORITY = 0;
  public static final int MIN_PRIORITY = 0;
  public static final int MAX_PRIORITY = 1000;

  /** Price calculation constants */
  public static final BigDecimal COLOR_PRICE_MULTIPLIER = new BigDecimal("1.5");

  public static final BigDecimal BLACK_PRICE_MULTIPLIER = new BigDecimal("1.25");
  public static final BigDecimal HUNDRED = new BigDecimal("100");
  public static final BigDecimal ONE_HUNDRED = new BigDecimal("100");
  public static final int PRICE_SCALE = 2;
  public static final int CALCULATION_SCALE = 4;

  /** Validation constants */
  public static final int CODE_MIN_LENGTH = 2;

  public static final int CODE_MAX_LENGTH = 50;
  public static final int NAME_MIN_LENGTH = 2;
  public static final int NAME_MAX_LENGTH = 255;
  public static final int DESCRIPTION_MAX_LENGTH = 1000;
  public static final int FORMULA_MAX_LENGTH = 500;
  public static final int PHOTO_URL_MAX_LENGTH = 500;
  public static final int PHOTO_DESCRIPTION_MAX_LENGTH = 255;

  /** Photo constraints */
  public static final int MAX_PHOTOS_PER_ITEM = 10;

  public static final long MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  public static final String[] ALLOWED_PHOTO_EXTENSIONS = {"jpg", "jpeg", "png", "webp"};
  public static final Set<String> ALLOWED_PHOTO_TYPES =
      Set.of("image/jpeg", "image/jpg", "image/png", "image/webp");

  /** JEXL context variables */
  public static final String JEXL_VAR_BASE_PRICE = "basePrice";

  public static final String JEXL_VAR_QUANTITY = "quantity";
  public static final String JEXL_VAR_COLOR = "color";
  public static final String JEXL_VAR_MODIFIER_VALUE = "modifierValue";
  public static final String JEXL_VAR_TOTAL = "total";

  /** Error messages */
  public static final String ERROR_CATEGORY_NOT_FOUND = "Service category not found: %s";

  public static final String ERROR_PRICE_LIST_ITEM_NOT_FOUND = "Price list item not found: %s";
  public static final String ERROR_MODIFIER_NOT_FOUND = "Price modifier not found: %s";
  public static final String ERROR_PHOTO_NOT_FOUND = "Item photo not found: %d";
  public static final String ERROR_INVALID_FORMULA = "Invalid JEXL formula: %s";
  public static final String ERROR_FORMULA_EVALUATION = "Error evaluating formula: %s";
  public static final String ERROR_INVALID_QUANTITY = "Invalid quantity: %s";
  public static final String ERROR_INVALID_PRICE = "Invalid price: %s";
  public static final String ERROR_DUPLICATE_CODE = "Duplicate code: %s";
  public static final String ERROR_INVALID_COLOR = "Invalid color: %s";
  public static final String ERROR_MAX_PHOTOS_EXCEEDED = "Maximum number of photos exceeded: %d";

  /** Default messages */
  public static final String DEFAULT_MODIFIER_DESCRIPTION = "Price modifier";

  public static final String DEFAULT_PHOTO_DESCRIPTION = "Item photo";
}
