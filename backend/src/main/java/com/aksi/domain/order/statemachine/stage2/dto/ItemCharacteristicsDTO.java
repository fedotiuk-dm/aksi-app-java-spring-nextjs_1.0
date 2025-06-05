package com.aksi.domain.order.statemachine.stage2.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 2.2 "Характеристики предмета".
 *
 * Містить дані для налаштування характеристик предмета:
 * - Матеріал
 * - Колір
 * - Наповнювач
 * - Ступінь зносу
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ItemCharacteristicsDTO {

    // === Доступні опції ===
    private List<String> availableMaterials;   // Список доступних матеріалів для категорії
    private List<String> availableColors;      // Список базових кольорів
    private List<String> availableFillerTypes; // Список типів наповнювачів
    private List<String> availableWearDegrees; // Список ступенів зносу

    // === Вибрані значення ===
    private String selectedMaterial;           // Вибраний матеріал
    private String selectedColor;              // Вибраний колір
    private String customColor;                // Власний колір (якщо не з списку)
    private String selectedFillerType;         // Вибраний тип наповнювача
    private String customFillerType;           // Власний тип наповнювача
    private Boolean fillerCompressed;          // Чи збитий наповнювач
    private String selectedWearDegree;         // Вибраний ступінь зносу

    // === Стан UI ===
    private Boolean isLoading;                 // Чи завантажуються дані
    private Boolean hasErrors;                 // Чи є помилки
    private String errorMessage;               // Повідомлення про помилку

    // === Налаштування відображення ===
    private Boolean showFillerSection;         // Чи показувати секцію наповнювача
    private String categoryCode;               // Код категорії для фільтрації матеріалів

    /**
     * Перевіряє, чи заповнені всі обов'язкові поля.
     */
    public boolean isValid() {
        return selectedMaterial != null && !selectedMaterial.trim().isEmpty() &&
               (selectedColor != null && !selectedColor.trim().isEmpty() ||
                customColor != null && !customColor.trim().isEmpty()) &&
               selectedWearDegree != null && !selectedWearDegree.trim().isEmpty();
    }

    /**
     * Отримує фінальний колір (вибраний або власний).
     */
    public String getFinalColor() {
        if (customColor != null && !customColor.trim().isEmpty()) {
            return customColor.trim();
        }
        return selectedColor;
    }

    /**
     * Отримує фінальний тип наповнювача (вибраний або власний).
     */
    public String getFinalFillerType() {
        if (customFillerType != null && !customFillerType.trim().isEmpty()) {
            return customFillerType.trim();
        }
        return selectedFillerType;
    }

    /**
     * Перевіряє, чи потрібно показувати секцію наповнювача для даної категорії.
     */
    public boolean shouldShowFillerSection() {
        if (showFillerSection != null) {
            return showFillerSection;
        }

        // За замовчуванням показуємо для категорій, що можуть мати наповнювач
        if (categoryCode == null) {
            return false;
        }

        String lowerCode = categoryCode.toLowerCase();
        return lowerCode.contains("куртка") || lowerCode.contains("пальто") ||
               lowerCode.contains("пуховик") || lowerCode.contains("одіял") ||
               lowerCode.contains("подушк") || lowerCode.contains("матрац");
    }

    /**
     * Перевіряє, чи використовується власний колір.
     */
    public boolean isUsingCustomColor() {
        return customColor != null && !customColor.trim().isEmpty();
    }

    /**
     * Перевіряє, чи використовується власний тип наповнювача.
     */
    public boolean isUsingCustomFillerType() {
        return customFillerType != null && !customFillerType.trim().isEmpty();
    }

    /**
     * Скидає помилки.
     */
    public void clearErrors() {
        this.hasErrors = false;
        this.errorMessage = null;
    }

    /**
     * Встановлює помилку.
     */
    public void setError(String message) {
        this.hasErrors = true;
        this.errorMessage = message;
    }

    /**
     * Перевіряє, чи порожні доступні опції.
     */
    public boolean hasAvailableOptions() {
        return (availableMaterials != null && !availableMaterials.isEmpty()) ||
               (availableColors != null && !availableColors.isEmpty()) ||
               (availableWearDegrees != null && !availableWearDegrees.isEmpty());
    }

    /**
     * Отримує відсоток заповнення підетапу (0-100).
     */
    public int getCompletionPercentage() {
        int completed = 0;
        int total = 3; // Матеріал, колір, ступінь зносу

        if (selectedMaterial != null && !selectedMaterial.trim().isEmpty()) {
            completed++;
        }

        if (getFinalColor() != null && !getFinalColor().trim().isEmpty()) {
            completed++;
        }

        if (selectedWearDegree != null && !selectedWearDegree.trim().isEmpty()) {
            completed++;
        }

        return (completed * 100) / total;
    }

    /**
     * Створює підсумок характеристик для відображення.
     */
    public String getCharacteristicsSummary() {
        StringBuilder summary = new StringBuilder();

        if (selectedMaterial != null) {
            summary.append("Матеріал: ").append(selectedMaterial);
        }

        String finalColor = getFinalColor();
        if (finalColor != null) {
            if (summary.length() > 0) summary.append(", ");
            summary.append("Колір: ").append(finalColor);
        }

        if (selectedWearDegree != null) {
            if (summary.length() > 0) summary.append(", ");
            summary.append("Знос: ").append(selectedWearDegree);
        }

        String finalFillerType = getFinalFillerType();
        if (finalFillerType != null) {
            if (summary.length() > 0) summary.append(", ");
            summary.append("Наповнювач: ").append(finalFillerType);
            if (Boolean.TRUE.equals(fillerCompressed)) {
                summary.append(" (збитий)");
            }
        }

        return summary.toString();
    }
}
