package com.aksi.domain.order.statemachine.stage2.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.service.PriceListService;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для підетапу 2.1 "Основна інформація про предмет".
 *
 * Відповідає за валідацію:
 * - Вибраної категорії послуги
 * - Вибраного найменування виробу
 * - Кількості
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ItemBasicInfoValidator {

    private final PriceListService priceListService;

    /**
     * Валідує основну інформацію про предмет.
     *
     * @param itemData дані предмета для валідації
     * @return результат валідації
     */
    public ValidationResult validate(Map<String, Object> itemData) {
        log.debug("Валідація основної інформації про предмет: {}", itemData);

        List<String> errors = new ArrayList<>();

        // Валідація категорії послуги
        validateCategory(itemData, errors);

        // Валідація найменування виробу
        validateItem(itemData, errors);

        // Валідація кількості
        validateQuantity(itemData, errors);

        boolean isValid = errors.isEmpty();

        log.debug("Результат валідації основної інформації: valid={}, errors={}", isValid, errors);

        return ValidationResult.builder()
            .valid(isValid)
            .errors(errors)
            .build();
    }

    /**
     * Валідує вибрану категорію послуги.
     */
    private void validateCategory(Map<String, Object> itemData, List<String> errors) {
        Object categoryId = itemData.get("categoryId");

        if (categoryId == null) {
            errors.add("Категорія послуги обов'язкова для заповнення");
            return;
        }

        String categoryIdStr = categoryId.toString().trim();
        if (categoryIdStr.isEmpty()) {
            errors.add("Категорія послуги не може бути порожньою");
            return;
        }

        // Перевірка формату UUID
        try {
            java.util.UUID.fromString(categoryIdStr);
        } catch (IllegalArgumentException e) {
            errors.add("Неправильний формат ідентифікатора категорії");
        }
    }

    /**
     * Валідує вибране найменування виробу.
     */
    private void validateItem(Map<String, Object> itemData, List<String> errors) {
        Object itemId = itemData.get("itemId");

        if (itemId == null) {
            errors.add("Найменування виробу обов'язкове для заповнення");
            return;
        }

        String itemIdStr = itemId.toString().trim();
        if (itemIdStr.isEmpty()) {
            errors.add("Найменування виробу не може бути порожнім");
            return;
        }

        // Перевірка формату UUID
        try {
            java.util.UUID.fromString(itemIdStr);
        } catch (IllegalArgumentException e) {
            errors.add("Неправильний формат ідентифікатора виробу");
        }
    }

    /**
     * Валідує кількість.
     */
    private void validateQuantity(Map<String, Object> itemData, List<String> errors) {
        Object quantity = itemData.get("quantity");

        if (quantity == null) {
            errors.add("Кількість обов'язкова для заповнення");
            return;
        }

        try {
            int quantityValue;
            if (quantity instanceof Integer intValue) {
                quantityValue = intValue;
            } else {
                quantityValue = Integer.parseInt(quantity.toString());
            }

            if (quantityValue <= 0) {
                errors.add("Кількість повинна бути більше нуля");
            }

            if (quantityValue > 1000) {
                errors.add("Кількість не може перевищувати 1000");
            }

        } catch (NumberFormatException e) {
            errors.add("Кількість повинна бути числом");
        }
    }

    /**
     * Валідує, чи відповідає вибраний виріб категорії.
     */
    public ValidationResult validateItemMatchesCategory(String categoryId, String itemId) {
        log.debug("Валідація відповідності виробу {} категорії {}", itemId, categoryId);

        List<String> errors = new ArrayList<>();

        if (categoryId == null || categoryId.trim().isEmpty()) {
            errors.add("Категорія не вибрана");
        }

        if (itemId == null || itemId.trim().isEmpty()) {
            errors.add("Виріб не вибраний");
        }

        // Перевіряємо в базі даних, що itemId відноситься до categoryId
        if (errors.isEmpty()) {
            try {
                java.util.UUID categoryUuid = java.util.UUID.fromString(categoryId);
                java.util.UUID itemUuid = java.util.UUID.fromString(itemId);

                // Отримуємо елемент прайс-листа та перевіряємо його категорію
                PriceListItemDTO priceListItem = priceListService.getItemById(itemUuid);

                if (priceListItem == null) {
                    errors.add("Вибраний виріб не знайдено в прайс-листі");
                } else if (!categoryUuid.equals(priceListItem.getCategoryId())) {
                    errors.add("Вибраний виріб не відноситься до вказаної категорії");
                }

            } catch (IllegalArgumentException e) {
                errors.add("Неправильний формат ідентифікаторів");
            } catch (Exception e) {
                log.warn("Помилка перевірки відповідності виробу {} категорії {}: {}",
                    itemId, categoryId, e.getMessage());
                errors.add("Помилка перевірки відповідності виробу та категорії");
            }
        }

        boolean isValid = errors.isEmpty();

        return ValidationResult.builder()
            .valid(isValid)
            .errors(errors)
            .build();
    }

    /**
     * Валідує вибір категорії.
     */
    public ValidationResult validateCategorySelection(java.util.UUID categoryId) {
        log.debug("Валідація вибору категорії: {}", categoryId);

        List<String> errors = new ArrayList<>();

        if (categoryId == null) {
            errors.add("Категорія послуги обов'язкова для заповнення");
        }

        boolean isValid = errors.isEmpty();

        return ValidationResult.builder()
            .valid(isValid)
            .errors(errors)
            .build();
    }

    /**
     * Валідує вибір предмета з урахуванням категорії.
     */
    public ValidationResult validateItemSelection(java.util.UUID itemId,
                                                 com.aksi.domain.pricing.dto.ServiceCategoryDTO category) {
        log.debug("Валідація вибору предмета: {} для категорії: {}", itemId,
                 category != null ? category.getId() : null);

        List<String> errors = new ArrayList<>();

        if (itemId == null) {
            errors.add("Найменування виробу обов'язкове для заповнення");
            return ValidationResult.builder().valid(false).errors(errors).build();
        }

        if (category == null) {
            errors.add("Спочатку виберіть категорію послуги");
            return ValidationResult.builder().valid(false).errors(errors).build();
        }

        // Перевіряємо відповідність предмета категорії в базі даних
        return validateItemMatchesCategory(category.getId().toString(), itemId.toString());
    }

    /**
     * Валідує кількість.
     */
    public ValidationResult validateQuantity(Object quantity) {
        log.debug("Валідація кількості: {}", quantity);

        List<String> errors = new ArrayList<>();

        if (quantity == null) {
            errors.add("Кількість обов'язкова для заповнення");
            return ValidationResult.builder().valid(false).errors(errors).build();
        }

        try {
            int quantityValue;
            if (quantity instanceof Integer intValue) {
                quantityValue = intValue;
            } else {
                quantityValue = Integer.parseInt(quantity.toString());
            }

            if (quantityValue <= 0) {
                errors.add("Кількість повинна бути більше нуля");
            }

            if (quantityValue > 1000) {
                errors.add("Кількість не може перевищувати 1000");
            }

        } catch (NumberFormatException e) {
            errors.add("Кількість повинна бути числом");
        }

        boolean isValid = errors.isEmpty();

        return ValidationResult.builder()
            .valid(isValid)
            .errors(errors)
            .build();
    }

    /**
     * Валідує, чи готовий підетап до завершення.
     */
    public ValidationResult validateCanProceedToNext(Map<String, Object> itemData) {
        log.debug("Валідація готовності підетапу 2.1 до завершення");

        // Використовуємо основну валідацію
        ValidationResult basicValidation = validate(itemData);

        if (!basicValidation.isValid()) {
            log.debug("Підетап 2.1 не готовий до завершення: {}", basicValidation.getErrors());
            return basicValidation;
        }

        log.debug("Підетап 2.1 готовий до завершення");

        return ValidationResult.builder()
            .valid(true)
            .errors(new ArrayList<>())
            .build();
    }

    /**
     * Результат валідації.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ValidationResult {
        private boolean valid;
        private List<String> errors;

        /**
         * Отримує перше повідомлення про помилку або null.
         */
        public String getFirstError() {
            return errors != null && !errors.isEmpty() ? errors.get(0) : null;
        }

        /**
         * Отримує всі помилки як один рядок, розділений комами.
         */
        public String getErrorsAsString() {
            return errors != null ? String.join(", ", errors) : "";
        }

        /**
         * Отримує повідомлення про помилку (перша помилка або загальне повідомлення).
         */
        public String getErrorMessage() {
            return getFirstError();
        }
    }
}
