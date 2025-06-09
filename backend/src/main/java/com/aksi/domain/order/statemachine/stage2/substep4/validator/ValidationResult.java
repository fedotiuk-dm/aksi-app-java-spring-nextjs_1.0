package com.aksi.domain.order.statemachine.stage2.substep4.validator;

import java.util.ArrayList;
import java.util.List;

/**
 * Результат валідації для підетапу 2.4.
 */
public class ValidationResult {

    private final boolean valid;
    private final List<String> errors;

    private ValidationResult(boolean valid, List<String> errors) {
        this.valid = valid;
        this.errors = errors != null ? new ArrayList<>(errors) : new ArrayList<>();
    }

    /**
     * Створює успішний результат валідації.
     */
    public static ValidationResult success() {
        return new ValidationResult(true, new ArrayList<>());
    }

    /**
     * Створює неуспішний результат валідації з одним повідомленням про помилку.
     */
    public static ValidationResult failure(String errorMessage) {
        List<String> errors = new ArrayList<>();
        errors.add(errorMessage);
        return new ValidationResult(false, errors);
    }

    /**
     * Створює неуспішний результат валідації зі списком помилок.
     */
    public static ValidationResult failure(List<String> errorMessages) {
        return new ValidationResult(false, errorMessages);
    }

    /**
     * Створює неуспішний результат валідації (синонім для failure).
     * Для зручності використання.
     */
    public static ValidationResult invalid(String errorMessage) {
        return failure(errorMessage);
    }

    /**
     * Перевіряє, чи валідація пройшла успішно.
     */
    public boolean isValid() {
        return valid;
    }

    /**
     * Отримує список помилок валідації.
     */
    public List<String> getErrors() {
        return new ArrayList<>(errors);
    }

    /**
     * Отримує перше повідомлення про помилку (якщо є).
     */
    public String getFirstError() {
        return errors.isEmpty() ? null : errors.get(0);
    }

    /**
     * Об'єднує результати валідації.
     */
    public ValidationResult combine(ValidationResult other) {
        if (this.valid && other.valid) {
            return success();
        }

        List<String> combinedErrors = new ArrayList<>(this.errors);
        combinedErrors.addAll(other.errors);
        return failure(combinedErrors);
    }

    @Override
    public String toString() {
        if (valid) {
            return "ValidationResult{valid=true}";
        }
        return "ValidationResult{valid=false, errors=" + errors + "}";
    }
}
