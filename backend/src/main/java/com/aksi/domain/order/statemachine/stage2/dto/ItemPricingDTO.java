package com.aksi.domain.order.statemachine.stage2.dto;

import java.math.BigDecimal;
import java.util.List;

import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 2.4 "Знижки та надбавки (калькулятор ціни)".
 *
 * Містить дані для розрахунку фінальної ціни предмета з урахуванням:
 * - Базової ціни з прайс-листа
 * - Модифікаторів (загальних, для текстилю, для шкіри)
 * - Терміновості
 * - Знижок
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ItemPricingDTO {

    // === Базова інформація з попередніх кроків ===
    private String categoryCode;              // Код категорії
    private String itemName;                  // Найменування предмета
    private String color;                     // Колір
    private String material;                  // Матеріал
    private Integer quantity;                 // Кількість
    private String unitOfMeasure;             // Одиниця виміру
    private List<String> stains;              // Плями (для рекомендацій)
    private List<String> defects;             // Дефекти (для рекомендацій)

    // === Базова ціна ===
    private BigDecimal baseUnitPrice;         // Базова ціна за одиницю
    private BigDecimal baseTotalPrice;        // Базова сума за кількість

    // === Доступні модифікатори ===
    private List<PriceModifierDTO> availableModifiers;     // Всі доступні модифікатори
    private List<PriceModifierDTO> generalModifiers;       // Загальні модифікатори
    private List<PriceModifierDTO> textileModifiers;       // Модифікатори для текстилю
    private List<PriceModifierDTO> leatherModifiers;       // Модифікатори для шкіри
    private List<PriceModifierDTO> recommendedModifiers;   // Рекомендовані модифікатори

    // === Вибрані модифікатори ===
    private List<String> selectedModifierCodes;           // Коди вибраних модифікаторів
    private List<RangeModifierValue> rangeModifierValues; // Значення діапазонних модифікаторів
    private List<FixedModifierQuantity> fixedModifierQuantities; // Кількості фіксованих модифікаторів

    // === Терміновість ===
    private Boolean isExpedited;              // Чи термінове виконання
    private BigDecimal expediteFactor;        // Коефіцієнт терміновості (50% або 100%)
    private String expediteType;              // Тип терміновості ("48hours", "24hours")

    // === Знижки ===
    private Boolean hasDiscount;              // Чи є знижка
    private BigDecimal discountPercent;       // Відсоток знижки
    private String discountType;              // Тип знижки (еверкард, соцмережі, ЗСУ)
    private String discountReason;            // Причина знижки
    private Boolean discountApplicable;       // Чи застосовується знижка до цієї категорії

    // === Результат розрахунку ===
    private BigDecimal finalUnitPrice;        // Фінальна ціна за одиницю
    private BigDecimal finalTotalPrice;       // Фінальна загальна ціна
    private List<CalculationDetailsDTO> calculationDetails; // Деталізація розрахунку

    // === Стан UI ===
    private Boolean isLoading;                // Чи завантажуються дані
    private Boolean hasErrors;                // Чи є помилки
    private String errorMessage;              // Повідомлення про помилку
    private Boolean priceCalculated;          // Чи розрахована ціна
    private Boolean showCalculationDetails;   // Чи показувати деталізацію

    // === Налаштування відображення ===
    private Boolean showTextileModifiers;     // Чи показувати модифікатори для текстилю
    private Boolean showLeatherModifiers;     // Чи показувати модифікатори для шкіри
    private Boolean canApplyDiscount;         // Чи можна застосувати знижку
    private Boolean showExpediteOptions;      // Чи показувати опції терміновості

    /**
     * Внутрішній клас для значення діапазонного модифікатора.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RangeModifierValue {
        private String modifierCode;          // Код модифікатора
        private BigDecimal value;             // Значення в діапазоні
        private BigDecimal minValue;          // Мінімальне значення
        private BigDecimal maxValue;          // Максимальне значення
    }

    /**
     * Внутрішній клас для кількості фіксованого модифікатора.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FixedModifierQuantity {
        private String modifierCode;          // Код модифікатора
        private Integer quantity;             // Кількість
        private BigDecimal unitPrice;         // Ціна за одиницю
    }

    /**
     * Перевіряє, чи заповнені всі обов'язкові поля для розрахунку.
     */
    public boolean isValid() {
        return categoryCode != null && !categoryCode.trim().isEmpty() &&
               itemName != null && !itemName.trim().isEmpty() &&
               quantity != null && quantity > 0 &&
               baseUnitPrice != null && baseUnitPrice.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє, чи готові дані для розрахунку ціни.
     */
    public boolean isReadyForCalculation() {
        return isValid() && selectedModifierCodes != null;
    }

    /**
     * Перевіряє, чи розрахована фінальна ціна.
     */
    public boolean isPriceCalculated() {
        return priceCalculated != null && priceCalculated &&
               finalUnitPrice != null && finalTotalPrice != null;
    }

    /**
     * Перевіряє, чи вибрані модифікатори.
     */
    public boolean hasSelectedModifiers() {
        return selectedModifierCodes != null && !selectedModifierCodes.isEmpty();
    }

    /**
     * Перевіряє, чи є рекомендовані модифікатори.
     */
    public boolean hasRecommendedModifiers() {
        return recommendedModifiers != null && !recommendedModifiers.isEmpty();
    }

    /**
     * Перевіряє, чи застосована терміновість.
     */
    public boolean isExpeditedOrder() {
        return isExpedited != null && isExpedited &&
               expediteFactor != null && expediteFactor.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє, чи застосована знижка.
     */
    public boolean hasAppliedDiscount() {
        return hasDiscount != null && hasDiscount &&
               discountPercent != null && discountPercent.compareTo(BigDecimal.ZERO) > 0 &&
               discountApplicable != null && discountApplicable;
    }

    /**
     * Отримує відсоток економії від базової ціни.
     */
    public BigDecimal getSavingsPercent() {
        if (baseTotalPrice == null || finalTotalPrice == null ||
            baseTotalPrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        if (finalTotalPrice.compareTo(baseTotalPrice) >= 0) {
            return BigDecimal.ZERO; // Немає економії
        }

        BigDecimal savings = baseTotalPrice.subtract(finalTotalPrice);
        return savings.divide(baseTotalPrice, 4, java.math.RoundingMode.HALF_UP)
                     .multiply(BigDecimal.valueOf(100));
    }

    /**
     * Отримує відсоток надбавки від базової ціни.
     */
    public BigDecimal getSurchargePercent() {
        if (baseTotalPrice == null || finalTotalPrice == null ||
            baseTotalPrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        if (finalTotalPrice.compareTo(baseTotalPrice) <= 0) {
            return BigDecimal.ZERO; // Немає надбавки
        }

        BigDecimal surcharge = finalTotalPrice.subtract(baseTotalPrice);
        return surcharge.divide(baseTotalPrice, 4, java.math.RoundingMode.HALF_UP)
                       .multiply(BigDecimal.valueOf(100));
    }

    /**
     * Скидає розрахунок ціни для перерахунку.
     */
    public void resetCalculation() {
        this.finalUnitPrice = null;
        this.finalTotalPrice = null;
        this.calculationDetails = null;
        this.priceCalculated = false;
        this.hasErrors = false;
        this.errorMessage = null;
    }

    /**
     * Встановлює помилку.
     */
    public void setError(String message) {
        this.hasErrors = true;
        this.errorMessage = message;
        this.priceCalculated = false;
    }

    /**
     * Очищує помилки.
     */
    public void clearErrors() {
        this.hasErrors = false;
        this.errorMessage = null;
    }

    /**
     * Створює підсумок розрахунку ціни для відображення.
     */
    public String getPricingSummary() {
        if (!isPriceCalculated()) {
            return "Ціна не розрахована";
        }

        StringBuilder summary = new StringBuilder();
        summary.append("Базова ціна: ").append(baseUnitPrice).append(" грн");

        if (hasSelectedModifiers()) {
            summary.append(", Модифікатори: ").append(selectedModifierCodes.size());
        }

        if (isExpeditedOrder()) {
            summary.append(", Терміново: +").append(expediteFactor).append("%");
        }

        if (hasAppliedDiscount()) {
            summary.append(", Знижка: -").append(discountPercent).append("%");
        }

        summary.append(" → ").append(finalTotalPrice).append(" грн");

        return summary.toString();
    }

    /**
     * Отримує відсоток прогресу заповнення підетапу (0-100).
     */
    public int getCompletionPercentage() {
        int completed = 0;
        int total = 4; // Базова ціна, модифікатори, терміновість, знижки

        if (baseUnitPrice != null && baseUnitPrice.compareTo(BigDecimal.ZERO) > 0) {
            completed++;
        }

        if (selectedModifierCodes != null) {
            completed++; // Навіть порожній список означає вибір
        }

        if (isExpedited != null) {
            completed++; // Навіть false означає вибір
        }

        if (hasDiscount != null) {
            completed++; // Навіть false означає вибір
        }

        return (completed * 100) / total;
    }
}
