package com.aksi.domain.item.exception;

/**
 * Exception що викидається при помилках у розрахунках предметів.
 */
public class ItemCalculationException extends RuntimeException {

    public ItemCalculationException(String message) {
        super(message);
    }

    public static ItemCalculationException invalidPrice(String details) {
        return new ItemCalculationException("Неправильна ціна: " + details);
    }

    public static ItemCalculationException invalidModifier(String modifierDetails) {
        return new ItemCalculationException("Неправильний модифікатор: " + modifierDetails);
    }

    public static ItemCalculationException calculationError(String operation, String reason) {
        return new ItemCalculationException("Помилка розрахунку '" + operation + "': " + reason);
    }

    public ItemCalculationException(String message, Throwable cause) {
        super(message, cause);
    }
}
