package com.aksi.domain.order.exception;

import java.math.BigDecimal;

/** Exception який кидається при порушенні business rules знижок. */
public class DiscountValidationException extends RuntimeException {

  public DiscountValidationException(String message) {
    super(message);
  }

  public DiscountValidationException(String message, Throwable cause) {
    super(message, cause);
  }

  /** Для помилок некоректного відсотка знижки. */
  public static DiscountValidationException invalidPercentage(
      BigDecimal percentage, String discountType) {
    return new DiscountValidationException(
        String.format("Некоректний відсоток знижки %s для типу %s", percentage, discountType));
  }

  /** Для помилок кастомної знижки без дозволу. */
  public static DiscountValidationException customPercentageNotAllowed(String discountType) {
    return new DiscountValidationException(
        "Кастомний відсоток знижки не дозволений для типу: " + discountType);
  }

  /** Для помилок перевищення максимального відсотка. */
  public static DiscountValidationException percentageExceedsLimit(
      BigDecimal percentage, BigDecimal maxAllowed) {
    return new DiscountValidationException(
        String.format(
            "Відсоток знижки %s перевищує максимально дозволений %s", percentage, maxAllowed));
  }

  /** Для помилок комбінування знижок. */
  public static DiscountValidationException cannotCombineDiscounts(
      String discount1, String discount2) {
    return new DiscountValidationException(
        String.format("Неможливо комбінувати знижки %s та %s", discount1, discount2));
  }

  /** Для помилок відсутньої документації. */
  public static DiscountValidationException documentationRequired(String discountType) {
    return new DiscountValidationException(
        "Для знижки типу " + discountType + " потрібна документація");
  }
}
