package com.aksi.api.exception;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;

/**
 * Exception для валідаційних помилок в Order Wizard.
 *
 * Використовується для:
 * - Помилок валідації форм
 * - Неправильних параметрів
 * - Порушення бізнес-правил
 * - Некоректних переходів між етапами
 */
public class OrderWizardValidationException extends OrderWizardApiException {

    private final List<ValidationError> validationErrors;
    private final Map<String, Object> fieldErrors;

    public OrderWizardValidationException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
        this.validationErrors = List.of();
        this.fieldErrors = Map.of();
    }

    public OrderWizardValidationException(String message, String stage, String substep) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", stage, substep);
        this.validationErrors = List.of();
        this.fieldErrors = Map.of();
    }

    public OrderWizardValidationException(String message, List<ValidationError> validationErrors) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
        this.validationErrors = validationErrors != null ? validationErrors : List.of();
        this.fieldErrors = Map.of();
    }

    public OrderWizardValidationException(String message, String stage, String substep,
                                         List<ValidationError> validationErrors) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", stage, substep);
        this.validationErrors = validationErrors != null ? validationErrors : List.of();
        this.fieldErrors = Map.of();
    }

    public OrderWizardValidationException(String message, Map<String, Object> fieldErrors) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
        this.validationErrors = List.of();
        this.fieldErrors = fieldErrors != null ? fieldErrors : Map.of();
    }

    public OrderWizardValidationException(String message, String stage, String substep,
                                         Map<String, Object> fieldErrors) {
        super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", stage, substep);
        this.validationErrors = List.of();
        this.fieldErrors = fieldErrors != null ? fieldErrors : Map.of();
    }

    // Factory methods для зручного створення
    public static OrderWizardValidationException fieldError(String field, String error) {
        return new OrderWizardValidationException(
            "Помилка валідації поля: " + field,
            Map.of(field, error)
        );
    }

    public static OrderWizardValidationException fieldError(String field, String error,
                                                           String stage, String substep) {
        return new OrderWizardValidationException(
            "Помилка валідації поля: " + field,
            stage, substep,
            Map.of(field, error)
        );
    }

    public static OrderWizardValidationException multipleFieldErrors(Map<String, Object> fieldErrors) {
        return new OrderWizardValidationException(
            "Помилки валідації полів: " + String.join(", ", fieldErrors.keySet()),
            fieldErrors
        );
    }

    public static OrderWizardValidationException stageTransition(String fromStage, String toStage, String reason) {
        return new OrderWizardValidationException(
            String.format("Неможливий перехід з етапу %s до %s: %s", fromStage, toStage, reason),
            fromStage, null
        );
    }

    public static OrderWizardValidationException requiredField(String field, String stage, String substep) {
        return fieldError(field, "Обов'язкове поле не заповнене", stage, substep);
    }

    public static OrderWizardValidationException invalidFormat(String field, String expectedFormat,
                                                              String stage, String substep) {
        return fieldError(field, "Неправильний формат. Очікується: " + expectedFormat, stage, substep);
    }

    // Getters
    public List<ValidationError> getValidationErrors() {
        return validationErrors;
    }

    public Map<String, Object> getFieldErrors() {
        return fieldErrors;
    }

    /**
     * Клас для структурованого опису помилки валідації
     */
    public static class ValidationError {
        private final String field;
        private final String message;
        private final String code;
        private final Object rejectedValue;

        public ValidationError(String field, String message) {
            this.field = field;
            this.message = message;
            this.code = "INVALID_VALUE";
            this.rejectedValue = null;
        }

        public ValidationError(String field, String message, String code) {
            this.field = field;
            this.message = message;
            this.code = code;
            this.rejectedValue = null;
        }

        public ValidationError(String field, String message, String code, Object rejectedValue) {
            this.field = field;
            this.message = message;
            this.code = code;
            this.rejectedValue = rejectedValue;
        }

        // Getters
        public String getField() {
            return field;
        }

        public String getMessage() {
            return message;
        }

        public String getCode() {
            return code;
        }

        public Object getRejectedValue() {
            return rejectedValue;
        }
    }
}
