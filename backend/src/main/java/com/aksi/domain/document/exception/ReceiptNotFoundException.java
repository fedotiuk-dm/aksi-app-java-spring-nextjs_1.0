package com.aksi.domain.document.exception;

import java.util.UUID;

/** Виняток коли квитанція не знайдена Специфічний для Document domain RuntimeException. */
public class ReceiptNotFoundException extends RuntimeException {

  public ReceiptNotFoundException(String message) {
    super(message);
  }

  public ReceiptNotFoundException(UUID id) {
    super("Квитанція не знайдена з ID: " + id);
  }

  public ReceiptNotFoundException(String field, String value) {
    super("Квитанція не знайдена з " + field + ": " + value);
  }

  public ReceiptNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  // Static factory methods для різних сценаріїв

  public static ReceiptNotFoundException byOrderId(UUID orderId) {
    return new ReceiptNotFoundException("orderId", orderId.toString());
  }

  public static ReceiptNotFoundException byReceiptNumber(String receiptNumber) {
    return new ReceiptNotFoundException("receiptNumber", receiptNumber);
  }
}
