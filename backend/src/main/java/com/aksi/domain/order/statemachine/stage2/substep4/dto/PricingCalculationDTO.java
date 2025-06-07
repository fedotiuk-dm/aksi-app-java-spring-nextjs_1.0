package com.aksi.domain.order.statemachine.stage2.substep4.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для інтерактивного розрахунку ціни предмета в підетапі 2.4.
 * Містить всю інформацію для покрокового розрахунку з деталізацією.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class PricingCalculationDTO {

    // ===== БАЗОВА ІНФОРМАЦІЯ =====

    /**
     * Базова ціна за одиницю з прайс-листа
     */
    private BigDecimal baseUnitPrice;

    /**
     * Кількість предметів
     */
    private Integer quantity;

    /**
     * Одиниця виміру (шт, кг, кв.м, пара)
     */
    private String unitOfMeasure;

    /**
     * Базова сума (baseUnitPrice * quantity)
     */
    private BigDecimal baseTotal;

    // ===== МОДИФІКАТОРИ =====

    /**
     * Вибрані модифікатори (фіксовані, відсоткові, діапазонні)
     */
    @Builder.Default
    private List<ModifierSelectionDTO> selectedModifiers = new ArrayList<>();

    /**
     * Доступні модифікатори для даної категорії
     */
    @Builder.Default
    private List<ModifierSelectionDTO> availableModifiers = new ArrayList<>();

    /**
     * Рекомендовані модифікатори на основі дефектів та плям
     */
    @Builder.Default
    private List<ModifierSelectionDTO> recommendedModifiers = new ArrayList<>();

    // ===== ТЕРМІНОВІСТЬ =====

    /**
     * Чи є замовлення терміновим
     */
    @Builder.Default
    private Boolean isExpedited = false;

    /**
     * Коефіцієнт терміновості (50%, 100%)
     */
    private BigDecimal expediteFactor;

    /**
     * Сума надбавки за терміновість
     */
    private BigDecimal expediteAmount;

    // ===== ЗНИЖКИ =====

    /**
     * Відсоток знижки
     */
    private BigDecimal discountPercent;

    /**
     * Сума знижки
     */
    private BigDecimal discountAmount;

    /**
     * Чи можна застосовувати знижки до цієї категорії
     */
    @Builder.Default
    private Boolean discountApplicable = true;

    // ===== РОЗРАХУНКИ =====

    /**
     * Детальна розбивка розрахунку
     */
    private PriceBreakdownDTO priceBreakdown;

    /**
     * Кінцева ціна за одиницю
     */
    private BigDecimal finalUnitPrice;

    /**
     * Кінцева загальна ціна
     */
    private BigDecimal finalTotalPrice;

    /**
     * Покрокові деталі розрахунку для відображення
     */
    @Builder.Default
    private List<String> calculationSteps = new ArrayList<>();

    // ===== ВАЛІДАЦІЯ =====

    /**
     * Чи є розрахунок валідним
     */
    @Builder.Default
    private Boolean isValid = false;

    /**
     * Повідомлення про помилки валідації
     */
    @Builder.Default
    private List<String> validationErrors = new ArrayList<>();

    /**
     * Попередження про ризики
     */
    @Builder.Default
    private List<String> riskWarnings = new ArrayList<>();

    // ===== МЕТОДИ БІЗНЕС-ЛОГІКИ =====

    /**
     * Чи є вибрані модифікатори
     */
    public Boolean hasSelectedModifiers() {
        return selectedModifiers != null && !selectedModifiers.isEmpty() &&
               selectedModifiers.stream().anyMatch(ModifierSelectionDTO::getIsSelected);
    }

    /**
     * Кількість вибраних модифікаторів
     */
    public Integer getSelectedModifiersCount() {
        if (selectedModifiers == null) return 0;
        return (int) selectedModifiers.stream()
                .filter(ModifierSelectionDTO::getIsSelected)
                .count();
    }

    /**
     * Отримати тільки вибрані модифікатори
     */
    public List<ModifierSelectionDTO> getSelectedModifiersOnly() {
        if (selectedModifiers == null) return new ArrayList<>();
        return selectedModifiers.stream()
                .filter(ModifierSelectionDTO::getIsSelected)
                .collect(Collectors.toList());
    }

    /**
     * Чи є рекомендовані модифікатори
     */
    public Boolean hasRecommendedModifiers() {
        return recommendedModifiers != null && !recommendedModifiers.isEmpty();
    }

    /**
     * Чи застосовується знижка
     */
    public Boolean hasDiscount() {
        return discountPercent != null && discountPercent.compareTo(BigDecimal.ZERO) > 0 &&
               discountApplicable != null && discountApplicable;
    }

    /**
     * Чи застосовується надбавка за терміновість
     */
    public Boolean hasExpediteCharge() {
        return isExpedited != null && isExpedited &&
               expediteFactor != null && expediteFactor.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Загальна сума модифікаторів
     */
    public BigDecimal getTotalModifiersAmount() {
        if (priceBreakdown != null && priceBreakdown.getModifierImpacts() != null) {
            return priceBreakdown.getModifierImpacts().stream()
                    .map(ModifierImpactDTO::getImpactAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        return BigDecimal.ZERO;
    }

    /**
     * Чи є розрахунок повним та готовим
     */
    public Boolean isCalculationComplete() {
        return isValid != null && isValid &&
               finalTotalPrice != null &&
               priceBreakdown != null &&
               (validationErrors == null || validationErrors.isEmpty());
    }

    /**
     * Отримати опис всіх вибраних модифікаторів
     */
    public String getSelectedModifiersDescription() {
        List<ModifierSelectionDTO> selected = getSelectedModifiersOnly();
        if (selected.isEmpty()) return "Модифікатори не вибрані";

        return selected.stream()
                .map(mod -> mod.getName() + " (" + mod.getDisplayValue() + ")")
                .collect(Collectors.joining(", "));
    }

    /**
     * Отримати підсумок розрахунку одним рядком
     */
    public String getCalculationSummary() {
        if (!isCalculationComplete()) return "Розрахунок не завершений";

        StringBuilder summary = new StringBuilder();
        summary.append("Базова ціна: ").append(baseTotal);

        if (hasSelectedModifiers()) {
            summary.append(" + модифікатори: ").append(getTotalModifiersAmount());
        }

        if (hasExpediteCharge()) {
            summary.append(" + терміновість: ").append(expediteAmount);
        }

        if (hasDiscount()) {
            summary.append(" - знижка: ").append(discountAmount);
        }

        summary.append(" = ").append(finalTotalPrice);

        return summary.toString();
    }

    /**
     * Перевірити чи потрібні додаткові дані для завершення розрахунку
     */
    public Boolean needsAdditionalData() {
        return baseUnitPrice == null || quantity == null || quantity <= 0;
    }

    /**
     * Чи є попередження про ризики
     */
    public Boolean hasRiskWarnings() {
        return riskWarnings != null && !riskWarnings.isEmpty();
    }

    /**
     * Кількість попереджень про ризики
     */
    public Integer getRiskWarningsCount() {
        return riskWarnings != null ? riskWarnings.size() : 0;
    }
}
