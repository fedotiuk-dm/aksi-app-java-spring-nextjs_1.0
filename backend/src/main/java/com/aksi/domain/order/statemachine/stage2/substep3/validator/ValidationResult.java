package com.aksi.domain.order.statemachine.stage2.substep3.validator;

import java.util.ArrayList;
import java.util.List;

/**
 * Результат валідації даних підетапу 2.3 "Забруднення, дефекти та ризики".
 * Базовий клас БЕЗ залежностей (тільки Java стандартні).
 */
public class ValidationResult {

    private final boolean valid;
    private final List<String> errors;

    public ValidationResult(final boolean valid, final List<String> errors) {
        this.valid = valid;
        this.errors = errors != null ? new ArrayList<>(errors) : new ArrayList<>();
    }

    /**
     * Створює успішний результат валідації.
     *
     * @return успішний ValidationResult
     */
    public static ValidationResult success() {
        return new ValidationResult(true, new ArrayList<>());
    }

    /**
     * Створює неуспішний результат валідації з помилками.
     *
     * @param errors список помилок
     * @return неуспішний ValidationResult
     */
    public static ValidationResult failure(final List<String> errors) {
        return new ValidationResult(false, errors);
    }

    /**
     * Створює неуспішний результат валідації з однією помилкою.
     *
     * @param error повідомлення про помилку
     * @return неуспішний ValidationResult
     */
    public static ValidationResult failure(final String error) {
        final List<String> errors = new ArrayList<>();
        errors.add(error);
        return new ValidationResult(false, errors);
    }

    public boolean isValid() {
        return valid;
    }

    public List<String> getErrors() {
        return new ArrayList<>(errors);
    }

    public String getErrorMessage() {
        if (errors.isEmpty()) {
            return "";
        }
        return String.join("; ", errors);
    }
}
