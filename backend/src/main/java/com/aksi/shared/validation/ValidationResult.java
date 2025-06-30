package com.aksi.shared.validation;

import java.util.List;
import java.util.stream.Stream;

/**
 * Результат валідації у функціональному стилі.
 * Замінює immediate exceptions на композиційний підхід.
 *
 * Використовується всіма доменами для консистентної валідації.
 */
public record ValidationResult(boolean isValid, List<String> errors) {

    public static ValidationResult valid() {
        return new ValidationResult(true, List.of());
    }

    public static ValidationResult invalid(String error) {
        return new ValidationResult(false, List.of(error));
    }

    public static ValidationResult invalid(List<String> errors) {
        return new ValidationResult(false, errors);
    }

    /**
     * Композиція результатів валідації (AND логіка).
     */
    public ValidationResult and(ValidationResult other) {
        if (this.isValid && other.isValid) {
            return valid();
        }

        var allErrors = Stream.concat(this.errors.stream(), other.errors.stream()).toList();
        return new ValidationResult(false, allErrors);
    }

    /**
     * Альтернативна валідація (OR логіка).
     * Якщо хоча б один результат валідний - повертаємо valid().
     */
    public ValidationResult or(ValidationResult other) {
        if (this.isValid || other.isValid) {
            return valid();
        }

        var allErrors = Stream.concat(this.errors.stream(), other.errors.stream()).toList();
        return new ValidationResult(false, allErrors);
    }

    /**
     * Інверсія результату валідації.
     */
    public ValidationResult not() {
        return this.isValid
            ? invalid("Validation should have failed")
            : valid();
    }

    /**
     * Отримати перше повідомлення про помилку.
     */
    public String getFirstError() {
        return errors.isEmpty() ? "" : errors.get(0);
    }

    /**
     * Отримати всі помилки як один рядок.
     */
    public String getErrorMessage() {
        return String.join("; ", errors);
    }

    /**
     * Перевірити чи є конкретна помилка.
     */
    public boolean hasError(String errorMessage) {
        return errors.contains(errorMessage);
    }

    /**
     * Кількість помилок.
     */
    public int getErrorCount() {
        return errors.size();
    }
}
