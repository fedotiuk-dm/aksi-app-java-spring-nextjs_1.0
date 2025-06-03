package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для базових даних замовлення
 */
@Component
@Slf4j
public class OrderBasicInfoValidator {

    /**
     * Валідує базові дані замовлення з Map
     */
    public ValidationResult validate(Map<String, Object> orderData) {
        return switch (orderData) {
            case null -> ValidationResult.invalid("Дані замовлення не передано");
            case Map<String, Object> data -> validateOrderData(data);
        };
    }

    /**
     * Внутрішня валідація даних замовлення
     */
    private ValidationResult validateOrderData(Map<String, Object> orderData) {
        List<String> errors = new ArrayList<>();

        // Валідація branchId (обов'язкове поле)
        validateBranchId(orderData.get("branchId"), errors);

        // Валідація унікальної мітки (необов'язкове поле, може бути будь-який текст)
        validateUniqueTag(orderData.get("uniqueTag"), errors);

        return errors.isEmpty() ? ValidationResult.valid() : ValidationResult.invalid(errors);
    }

    /**
     * Валідує branchId з method overloading
     */
    private void validateBranchId(Object branchIdObj, List<String> errors) {
        switch (branchIdObj) {
            case null -> errors.add("ID філії обов'язковий і повинен бути валідним UUID");
            case String str -> validateBranchId(str, errors);
            case UUID uuid -> validateBranchId(uuid, errors);
            default -> errors.add("ID філії повинен бути рядком або UUID");
        }
    }

    private void validateBranchId(String branchIdStr, List<String> errors) {
        if (branchIdStr.trim().isEmpty()) {
            errors.add("ID філії не може бути порожнім");
            return;
        }

        try {
            UUID.fromString(branchIdStr.trim());
        } catch (IllegalArgumentException e) {
            errors.add("ID філії повинен бути валідним UUID");
        }
    }

    private void validateBranchId(UUID uuid, List<String> errors) {
        // UUID об'єкт вже гарантовано валідний, просто перевіряємо що він не null
        if (uuid == null) {
            errors.add("UUID не може бути null");
        }
        // Додаткова валідація UUID не потрібна - тип гарантує валідність
    }

    /**
     * Валідує унікальну мітку з method overloading
     */
    private void validateUniqueTag(Object uniqueTagObj, List<String> errors) {
        switch (uniqueTagObj) {
            case null -> { /* поле необов'язкове */ }
            case String str -> validateUniqueTag(str, errors);
            default -> errors.add("Унікальна мітка повинна бути рядком");
        }
    }

    private void validateUniqueTag(String uniqueTag, List<String> errors) {
        if (uniqueTag.trim().isEmpty()) {
            return; // порожній рядок дозволений
        }

        if (uniqueTag.trim().length() > 100) {
            errors.add("Унікальна мітка не може бути довшою за 100 символів");
        }
        // будь-який непорожній рядок до 100 символів дозволений
    }

    /**
     * Результат валідації
     */
    public static class ValidationResult {
        private final boolean valid;
        private final List<String> errors;

        private ValidationResult(boolean valid, List<String> errors) {
            this.valid = valid;
            this.errors = errors != null ? errors : new ArrayList<>();
        }

        public static ValidationResult valid() {
            return new ValidationResult(true, new ArrayList<>());
        }

        public static ValidationResult invalid(String error) {
            return new ValidationResult(false, List.of(error));
        }

        public static ValidationResult invalid(List<String> errors) {
            return new ValidationResult(false, errors);
        }

        public boolean isValid() {
            return valid;
        }

        public List<String> getErrors() {
            return errors;
        }

        public String getFirstError() {
            return errors.isEmpty() ? null : errors.get(0);
        }
    }
}
