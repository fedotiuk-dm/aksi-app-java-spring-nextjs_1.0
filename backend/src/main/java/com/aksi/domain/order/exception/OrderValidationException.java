package com.aksi.domain.order.exception;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.aksi.domain.order.enums.OrderStatus;
import com.aksi.domain.order.enums.UrgencyType;

/** Exception який кидається при порушенні business rules замовлення */
public class OrderValidationException extends RuntimeException {

  public OrderValidationException(String message) {
    super(message);
  }

  public OrderValidationException(String message, Throwable cause) {
    super(message, cause);
  }

  /** Для помилок статусу замовлення */
  public static OrderValidationException invalidStatusTransition(
      String fromStatus, String toStatus) {
    return new OrderValidationException(
        String.format("Неможливий перехід зі статусу %s до %s", fromStatus, toStatus));
  }

  public static OrderValidationException invalidStatusTransition(
      OrderStatus fromStatus, OrderStatus toStatus) {
    return new OrderValidationException(
        String.format(
            "Неможливий перехід зі статусу %s до %s",
            fromStatus.getDescription(), toStatus.getDescription()));
  }

  /** Для помилок модифікації замовлення */
  public static OrderValidationException cannotModifyOrder(String currentStatus) {
    return new OrderValidationException("Неможливо змінити замовлення в статусі: " + currentStatus);
  }

  /** Для помилок з предметами */
  public static OrderValidationException cannotModifyItems(String currentStatus) {
    return new OrderValidationException(
        "Неможливо змінити предмети замовлення в статусі: " + currentStatus);
  }

  /** Для помилок унікальності */
  public static OrderValidationException duplicateReceiptNumber(String receiptNumber) {
    return new OrderValidationException(
        "Замовлення з номером квитанції " + receiptNumber + " вже існує");
  }

  /** Для помилок унікальної мітки */
  public static OrderValidationException duplicateUniqueTag(String uniqueTag) {
    return new OrderValidationException(
        "Замовлення з унікальною міткою " + uniqueTag + " вже існує");
  }

  /** Для помилок завершення замовлення */
  public static OrderValidationException cannotCompleteOrder(String reason) {
    return new OrderValidationException("Неможливо завершити замовлення: " + reason);
  }

  // === ДОДАТКОВІ FACTORY МЕТОДИ ДЛЯ VALIDATION ===

  public static OrderValidationException receiptNumberAlreadyExists(String receiptNumber) {
    return new OrderValidationException(
        "Замовлення з номером квитанції " + receiptNumber + " вже існує");
  }

  public static OrderValidationException branchRequired() {
    return new OrderValidationException("Потрібно вказати філію для замовлення");
  }

  public static OrderValidationException clientRequired() {
    return new OrderValidationException("Потрібно вказати клієнта для замовлення");
  }

  public static OrderValidationException orderRequired() {
    return new OrderValidationException("Замовлення не може бути null");
  }

  public static OrderValidationException invalidInitialStatus(OrderStatus status) {
    return new OrderValidationException(
        "Неправильний початковий статус замовлення: "
            + status.getDescription()
            + ". Очікується: DRAFT");
  }

  public static OrderValidationException cannotDeleteOrder(Long orderId, OrderStatus status) {
    return new OrderValidationException(
        String.format(
            "Неможливо видалити замовлення %d в статусі %s", orderId, status.getDescription()));
  }

  public static OrderValidationException cannotModifyOrder(Long orderId, OrderStatus status) {
    return new OrderValidationException(
        String.format(
            "Неможливо змінити замовлення %d в статусі %s", orderId, status.getDescription()));
  }

  public static OrderValidationException cannotChangeOrderId() {
    return new OrderValidationException("Неможливо змінити ID замовлення");
  }

  public static OrderValidationException cannotChangeReceiptNumber() {
    return new OrderValidationException("Неможливо змінити номер квитанції після створення");
  }

  public static OrderValidationException cannotChangeClientAfterProcessingStarted() {
    return new OrderValidationException(
        "Неможливо змінити клієнта після початку обробки замовлення");
  }

  public static OrderValidationException deliveryDateInPast() {
    return new OrderValidationException("Дата доставки не може бути в минулому");
  }

  public static OrderValidationException deliveryDateTooEarly(
      UrgencyType urgencyType, LocalDateTime deliveryDate, LocalDateTime minDate) {
    return new OrderValidationException(
        String.format(
            "Дата доставки %s занадто рання для терміновості %s. Мінімальна дата: %s",
            deliveryDate, urgencyType, minDate));
  }

  public static OrderValidationException invalidPercentageDiscount(BigDecimal value) {
    return new OrderValidationException(
        "Неправильна процентна знижка: " + value + "%. Має бути від 0 до 100");
  }

  public static OrderValidationException invalidFixedDiscount(BigDecimal value) {
    return new OrderValidationException(
        "Неправильна фіксована знижка: " + value + ". Має бути більше 0");
  }

  public static OrderValidationException discountTooHigh(
      BigDecimal discountAmount, BigDecimal maxDiscount) {
    return new OrderValidationException(
        String.format("Знижка %s перевищує максимально допустиму %s", discountAmount, maxDiscount));
  }

  public static OrderValidationException negativeItemsTotal(BigDecimal itemsTotal) {
    return new OrderValidationException("Сума предметів не може бути від'ємною: " + itemsTotal);
  }

  public static OrderValidationException invalidTotalAmount(BigDecimal totalAmount) {
    return new OrderValidationException(
        "Загальна сума замовлення має бути більше 0: " + totalAmount);
  }

  public static OrderValidationException invalidCalculation(
      BigDecimal actual, BigDecimal expected) {
    return new OrderValidationException(
        String.format(
            "Неправильний розрахунок суми. Фактична: %s, очікувана: %s", actual, expected));
  }
}
