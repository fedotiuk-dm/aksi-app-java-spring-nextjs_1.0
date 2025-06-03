package com.aksi.ui.wizard.step2.substeps.item_characteristics.domain;

import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор характеристик предмета.
 * Відповідає тільки за валідацію (Single Responsibility Principle).
 */
@Slf4j
public class CharacteristicsValidator {

    /**
     * Валідує всі характеристики предмета.
     */
    public ValidationResult validateCharacteristics(ItemCharacteristicsState state) {
        var errors = new ArrayList<String>();

        // Базові обов'язкові поля
        validateMaterial(state, errors);
        validateColor(state, errors);
        validateCustomColor(state, errors);
        validateFiller(state, errors);

        boolean isValid = errors.isEmpty();
        log.debug("🔍 Валідація завершена: isValid={}, помилки={}", isValid, errors.size());

        return new ValidationResult(isValid, List.copyOf(errors));
    }

    /**
     * Перевіряє чи всі обов'язкові поля заповнені.
     * Спрощена версія без складної логіки.
     */
    public boolean hasAllRequiredFields(ItemCharacteristicsState state) {
        log.debug("🔍 ВАЛІДАЦІЯ hasAllRequiredFields для предмета: {}", state.getItemName());

        // Основні обов'язкові поля
        boolean materialValid = isValidString(state.getMaterial());
        boolean colorValid = isValidString(state.getColor());

        log.debug("  ✓ Матеріал: '{}' -> valid={}", state.getMaterial(), materialValid);
        log.debug("  ✓ Колір: '{}' -> valid={}", state.getColor(), colorValid);

        // Власний колір (якщо потрібен)
        boolean customColorValid = validateCustomColorLogic(state);
        log.debug("  ✓ Власний колір: valid={}", customColorValid);

        // Наповнювач (якщо потрібен)
        boolean fillerValid = validateFillerLogic(state);
        log.debug("  ✓ Наповнювач: valid={}", fillerValid);

        boolean result = materialValid && colorValid && customColorValid && fillerValid;
        log.debug("🔍 ФІНАЛЬНИЙ РЕЗУЛЬТАТ: {}", result);

        return result;
    }

    /**
     * Валідує матеріал.
     */
    private void validateMaterial(ItemCharacteristicsState state, List<String> errors) {
        if (!isValidString(state.getMaterial())) {
            errors.add("Матеріал є обов'язковим");
        }
    }

    /**
     * Валідує колір.
     */
    private void validateColor(ItemCharacteristicsState state, List<String> errors) {
        if (!isValidString(state.getColor())) {
            errors.add("Колір є обов'язковим");
        }
    }

    /**
     * Валідує власний колір.
     */
    private void validateCustomColor(ItemCharacteristicsState state, List<String> errors) {
        if (!isCustomColor(state)) {
            return; // Власний колір не потрібен
        }

        // ВИПРАВЛЕННЯ: Використовуємо ту ж логіку що й в validateCustomColorLogic
        // Якщо колір вибрано і він не порожній, то це валідно
        String selectedColor = state.getColor();
        if (isValidString(selectedColor)) {
            log.debug("    - Колір '{}' вибрано, валідація пройшла", selectedColor);
            return; // Валідація пройшла
        }

        // Показуємо помилку тільки якщо основний колір порожній та customColor теж порожнє
        if (!isValidString(state.getCustomColor())) {
            errors.add("Необхідно вказати власний колір");
        }
    }

    /**
     * Валідує наповнювач.
     */
    private void validateFiller(ItemCharacteristicsState state, List<String> errors) {
        if (!isFillerRequired(state)) {
            return; // Наповнювач не потрібен для цієї категорії
        }

        if (!isValidString(state.getFillerType())) {
            errors.add("Тип наповнювача є обов'язковим для цієї категорії");
            return;
        }

        if ("Інше".equals(state.getFillerType()) && !isValidString(state.getCustomFillerType())) {
            errors.add("Необхідно вказати тип наповнювача");
        }
    }

    /**
     * Логіка валідації власного кольору.
     */
    private boolean validateCustomColorLogic(ItemCharacteristicsState state) {
        if (!isCustomColor(state)) {
            return true; // Власний колір не потрібен
        }

        // ВИПРАВЛЕННЯ: Якщо колір вибрано і він не порожній, то це валідно
        // навіть якщо він не в базовому списку та customColor порожнє
        String selectedColor = state.getColor();
        if (isValidString(selectedColor)) {
            log.debug("    - Колір '{}' вибрано, вважаємо валідним навіть як власний", selectedColor);
            return true;
        }

        // Перевіряємо customColor тільки якщо основний колір порожній
        return isValidString(state.getCustomColor());
    }

    /**
     * Логіка валідації наповнювача.
     */
    private boolean validateFillerLogic(ItemCharacteristicsState state) {
        if (!isFillerRequired(state)) {
            log.debug("    - Наповнювач не потрібен для категорії: {}", state.getItemCategory());
            return true; // Наповнювач не потрібен
        }

        if (!isValidString(state.getFillerType())) {
            log.debug("    - Наповнювач потрібен але не вибрано: {}", state.getFillerType());
            return false;
        }

        if ("Інше".equals(state.getFillerType())) {
            boolean customValid = isValidString(state.getCustomFillerType());
            log.debug("    - Вибрано 'Інше', власний тип: '{}' -> valid={}",
                state.getCustomFillerType(), customValid);
            return customValid;
        }

        log.debug("    - Наповнювач вибрано: {}", state.getFillerType());
        return true;
    }

    /**
     * Перевіряє чи потрібен власний колір.
     */
    private boolean isCustomColor(ItemCharacteristicsState state) {
        String color = state.getColor();
        if (color == null) {
            return false;
        }

        // ДОДАНО: детальний логінг доступних кольорів
        List<String> availableColors = state.getAvailableColors();
        log.debug("    - Доступні кольори: {}", availableColors);
        log.debug("    - Вибраний колір: '{}'", color);

        // Якщо колір не в списку доступних, то це власний колір
        boolean isCustom = !availableColors.contains(color);
        log.debug("    - Перевірка isCustomColor: '{}' -> {} (availableColors.size={})",
            color, isCustom, availableColors.size());
        return isCustom;
    }

    /**
     * Перевіряє чи потрібен наповнювач для категорії.
     */
    private boolean isFillerRequired(ItemCharacteristicsState state) {
        if (!state.isFillerSectionVisible()) {
            return false; // Секція взагалі невидима
        }

        String category = state.getItemCategory();
        if (category == null) {
            return false;
        }

        String lowerCategory = category.toLowerCase();
        boolean required = lowerCategory.contains("дублянки") || lowerCategory.contains("куртка");

        log.debug("    - Перевірка isFillerRequired для '{}': visible={}, required={}",
            category, state.isFillerSectionVisible(), required);

        return required;
    }

    /**
     * Перевіряє чи рядок валідний (не null і не порожній).
     */
    private boolean isValidString(String value) {
        return value != null && !value.trim().isEmpty();
    }

    /**
     * Результат валідації.
     */
    public record ValidationResult(boolean isValid, List<String> errors) {}
}
