package com.aksi.domain.order.statemachine.stage2.substep5.validator;

import java.util.ArrayList;
import java.util.List;

/**
 * Результат валідації для підетапу 2.5: Фотодокументація.
 * Базовий клас без зовнішніх залежностей.
 */
public class ValidationResult {

    private final boolean valid;
    private final List<String> errors;
    private final List<String> warnings;

    /**
     * Конструктор для успішної валідації.
     */
    public ValidationResult() {
        this.valid = true;
        this.errors = new ArrayList<>();
        this.warnings = new ArrayList<>();
    }

    /**
     * Конструктор з помилками.
     */
    public ValidationResult(List<String> errors) {
        this.valid = false;
        this.errors = errors != null ? new ArrayList<>(errors) : new ArrayList<>();
        this.warnings = new ArrayList<>();
    }

    /**
     * Конструктор з помилками та попередженнями.
     */
    public ValidationResult(List<String> errors, List<String> warnings) {
        this.valid = false;
        this.errors = errors != null ? new ArrayList<>(errors) : new ArrayList<>();
        this.warnings = warnings != null ? new ArrayList<>(warnings) : new ArrayList<>();
    }

    /**
     * Перевірка чи валідація успішна.
     */
    public boolean isValid() {
        return valid && errors.isEmpty();
    }

    /**
     * Отримання списку помилок.
     */
    public List<String> getErrors() {
        return new ArrayList<>(errors);
    }

    /**
     * Отримання списку попереджень.
     */
    public List<String> getWarnings() {
        return new ArrayList<>(warnings);
    }

    /**
     * Перевірка наявності помилок.
     */
    public boolean hasErrors() {
        return !errors.isEmpty();
    }

    /**
     * Перевірка наявності попереджень.
     */
    public boolean hasWarnings() {
        return !warnings.isEmpty();
    }

    /**
     * Додавання помилки.
     */
    public void addError(String error) {
        if (error != null && !error.trim().isEmpty()) {
            this.errors.add(error.trim());
        }
    }

    /**
     * Додавання попередження.
     */
    public void addWarning(String warning) {
        if (warning != null && !warning.trim().isEmpty()) {
            this.warnings.add(warning.trim());
        }
    }

    /**
     * Об'єднання з іншим результатом валідації.
     */
    public ValidationResult merge(ValidationResult other) {
        if (other == null) {
            return this;
        }

        List<String> mergedErrors = new ArrayList<>(this.errors);
        mergedErrors.addAll(other.getErrors());

        List<String> mergedWarnings = new ArrayList<>(this.warnings);
        mergedWarnings.addAll(other.getWarnings());

        return new ValidationResult(mergedErrors, mergedWarnings);
    }

    /**
     * Створення успішного результату.
     */
    public static ValidationResult success() {
        return new ValidationResult();
    }

    /**
     * Створення результату з однією помилкою.
     */
    public static ValidationResult failure(String error) {
        List<String> errors = new ArrayList<>();
        errors.add(error);
        return new ValidationResult(errors);
    }

    /**
     * Створення результату з кількома помилками.
     */
    public static ValidationResult failure(List<String> errors) {
        return new ValidationResult(errors);
    }
}
