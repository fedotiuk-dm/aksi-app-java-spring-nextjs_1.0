package com.aksi.ui.wizard.step2.substeps.item_characteristics.domain;

import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Domain Model для стану характеристик предмета.
 * Відповідає за бізнес-логіку характеристик та валідацію.
 */
@Data
@Builder
@Slf4j
public class ItemCharacteristicsState {

    private final String itemCategory;
    private final String itemName;

    // Характеристики
    private final String material;
    private final String color;
    private final String customColor;
    private final String fillerType;
    private final String customFillerType;
    private final Boolean fillerCompressed;
    private final String wearDegree;

    // Доступні опції
    private final List<String> availableMaterials;
    private final List<String> availableColors;
    private final List<String> availableFillerTypes;
    private final List<String> availableWearDegrees;

    // Стан валідності
    private final boolean isValid;
    private final List<String> validationErrors;

    // Правила видимості
    private final boolean fillerSectionVisible;
    private final boolean customColorVisible;
    private final boolean customFillerVisible;

    /**
     * Створює початковий стан характеристик для предмета.
     */
    public static ItemCharacteristicsState createInitial(String itemCategory, String itemName) {
        log.debug("Створюється початковий стан характеристик для {} - {}", itemCategory, itemName);

        return ItemCharacteristicsState.builder()
                .itemCategory(itemCategory)
                .itemName(itemName)
                .material(null)
                .color(null)
                .customColor(null)
                .fillerType(null)
                .customFillerType(null)
                .fillerCompressed(false)
                .wearDegree(null)
                .availableMaterials(List.of())
                .availableColors(List.of())
                .availableFillerTypes(List.of())
                .availableWearDegrees(List.of())
                .isValid(false)
                .validationErrors(List.of())
                .fillerSectionVisible(isFillerSectionRequired(itemCategory))
                .customColorVisible(false)
                .customFillerVisible(false)
                .build();
    }

    /**
     * Створює стан з оновленими характеристиками.
     */
    public ItemCharacteristicsState withCharacteristics(
            String material,
            String color,
            String customColor,
            String fillerType,
            String customFillerType,
            Boolean fillerCompressed,
            String wearDegree) {

        log.debug("Оновлюється стан характеристик: матеріал={}, колір={}, наповнювач={}",
                 material, color, fillerType);

        // Валідуємо нові характеристики
        var validationResult = validateCharacteristics(material, color, customColor,
                                                      fillerType, customFillerType, wearDegree);

        return ItemCharacteristicsState.builder()
                .itemCategory(this.itemCategory)
                .itemName(this.itemName)
                .material(material)
                .color(color)
                .customColor(customColor)
                .fillerType(fillerType)
                .customFillerType(customFillerType)
                .fillerCompressed(fillerCompressed)
                .wearDegree(wearDegree)
                .availableMaterials(this.availableMaterials)
                .availableColors(this.availableColors)
                .availableFillerTypes(this.availableFillerTypes)
                .availableWearDegrees(this.availableWearDegrees)
                .isValid(validationResult.isValid())
                .validationErrors(validationResult.errors())
                .fillerSectionVisible(this.fillerSectionVisible)
                .customColorVisible(isCustomColor(color))
                .customFillerVisible(isCustomFiller(fillerType))
                .build();
    }

    /**
     * Створює стан з оновленими доступними опціями.
     */
    public ItemCharacteristicsState withAvailableOptions(
            List<String> materials,
            List<String> colors,
            List<String> fillerTypes,
            List<String> wearDegrees) {

        log.debug("Оновлюються доступні опції: {} матеріалів, {} кольорів, {} наповнювачів",
                 materials.size(), colors.size(), fillerTypes.size());

        return ItemCharacteristicsState.builder()
                .itemCategory(this.itemCategory)
                .itemName(this.itemName)
                .material(this.material)
                .color(this.color)
                .customColor(this.customColor)
                .fillerType(this.fillerType)
                .customFillerType(this.customFillerType)
                .fillerCompressed(this.fillerCompressed)
                .wearDegree(this.wearDegree)
                .availableMaterials(List.copyOf(materials))
                .availableColors(List.copyOf(colors))
                .availableFillerTypes(List.copyOf(fillerTypes))
                .availableWearDegrees(List.copyOf(wearDegrees))
                .isValid(this.isValid)
                .validationErrors(this.validationErrors)
                .fillerSectionVisible(this.fillerSectionVisible)
                .customColorVisible(this.customColorVisible)
                .customFillerVisible(this.customFillerVisible)
                .build();
    }

