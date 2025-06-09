package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.List;

/**
 * Базовий клас для результатів валідації в етапі 1.1.
 * Містить інформацію про успішність валідації та повідомлення про помилки.
 */
public class ValidationResult {

    /**
     * Чи пройшла валідація успішно.
     */
    private final boolean valid;

    /**
     * Список повідомлень про помилки.
     */
    private final List<String> errorMessages;

    /**
     * Список попереджень.
     */
    private final List<String> warnings;

    // Конструктори
    public ValidationResult(boolean valid) {
        this.valid = valid;
        this.errorMessages = new ArrayList<>();
        this.warnings = new ArrayList<>();
    }

    public ValidationResult(boolean valid, List<String> errorMessages) {
        this.valid = valid;
        this.errorMessages = errorMessages != null ? new ArrayList<>(errorMessages) : new ArrayList<>();
        this.warnings = new ArrayList<>();
    }

    public ValidationResult(boolean valid, List<String> errorMessages, List<String> warnings) {
        this.valid = valid;
        this.errorMessages = errorMessages != null ? new ArrayList<>(errorMessages) : new ArrayList<>();
        this.warnings = warnings != null ? new ArrayList<>(warnings) : new ArrayList<>();
    }

    // Геттери
    public boolean isValid() {
        return valid;
    }

    public boolean isInvalid() {
        return !valid;
    }

    public List<String> getErrorMessages() {
        return new ArrayList<>(errorMessages);
    }

    public List<String> getWarnings() {
        return new ArrayList<>(warnings);
    }

    /**
     * Перевіряє чи є помилки.
     */
    public boolean hasErrors() {
        return !errorMessages.isEmpty();
    }

    /**
     * Перевіряє чи є попередження.
     */
    public boolean hasWarnings() {
        return !warnings.isEmpty();
    }

    /**
     * Отримує перше повідомлення про помилку.
     */
    public String getFirstError() {
        return errorMessages.isEmpty() ? null : errorMessages.get(0);
    }

    /**
     * Отримує об'єднані повідомлення про помилки.
     */
    public String getAllErrorsAsString() {
        return String.join("; ", errorMessages);
    }

    // Статичні методи для створення результатів
    public static ValidationResult success() {
        return new ValidationResult(true);
    }

    public static ValidationResult failure(String errorMessage) {
        List<String> errors = new ArrayList<>();
        errors.add(errorMessage);
        return new ValidationResult(false, errors);
    }

    public static ValidationResult failure(List<String> errorMessages) {
        return new ValidationResult(false, errorMessages);
    }

    public static ValidationResult successWithWarnings(List<String> warnings) {
        return new ValidationResult(true, new ArrayList<>(), warnings);
    }

    @Override
    public String toString() {
        return "ValidationResult{" +
                "valid=" + valid +
                ", errorCount=" + errorMessages.size() +
                ", warningCount=" + warnings.size() +
                '}';
    }
}
