package com.aksi.domain.order.statemachine.stage2.substep1.validator;

import java.util.ArrayList;
import java.util.List;

/**
 * Результат валідації для підетапу 2.1
 */
public class ValidationResult {

    private final boolean valid;
    private final List<String> errors;

    private ValidationResult(boolean valid, List<String> errors) {
        this.valid = valid;
        this.errors = new ArrayList<>(errors);
    }

    /**
     * Створює успішний результат валідації
     */
    public static ValidationResult success() {
        return new ValidationResult(true, new ArrayList<>());
    }

    /**
     * Створює результат валідації з помилками
     */
    public static ValidationResult failure(List<String> errors) {
        return new ValidationResult(false, errors);
    }

    /**
     * Створює результат валідації з однією помилкою
     */
    public static ValidationResult failure(String error) {
        List<String> errors = new ArrayList<>();
        errors.add(error);
        return new ValidationResult(false, errors);
    }

    /**
     * Чи пройшла валідація
     */
    public boolean isValid() {
        return valid;
    }

    /**
     * Список помилок валідації
     */
    public List<String> getErrors() {
        return new ArrayList<>(errors);
    }

    /**
     * Чи є помилки
     */
    public boolean hasErrors() {
        return !errors.isEmpty();
    }

    /**
     * Кількість помилок
     */
    public int getErrorCount() {
        return errors.size();
    }
}
