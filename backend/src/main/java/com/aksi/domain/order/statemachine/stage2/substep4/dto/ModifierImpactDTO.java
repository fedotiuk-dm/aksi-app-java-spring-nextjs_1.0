package com.aksi.domain.order.statemachine.stage2.substep4.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для деталізації впливу конкретного модифікатора на ціну.
 * Містить всю інформацію про те, як саме модифікатор вплинув на розрахунок.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ModifierImpactDTO {

    // ===== ІДЕНТИФІКАЦІЯ МОДИФІКАТОРА =====

    /**
     * ID модифікатора
     */
    private UUID modifierId;

    /**
     * Код модифікатора
     */
    private String modifierCode;

    /**
     * Назва модифікатора
     */
    private String modifierName;

    /**
     * Тип модифікатора
     */
    private ModifierType modifierType;

    // ===== ВХІДНІ ДАНІ =====

    /**
     * Базова сума до застосування модифікатора
     */
    private BigDecimal baseAmount;

    /**
     * Значення модифікатора (відсоток або фіксована сума)
     */
    private BigDecimal modifierValue;

    /**
     * Кількість (для фіксованих модифікаторів)
     */
    private Integer quantity;

    // ===== РОЗРАХУНКИ =====

    /**
     * Сума впливу модифікатора на ціну (може бути від'ємною)
     */
    private BigDecimal impactAmount;

    /**
     * Результуюча сума після застосування модифікатора
     */
    private BigDecimal resultAmount;

    /**
     * Відсоток впливу від базової суми
     */
    private BigDecimal impactPercentage;

    // ===== ВІДОБРАЖЕННЯ =====

    /**
     * Текст для відображення в UI
     */
    private String displayText;

    /**
     * Формула розрахунку для відображення
     */
    private String calculationFormula;

    /**
     * Опис впливу
     */
    private String impactDescription;

    // ===== МЕТОДИ БІЗНЕС-ЛОГІКИ =====

    /**
     * Чи є вплив позитивним (збільшує ціну)
     */
    public Boolean isPositiveImpact() {
        return impactAmount != null && impactAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Чи є вплив негативним (зменшує ціну)
     */
    public Boolean isNegativeImpact() {
        return impactAmount != null && impactAmount.compareTo(BigDecimal.ZERO) < 0;
    }

    /**
     * Чи є модифікатор відсотковим
     */
    public Boolean isPercentageModifier() {
        return ModifierType.PERCENTAGE.equals(modifierType) ||
               ModifierType.RANGE_PERCENTAGE.equals(modifierType);
    }

    /**
     * Чи є модифікатор фіксованим
     */
    public Boolean isFixedModifier() {
        return ModifierType.FIXED.equals(modifierType) ||
               ModifierType.ADDITION.equals(modifierType);
    }

    /**
     * Отримати ефективну кількість
     */
    public Integer getEffectiveQuantity() {
        return quantity != null ? quantity : 1;
    }

    /**
     * Формування тексту для відображення
     */
    public String generateDisplayText() {
        if (displayText != null) return displayText;

        StringBuilder text = new StringBuilder();
        text.append(modifierName);

        if (isPositiveImpact()) {
            text.append(": +").append(impactAmount).append(" грн");
        } else if (isNegativeImpact()) {
            text.append(": -").append(impactAmount.abs()).append(" грн");
        } else {
            text.append(": 0 грн");
        }

        if (isPercentageModifier()) {
            text.append(" (").append(modifierValue).append("%)");
        } else if (isFixedModifier() && getEffectiveQuantity() > 1) {
            text.append(" (").append(modifierValue).append(" × ").append(getEffectiveQuantity()).append(")");
        }

        return text.toString();
    }

    /**
     * Формування формули розрахунку
     */
    public String generateCalculationFormula() {
        if (calculationFormula != null) return calculationFormula;

        StringBuilder formula = new StringBuilder();

        if (isPercentageModifier()) {
            formula.append(baseAmount).append(" × ").append(modifierValue).append("% = ");
            if (isPositiveImpact()) {
                formula.append("+").append(impactAmount);
            } else {
                formula.append(impactAmount);
            }
        } else if (isFixedModifier()) {
            if (getEffectiveQuantity() > 1) {
                formula.append(modifierValue).append(" × ").append(getEffectiveQuantity()).append(" = ");
            }
            if (isPositiveImpact()) {
                formula.append("+").append(impactAmount);
            } else {
                formula.append(impactAmount);
            }
        }

        return formula.toString();
    }

    /**
     * Формування опису впливу
     */
    public String generateImpactDescription() {
        if (impactDescription != null) return impactDescription;

        StringBuilder description = new StringBuilder();

        if (isPositiveImpact()) {
            description.append("Збільшує вартість на ");
        } else if (isNegativeImpact()) {
            description.append("Зменшує вартість на ");
        } else {
            return "Не впливає на вартість";
        }

        description.append(impactAmount.abs()).append(" грн");

        if (impactPercentage != null) {
            description.append(" (").append(impactPercentage.abs()).append("% від базової суми)");
        }

        return description.toString();
    }

    /**
     * Чи є вплив значним (понад 10% від базової суми)
     */
    public Boolean isSignificantImpact() {
        if (baseAmount == null || baseAmount.compareTo(BigDecimal.ZERO) == 0) {
            return false;
        }

        BigDecimal impactPercent = impactAmount.abs()
                .divide(baseAmount, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        return impactPercent.compareTo(BigDecimal.valueOf(10)) > 0;
    }

    /**
     * Обчислити відсоток впливу від базової суми
     */
    public BigDecimal calculateImpactPercentage() {
        if (baseAmount == null || baseAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return impactAmount.divide(baseAmount, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    /**
     * Отримати коротке відображення впливу
     */
    public String getShortDisplayText() {
        if (isPositiveImpact()) {
            return "+" + impactAmount + " грн";
        } else if (isNegativeImpact()) {
            return "-" + impactAmount.abs() + " грн";
        } else {
            return "±0 грн";
        }
    }

    /**
     * Отримати CSS клас для стилізації на основі типу впливу
     */
    public String getCssClass() {
        StringBuilder css = new StringBuilder("modifier-impact");

        if (isPositiveImpact()) {
            css.append(" positive");
        } else if (isNegativeImpact()) {
            css.append(" negative");
        } else {
            css.append(" neutral");
        }

        if (isSignificantImpact()) {
            css.append(" significant");
        }

        css.append(" ").append(modifierType.name().toLowerCase());

        return css.toString();
    }

    /**
     * Валідація коректності даних
     */
    public Boolean isValid() {
        return modifierCode != null && !modifierCode.trim().isEmpty() &&
               modifierName != null && !modifierName.trim().isEmpty() &&
               modifierType != null &&
               baseAmount != null &&
               modifierValue != null &&
               impactAmount != null &&
               resultAmount != null;
    }

    /**
     * Чи потрібна додаткова інформація для розрахунку
     */
    public Boolean needsAdditionalInfo() {
        return (isFixedModifier() && quantity == null) ||
               (baseAmount == null) ||
               (modifierValue == null);
    }
}
