package com.aksi.domain.order.exception;

import java.util.UUID;

/** Exception який кидається коли замовлення не знайдено */
public class OrderNotFoundException extends RuntimeException {

  private OrderNotFoundException(String message) {
    super(message);
  }

  private OrderNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public static OrderNotFoundException byId(UUID orderId) {
    return new OrderNotFoundException("Замовлення з ID " + orderId + " не знайдено");
  }

  public static OrderNotFoundException byReceiptNumber(String receiptNumber) {
    return new OrderNotFoundException(
        "Замовлення з номером квитанції " + receiptNumber + " не знайдено");
  }

  public static OrderNotFoundException byUniqueTag(String uniqueTag) {
    return new OrderNotFoundException(
        "Замовлення з унікальною міткою " + uniqueTag + " не знайдено");
  }

  public static OrderNotFoundException withMessage(String message) {
    return new OrderNotFoundException(message);
  }

  public static OrderNotFoundException withCause(String message, Throwable cause) {
    return new OrderNotFoundException(message, cause);
  }
}
