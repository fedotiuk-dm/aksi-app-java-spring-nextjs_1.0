package com.aksi.ui.wizard.step1.validator;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;

/**
 * Результат валідації форми.
 * Містить список помилок та методи для перевірки валідності.
 */
@Getter
public class ValidationResult {

    private final List<String> errors;

    public ValidationResult() {
        this.errors = new ArrayList<>();
    }

    /**
     * Додати помилку валідації.
     */
    public void addError(String error) {
        errors.add(error);
    }

    /**
     * Перевірити чи результат валідний (немає помилок).
     */
    public boolean isValid() {
        return errors.isEmpty();
    }

    /**
     * Отримати всі помилки як один текст.
     */
    public String getErrorsAsText() {
        return String.join("; ", errors);
    }

    /**
     * Перевірити чи є помилки.
     */
    public boolean hasErrors() {
        return !errors.isEmpty();
    }

    /**
     * Отримати кількість помилок.
     */
    public int getErrorCount() {
        return errors.size();
    }
}