    /**
     * Перевіряє чи потрібна секція наповнювача для категорії.
     */
    private static boolean isFillerSectionRequired(String category) {
        if (category == null) {
            return false;
        }

        String lowerCategory = category.toLowerCase();
        return lowerCategory.contains("дублянки") ||
               lowerCategory.contains("одяг") ||
               lowerCategory.contains("текстиль") ||
               lowerCategory.contains("куртка");
    }

    /**
     * Перевіряє чи потрібно поле для власного кольору.
     */
    private boolean isCustomColor(String color) {
        return color != null && !availableColors.contains(color);
    }

    /**
     * Перевіряє чи потрібно поле для власного наповнювача.
     */
    private boolean isCustomFiller(String fillerType) {
        return "Інше".equals(fillerType);
    }

    /**
     * Валідує характеристики предмета.
     */
    private ValidationResult validateCharacteristics(
            String material,
            String color,
            String customColor,
            String fillerType,
            String customFillerType,
            String wearDegree) {

        var errors = new java.util.ArrayList<String>();

        // Обов'язкові поля
        if (material == null || material.trim().isEmpty()) {
            errors.add("Матеріал є обов'язковим");
        }

        if (color == null || color.trim().isEmpty()) {
            errors.add("Колір є обов'язковим");
        }

        // Валідація власного кольору
        if (isCustomColor(color) && (customColor == null || customColor.trim().isEmpty())) {
            errors.add("Необхідно вказати власний колір");
        }

        // Валідація наповнювача для відповідних категорій
        if (fillerSectionVisible && isFillerRequiredForCategory()) {
            if (fillerType == null || fillerType.trim().isEmpty()) {
                errors.add("Тип наповнювача є обов'язковим для цієї категорії");
            } else if ("Інше".equals(fillerType) &&
                      (customFillerType == null || customFillerType.trim().isEmpty())) {
                errors.add("Необхідно вказати тип наповнювача");
            }
        }

        return new ValidationResult(errors.isEmpty(), List.copyOf(errors));
    }

    /**
     * Перевіряє чи наповнювач обов'язковий для категорії.
     */
    private boolean isFillerRequiredForCategory() {
        if (itemCategory == null) {
            return false;
        }

        String lowerCategory = itemCategory.toLowerCase();
        return lowerCategory.contains("дублянки") || lowerCategory.contains("куртка");
    }

    /**
     * Повертає фінальний колір (основний або власний).
     */
    public String getFinalColor() {
        return isCustomColor(color) && customColor != null ? customColor : color;
    }

    /**
     * Повертає фінальний тип наповнювача (основний або власний).
     */
    public String getFinalFillerType() {
        return isCustomFiller(fillerType) && customFillerType != null ? customFillerType : fillerType;
    }

    /**
     * Перевіряє чи є всі обов'язкові поля заповнені.
     */
    public boolean hasRequiredFields() {
        return material != null && !material.trim().isEmpty() &&
               color != null && !color.trim().isEmpty() &&
               (!isCustomColor(color) || (customColor != null && !customColor.trim().isEmpty())) &&
               (!fillerSectionVisible || !isFillerRequiredForCategory() ||
                (fillerType != null && (!isCustomFiller(fillerType) ||
                 (customFillerType != null && !customFillerType.trim().isEmpty()))));
    }

    /**
     * Результат валідації.
     */
    private record ValidationResult(boolean isValid, List<String> errors) {}
}
