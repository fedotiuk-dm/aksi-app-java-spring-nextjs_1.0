package com.aksi.domain.branch.exception;

import java.util.UUID;

/**
 * Exception для помилок генерації номерів квитанцій.
 */
public class ReceiptNumberException extends RuntimeException {

    public ReceiptNumberException(String message) {
        super(message);
    }

    public ReceiptNumberException(String message, Throwable cause) {
        super(message, cause);
    }

    public static ReceiptNumberException generationFailed(UUID branchId) {
        return new ReceiptNumberException(String.format("Не вдалося згенерувати номер квитанції для філії '%s'", branchId));
    }

    public static ReceiptNumberException invalidFormat(String receiptNumber) {
        return new ReceiptNumberException(String.format("Невалідний формат номера квитанції: '%s'", receiptNumber));
    }

    public static ReceiptNumberException counterOverflow(UUID branchId, Long currentCounter) {
        return new ReceiptNumberException(
            String.format("Переповнення лічильника квитанцій для філії '%s'. Поточне значення: %d", branchId, currentCounter));
    }

    public static ReceiptNumberException duplicateNumber(String receiptNumber) {
        return new ReceiptNumberException(String.format("Номер квитанції '%s' вже існує", receiptNumber));
    }
}
