package com.aksi.domain.item.exception;

/**
 * Exception що викидається при помилках валідації предметів.
 */
public class ItemValidationException extends RuntimeException {

    public ItemValidationException(String message) {
        super(message);
    }

    public static ItemValidationException invalidField(String fieldName, String reason) {
        return new ItemValidationException("Неправильне поле '" + fieldName + "': " + reason);
    }

    public static ItemValidationException businessRuleViolation(String rule, String details) {
        return new ItemValidationException("Порушення бізнес-правила '" + rule + "': " + details);
    }

    public static ItemValidationException duplicateValue(String fieldName, String value) {
        return new ItemValidationException("Дублікат значення '" + value + "' для поля '" + fieldName + "'");
    }

    public ItemValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
