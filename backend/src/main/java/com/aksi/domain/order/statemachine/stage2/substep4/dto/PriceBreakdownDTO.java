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
 * DTO для детальної розбивки розрахунку ціни.
 * Містить покрокову деталізацію впливу кожного модифікатора на ціну.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class PriceBreakdownDTO {

    // ===== БАЗОВІ ЦІНИ =====

    /**
     * Базова ціна за одиницю з прайс-листа
     */
    private BigDecimal baseUnitPrice;

    /**
     * Кількість предметів
     */
    private Integer quantity;

    /**
     * Загальна базова ціна (baseUnitPrice * quantity)
     */
    private BigDecimal baseTotalPrice;

    // ===== ДЕТАЛЬНИЙ ВПЛИВ МОДИФІКАТОРІВ =====

    /**
     * Список впливу кожного модифікатора на ціну
     */
    @Builder.Default
    private List<ModifierImpactDTO> modifierImpacts = new ArrayList<>();

    /**
     * Проміжна сума після застосування модифікаторів
     */
    private BigDecimal subtotalAfterModifiers;

    // ===== ТЕРМІНОВІСТЬ =====

    /**
     * Чи застосовується надбавка за терміновість
     */
    @Builder.Default
    private Boolean hasExpediteCharge = false;

    /**
     * Коефіцієнт терміновості (50%, 100%)
     */
    private BigDecimal expediteFactor;

    /**
     * Сума надбавки за терміновість
     */
    private BigDecimal expediteAmount;

    /**
     * Проміжна сума після застосування терміновості
     */
    private BigDecimal subtotalAfterExpedite;

    // ===== ЗНИЖКИ =====

    /**
     * Чи застосовується знижка
     */
    @Builder.Default
    private Boolean hasDiscount = false;

    /**
     * Відсоток знижки
     */
    private BigDecimal discountPercent;

    /**
     * Сума знижки
     */
    private BigDecimal discountAmount;

    /**
     * Проміжна сума після застосування знижки
     */
    private BigDecimal subtotalAfterDiscount;

    // ===== КІНЦЕВИЙ РЕЗУЛЬТАТ =====

    /**
     * Кінцева загальна ціна
     */
    private BigDecimal finalTotalPrice;

    /**
     * Кінцева ціна за одиницю
     */
    private BigDecimal finalUnitPrice;

    // ===== ДЕТАЛІЗАЦІЯ ДЛЯ ВІДОБРАЖЕННЯ =====

    /**
     * Покрокові описи розрахунку
     */
    @Builder.Default
    private List<String> calculationSteps = new ArrayList<>();

    /**
     * Зведення розрахунку одним рядком
     */
    private String summaryText;

    // ===== МЕТОДИ БІЗНЕС-ЛОГІКИ =====

    /**
     * Чи є модифікатори
     */
    public Boolean hasModifiers() {
        return modifierImpacts != null && !modifierImpacts.isEmpty();
    }

    /**
     * Кількість застосованих модифікаторів
     */
    public Integer getModifiersCount() {
        return modifierImpacts != null ? modifierImpacts.size() : 0;
    }

    /**
     * Загальна сума впливу модифікаторів
     */
    public BigDecimal getTotalModifiersImpact() {
        if (modifierImpacts == null) return BigDecimal.ZERO;

        return modifierImpacts.stream()
                .map(ModifierImpactDTO::getImpactAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Загальна сума відсоткових модифікаторів
     */
    public BigDecimal getTotalPercentageImpact() {
        if (modifierImpacts == null) return BigDecimal.ZERO;

        return modifierImpacts.stream()
                .filter(impact -> impact.getModifierType() != null &&
                        "PERCENTAGE".equals(impact.getModifierType().name()))
                .map(ModifierImpactDTO::getImpactAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Загальна сума фіксованих модифікаторів
     */
    public BigDecimal getTotalFixedImpact() {
        if (modifierImpacts == null) return BigDecimal.ZERO;

        return modifierImpacts.stream()
                .filter(impact -> impact.getModifierType() != null &&
                        "FIXED".equals(impact.getModifierType().name()))
                .map(ModifierImpactDTO::getImpactAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Загальна економія/переплата від базової ціни
     */
    public BigDecimal getTotalVariation() {
        if (finalTotalPrice == null || baseTotalPrice == null) {
            return BigDecimal.ZERO;
        }
        return finalTotalPrice.subtract(baseTotalPrice);
    }

    /**
     * Відсоток зміни від базової ціни
     */
    public BigDecimal getVariationPercentage() {
        if (baseTotalPrice == null || baseTotalPrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal variation = getTotalVariation();
        return variation.divide(baseTotalPrice, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    /**
     * Формування покрокових описів розрахунку
     */
    public List<String> generateCalculationSteps() {
        List<String> steps = new ArrayList<>();

        // Крок 1: Базова ціна
        steps.add(String.format("1. Базова ціна: %s × %d = %s",
                baseUnitPrice, quantity, baseTotalPrice));

        // Крок 2: Модифікатори
        if (hasModifiers()) {
            steps.add("2. Модифікатори:");
            for (ModifierImpactDTO impact : modifierImpacts) {
                steps.add(String.format("   • %s: %s",
                        impact.getModifierName(), impact.getDisplayText()));
            }
            steps.add(String.format("   Проміжна сума: %s", subtotalAfterModifiers));
        }

        // Крок 3: Терміновість
        if (hasExpediteCharge) {
            steps.add(String.format("3. Надбавка за терміновість (+%s%%): +%s",
                    expediteFactor, expediteAmount));
            steps.add(String.format("   Проміжна сума: %s", subtotalAfterExpedite));
        }

        // Крок 4: Знижка
        if (hasDiscount) {
            steps.add(String.format("4. Знижка (-%s%%): -%s",
                    discountPercent, discountAmount));
            steps.add(String.format("   Проміжна сума: %s", subtotalAfterDiscount));
        }

        // Крок 5: Кінцевий результат
        steps.add(String.format("ПІДСУМОК: %s грн (%s грн за одиницю)",
                finalTotalPrice, finalUnitPrice));

        return steps;
    }

    /**
     * Формування зведення розрахунку
     */
    public String generateSummaryText() {
        StringBuilder summary = new StringBuilder();

        summary.append(String.format("Базова ціна: %s", baseTotalPrice));

        if (hasModifiers()) {
            BigDecimal modifiersTotal = getTotalModifiersImpact();
            if (modifiersTotal.compareTo(BigDecimal.ZERO) > 0) {
                summary.append(String.format(" + модифікатори: %s", modifiersTotal));
            } else if (modifiersTotal.compareTo(BigDecimal.ZERO) < 0) {
                summary.append(String.format(" - модифікатори: %s", modifiersTotal.abs()));
            }
        }

        if (hasExpediteCharge) {
            summary.append(String.format(" + терміновість: %s", expediteAmount));
        }

        if (hasDiscount) {
            summary.append(String.format(" - знижка: %s", discountAmount));
        }

        summary.append(String.format(" = %s грн", finalTotalPrice));

        return summary.toString();
    }

    /**
     * Отримати список імен застосованих модифікаторів
     */
    public List<String> getAppliedModifierNames() {
        if (modifierImpacts == null) return new ArrayList<>();

        return modifierImpacts.stream()
                .map(ModifierImpactDTO::getModifierName)
                .collect(Collectors.toList());
    }

    /**
     * Перевірити чи є розрахунок валідним
     */
    public Boolean isValid() {
        return baseUnitPrice != null &&
               quantity != null && quantity > 0 &&
               baseTotalPrice != null &&
               finalTotalPrice != null &&
               finalUnitPrice != null;
    }

    /**
     * Чи є значна різниця від базової ціни (понад 50%)
     */
    public Boolean hasSignificantPriceChange() {
        BigDecimal variationPercent = getVariationPercentage().abs();
        return variationPercent.compareTo(BigDecimal.valueOf(50)) > 0;
    }

    /**
     * Отримати найбільший модифікатор за впливом
     */
    public ModifierImpactDTO getLargestModifierImpact() {
        if (modifierImpacts == null || modifierImpacts.isEmpty()) {
            return null;
        }

        return modifierImpacts.stream()
                .max((impact1, impact2) ->
                        impact1.getImpactAmount().abs().compareTo(
                                impact2.getImpactAmount().abs()))
                .orElse(null);
    }

    /**
     * Чи є негативні модифікатори (знижки в модифікаторах)
     */
    public Boolean hasNegativeModifiers() {
        if (modifierImpacts == null) return false;

        return modifierImpacts.stream()
                .anyMatch(impact -> impact.getImpactAmount().compareTo(BigDecimal.ZERO) < 0);
    }
}
