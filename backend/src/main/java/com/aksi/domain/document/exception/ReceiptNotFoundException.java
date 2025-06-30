package com.aksi.domain.document.exception;

import java.util.UUID;

/**
 * Exception що викидається коли квитанція не знайдена
 */
public class ReceiptNotFoundException extends RuntimeException {

    public ReceiptNotFoundException(String message) {
        super(message);
    }

    public ReceiptNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ReceiptNotFoundException(Long id) {
        super("Квитанція з ID " + id + " не знайдена");
    }

    public ReceiptNotFoundException(String field, String value) {
        super("Квитанція з " + field + " '" + value + "' не знайдена");
    }

    public static ReceiptNotFoundException byReceiptNumber(String receiptNumber) {
        return new ReceiptNotFoundException("receiptNumber", receiptNumber);
    }

    public static ReceiptNotFoundException byOrderId(UUID orderId) {
        return new ReceiptNotFoundException("orderId", orderId.toString());
    }
}
