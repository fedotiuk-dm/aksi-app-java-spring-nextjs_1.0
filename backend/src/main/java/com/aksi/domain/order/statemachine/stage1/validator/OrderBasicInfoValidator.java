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

        String cleanTag = uniqueTag.trim();

        if (cleanTag.length() > 100) {
            errors.add("Унікальна мітка не може бути довшою за 100 символів");
            return;
        }

        // Перевірка формату для різних типів міток
        if (isPotentialBarcode(cleanTag)) {
            if (!isValidBarcodeFormat(cleanTag)) {
                errors.add("Штрих-код має некоректний формат");
            }
        } else if (isPotentialQRCode(cleanTag)) {
            if (!isValidQRCodeFormat(cleanTag)) {
                errors.add("QR-код має некоректний формат");
            }
        } else {
            // Звичайний текст - перевіряємо на допустимі символи
            if (!isValidTextTag(cleanTag)) {
                errors.add("Унікальна мітка містить недопустимі символи");
            }
        }
    }

    /**
     * Перевіряє, чи схожа мітка на штрих-код (тільки цифри)
     */
    private boolean isPotentialBarcode(String tag) {
        return tag.matches("^\\d+$") && tag.length() >= 8 && tag.length() <= 18;
    }

    /**
     * Перевіряє, чи схожа мітка на QR-код (містить спеціальні символи)
     */
    private boolean isPotentialQRCode(String tag) {
        return tag.contains("://") || tag.startsWith("http") || tag.matches(".*[{}\\[\\]]+.*");
    }

    /**
     * Валідує формат штрих-коду
     */
    private boolean isValidBarcodeFormat(String barcode) {
        // EAN-13: 13 цифр
        if (barcode.length() == 13) {
            return barcode.matches("^\\d{13}$");
        }
        // EAN-8: 8 цифр
        if (barcode.length() == 8) {
            return barcode.matches("^\\d{8}$");
        }
        // UPC-A: 12 цифр
        if (barcode.length() == 12) {
            return barcode.matches("^\\d{12}$");
        }
        // Code 128: від 8 до 18 символів
        if (barcode.length() >= 8 && barcode.length() <= 18) {
            return barcode.matches("^\\d+$");
        }
        return false;
    }

    /**
     * Валідує формат QR-коду
     */
    private boolean isValidQRCodeFormat(String qrCode) {
        // QR-код може містити різний контент, тому перевіряємо основні обмеження
        return qrCode.length() <= 100 && // максимальна довжина для UI
               !qrCode.contains("\n") && // без переносів рядків
               !qrCode.contains("\r");   // без каретки
    }

    /**
     * Валідує звичайний текстовий тег
     */
    private boolean isValidTextTag(String tag) {
        // Дозволяємо літери, цифри, тире, підкреслення та пробіли
        return tag.matches("^[\\p{L}\\p{N}\\s\\-_]+$");
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
