package com.aksi.domain.order.statemachine.stage3.validator;

import java.util.ArrayList;
import java.util.List;

/**
 * Базовий клас для результатів валідації Stage3
 * ЕТАП 2.1: ValidationResult - тільки Java стандартні імпорти
 */
public class ValidationResult {

    private boolean valid;
    private List<String> errors;
    private List<String> warnings;
    private String message;

    public ValidationResult() {
        this.valid = true;
        this.errors = new ArrayList<>();
        this.warnings = new ArrayList<>();
    }

    public ValidationResult(boolean valid) {
        this();
        this.valid = valid;
    }

    public ValidationResult(boolean valid, String message) {
        this(valid);
        this.message = message;
    }

    // === ГЕТТЕРИ ТА СЕТТЕРИ ===

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors != null ? errors : new ArrayList<>();
        updateValidityBasedOnErrors();
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings != null ? warnings : new ArrayList<>();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // === МЕТОДИ ДОДАВАННЯ ПОМИЛОК ТА ПОПЕРЕДЖЕНЬ ===

    /**
     * Додає помилку до списку
     */
    public ValidationResult addError(String error) {
        if (error != null && !error.trim().isEmpty()) {
            this.errors.add(error.trim());
            this.valid = false;
        }
        return this;
    }

    /**
     * Додає попередження до списку
     */
    public ValidationResult addWarning(String warning) {
        if (warning != null && !warning.trim().isEmpty()) {
            this.warnings.add(warning.trim());
        }
        return this;
    }

    /**
     * Додає кілька помилок
     */
    public ValidationResult addErrors(List<String> errors) {
        if (errors != null) {
            for (String error : errors) {
                addError(error);
            }
        }
        return this;
    }

    /**
     * Додає кілька попереджень
     */
    public ValidationResult addWarnings(List<String> warnings) {
        if (warnings != null) {
            for (String warning : warnings) {
                addWarning(warning);
            }
        }
        return this;
    }

    // === UTILITY МЕТОДИ ===

    /**
     * Перевіряє чи є помилки
     */
    public boolean hasErrors() {
        return errors != null && !errors.isEmpty();
    }

    /**
     * Перевіряє чи є попередження
     */
    public boolean hasWarnings() {
        return warnings != null && !warnings.isEmpty();
    }

    /**
     * Отримує кількість помилок
     */
    public int getErrorCount() {
        return errors != null ? errors.size() : 0;
    }

    /**
     * Отримує кількість попереджень
     */
    public int getWarningCount() {
        return warnings != null ? warnings.size() : 0;
    }

    /**
     * Отримує першу помилку
     */
    public String getFirstError() {
        return hasErrors() ? errors.get(0) : null;
    }

    /**
     * Отримує перше попередження
     */
    public String getFirstWarning() {
        return hasWarnings() ? warnings.get(0) : null;
    }

    /**
     * Створює загальне повідомлення з усіх помилок та попереджень
     */
    public String getFullMessage() {
        StringBuilder sb = new StringBuilder();

        if (message != null && !message.trim().isEmpty()) {
            sb.append(message.trim());
        }

        if (hasErrors()) {
            if (sb.length() > 0) {
                sb.append(". ");
            }
            sb.append("Помилки: ").append(String.join("; ", errors));
        }

        if (hasWarnings()) {
            if (sb.length() > 0) {
                sb.append(". ");
            }
            sb.append("Попередження: ").append(String.join("; ", warnings));
        }

        return sb.toString();
    }

    /**
     * Об'єднує результати валідації
     */
    public ValidationResult merge(ValidationResult other) {
        if (other == null) {
            return this;
        }

        // Об'єднуємо помилки
        if (other.hasErrors()) {
            addErrors(other.getErrors());
        }

        // Об'єднуємо попередження
        if (other.hasWarnings()) {
            addWarnings(other.getWarnings());
        }

        // Об'єднуємо повідомлення
        if (other.getMessage() != null && !other.getMessage().trim().isEmpty()) {
            String otherMessage = other.getMessage().trim();
            if (this.message == null || this.message.trim().isEmpty()) {
                this.message = otherMessage;
            } else {
                this.message = this.message.trim() + "; " + otherMessage;
            }
        }

        return this;
    }

    /**
     * Очищає всі помилки та попередження
     */
    public ValidationResult clear() {
        this.errors.clear();
        this.warnings.clear();
        this.message = null;
        this.valid = true;
        return this;
    }

    /**
     * Створює копію результату валідації
     */
    public ValidationResult copy() {
        ValidationResult copy = new ValidationResult(this.valid, this.message);
        copy.addErrors(new ArrayList<>(this.errors));
        copy.addWarnings(new ArrayList<>(this.warnings));
        return copy;
    }

    /**
     * Оновлює валідність на основі наявності помилок
     */
    private void updateValidityBasedOnErrors() {
        if (hasErrors()) {
            this.valid = false;
        }
    }

    // === СТАТИЧНІ ФАБРИЧНІ МЕТОДИ ===

    /**
     * Створює успішний результат валідації
     */
    public static ValidationResult success() {
        return new ValidationResult(true);
    }

    /**
     * Створює успішний результат з повідомленням
     */
    public static ValidationResult success(String message) {
        return new ValidationResult(true, message);
    }

    /**
     * Створює неуспішний результат з помилкою
     */
    public static ValidationResult failure(String error) {
        ValidationResult result = new ValidationResult(false);
        result.addError(error);
        return result;
    }

    /**
     * Створює неуспішний результат з кількома помилками
     */
    public static ValidationResult failure(List<String> errors) {
        ValidationResult result = new ValidationResult(false);
        result.addErrors(errors);
        return result;
    }

    /**
     * Створює результат з попередженнями (але валідний)
     */
    public static ValidationResult withWarnings(List<String> warnings) {
        ValidationResult result = new ValidationResult(true);
        result.addWarnings(warnings);
        return result;
    }

    @Override
    public String toString() {
        return "ValidationResult{" +
                "valid=" + valid +
                ", errorsCount=" + getErrorCount() +
                ", warningsCount=" + getWarningCount() +
                ", message='" + message + '\'' +
                '}';
    }
}
