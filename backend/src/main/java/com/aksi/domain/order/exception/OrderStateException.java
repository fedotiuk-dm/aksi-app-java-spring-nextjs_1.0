package com.aksi.domain.order.exception;

/** Exception який кидається при помилках стану замовлення. */
public class OrderStateException extends RuntimeException {

  public OrderStateException(String message) {
    super(message);
  }

  public OrderStateException(String message, Throwable cause) {
    super(message, cause);
  }

  /** Для помилок операцій в некоректному стані. */
  public static OrderStateException invalidOperationForStatus(
      String operation, String currentStatus) {
    return new OrderStateException(
        String.format(
            "Операція %s неможлива для замовлення в статусі %s", operation, currentStatus));
  }

  /** Для помилок оплати. */
  public static OrderStateException paymentRequired(String currentStatus) {
    return new OrderStateException(
        "Для замовлення в статусі " + currentStatus + " потрібна оплата");
  }

  /** Для помилок підпису клієнта. */
  public static OrderStateException clientSignatureRequired() {
    return new OrderStateException("Для завершення замовлення потрібен підпис клієнта");
  }

  /** Для помилок згоди з умовами. */
  public static OrderStateException legalAcceptanceRequired() {
    return new OrderStateException(
        "Для завершення замовлення потрібна згода з умовами надання послуг");
  }

  /** Для помилок порожнього замовлення. */
  public static OrderStateException emptyOrder() {
    return new OrderStateException("Неможливо обробити замовлення без предметів");
  }
}
