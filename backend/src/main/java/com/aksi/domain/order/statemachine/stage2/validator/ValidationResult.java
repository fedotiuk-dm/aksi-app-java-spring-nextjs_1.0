package com.aksi.domain.order.statemachine.stage2.validator;

import java.util.ArrayList;
import java.util.List;

/**
 * Результат валідації для Stage2 компонентів.
 */
public class ValidationResult {
    private final boolean valid;
    private final List<String> errors;

    public ValidationResult(final boolean valid, final List<String> errors) {
        this.valid = valid;
        this.errors = errors != null ? new ArrayList<>(errors) : new ArrayList<>();
    }

    public static ValidationResult success() {
        return new ValidationResult(true, new ArrayList<>());
    }

    public static ValidationResult failure(final String error) {
        final List<String> errors = new ArrayList<>();
        errors.add(error);
        return new ValidationResult(false, errors);
    }

    public static ValidationResult failure(final List<String> errors) {
        return new ValidationResult(false, errors);
    }

    public boolean isValid() {
        return valid;
    }

    public List<String> getErrors() {
        return new ArrayList<>(errors);
    }

    public String getFirstError() {
        return errors.isEmpty() ? null : errors.get(0);
    }

    public boolean hasErrors() {
        return !errors.isEmpty();
    }

    public int getErrorCount() {
        return errors.size();
    }
}
