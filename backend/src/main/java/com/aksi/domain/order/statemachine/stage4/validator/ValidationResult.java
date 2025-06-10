package com.aksi.domain.order.statemachine.stage4.validator;

import java.util.ArrayList;
import java.util.List;

/**
 * Результат валідації для Stage4.
 * Базовий клас для збереження результатів валідації з повідомленнями.
 */
public class ValidationResult {

    /**
     * Чи пройшла валідація успішно.
     */
    private final boolean isValid;

    /**
     * Список повідомлень про помилки валідації.
     */
    private final List<String> errorMessages;

    /**
     * Список попереджень валідації.
     */
    private final List<String> warningMessages;

    /**
     * Конструктор для успішної валідації.
     */
    public ValidationResult() {
        this.isValid = true;
        this.errorMessages = new ArrayList<>();
        this.warningMessages = new ArrayList<>();
    }

    /**
     * Конструктор з результатом валідації.
     *
     * @param isValid чи пройшла валідація успішно
     */
    public ValidationResult(boolean isValid) {
        this.isValid = isValid;
        this.errorMessages = new ArrayList<>();
        this.warningMessages = new ArrayList<>();
    }

    /**
     * Конструктор з повідомленнями про помилки.
     *
     * @param errorMessages список повідомлень про помилки
     */
    public ValidationResult(List<String> errorMessages) {
        this.isValid = errorMessages == null || errorMessages.isEmpty();
        this.errorMessages = errorMessages != null ? new ArrayList<>(errorMessages) : new ArrayList<>();
        this.warningMessages = new ArrayList<>();
    }

    /**
     * Додає повідомлення про помилку.
     *
     * @param message повідомлення про помилку
     */
    public void addError(String message) {
        if (message != null && !message.trim().isEmpty()) {
            this.errorMessages.add(message.trim());
        }
    }

    /**
     * Додає повідомлення про попередження.
     *
     * @param message повідомлення про попередження
     */
    public void addWarning(String message) {
        if (message != null && !message.trim().isEmpty()) {
            this.warningMessages.add(message.trim());
        }
    }

    /**
     * Повертає чи пройшла валідація успішно.
     *
     * @return true якщо валідація успішна
     */
    public boolean isValid() {
        return isValid && (errorMessages == null || errorMessages.isEmpty());
    }

    /**
     * Повертає список повідомлень про помилки.
     *
     * @return список повідомлень про помилки
     */
    public List<String> getErrorMessages() {
        return new ArrayList<>(errorMessages);
    }

    /**
     * Повертає список попереджень.
     *
     * @return список попереджень
     */
    public List<String> getWarningMessages() {
        return new ArrayList<>(warningMessages);
    }

    /**
     * Повертає чи є помилки валідації.
     *
     * @return true якщо є помилки
     */
    public boolean hasErrors() {
        return errorMessages != null && !errorMessages.isEmpty();
    }

    /**
     * Повертає чи є попередження.
     *
     * @return true якщо є попередження
     */
    public boolean hasWarnings() {
        return warningMessages != null && !warningMessages.isEmpty();
    }

    /**
     * Створює результат з одним повідомленням про помилку.
     *
     * @param errorMessage повідомлення про помилку
     * @return ValidationResult з помилкою
     */
    public static ValidationResult withError(String errorMessage) {
        ValidationResult result = new ValidationResult(false);
        result.addError(errorMessage);
        return result;
    }

    /**
     * Створює успішний результат валідації.
     *
     * @return ValidationResult без помилок
     */
    public static ValidationResult success() {
        return new ValidationResult(true);
    }
}
