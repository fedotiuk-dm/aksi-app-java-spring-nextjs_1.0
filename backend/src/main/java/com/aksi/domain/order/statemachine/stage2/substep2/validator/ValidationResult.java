package com.aksi.domain.order.statemachine.stage2.substep2.validator;

import java.util.ArrayList;
import java.util.List;

/**
 * Результат валідації характеристик предмета
 */
public class ValidationResult {

    private final boolean valid;
    private final List<String> errors;

    public ValidationResult(boolean valid) {
        this.valid = valid;
        this.errors = new ArrayList<>();
    }

    public ValidationResult(boolean valid, List<String> errors) {
        this.valid = valid;
        this.errors = errors != null ? new ArrayList<>(errors) : new ArrayList<>();
    }

    /**
     * Перевіряє чи результат валідний
     */
    public boolean isValid() {
        return valid;
    }

    /**
     * Отримати список помилок валідації
     */
    public List<String> getErrors() {
        return new ArrayList<>(errors);
    }

    /**
     * Додати помилку валідації
     */
    public void addError(String error) {
        if (error != null && !error.trim().isEmpty()) {
            this.errors.add(error);
        }
    }

    /**
     * Перевіряє чи є помилки
     */
    public boolean hasErrors() {
        return !errors.isEmpty();
    }

    /**
     * Отримати кількість помилок
     */
    public int getErrorCount() {
        return errors.size();
    }

    /**
     * Отримати першу помилку або null
     */
    public String getFirstError() {
        return errors.isEmpty() ? null : errors.get(0);
    }

    /**
     * Створити успішний результат валідації
     */
    public static ValidationResult success() {
        return new ValidationResult(true);
    }

    /**
     * Створити неуспішний результат валідації з однією помилкою
     */
    public static ValidationResult failure(String error) {
        ValidationResult result = new ValidationResult(false);
        result.addError(error);
        return result;
    }

    /**
     * Створити неуспішний результат валідації з кількома помилками
     */
    public static ValidationResult failure(List<String> errors) {
        return new ValidationResult(false, errors);
    }

    @Override
    public String toString() {
        if (valid) {
            return "ValidationResult{valid=true}";
        } else {
            return "ValidationResult{valid=false, errors=" + errors + "}";
        }
    }
}
