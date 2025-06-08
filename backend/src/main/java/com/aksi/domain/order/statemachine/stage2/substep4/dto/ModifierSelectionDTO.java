package com.aksi.domain.order.statemachine.stage2.substep4.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для вибору модифікаторів ціни з розширеними UI полями.
 * Розширює базову інформацію про модифікатор додатковими полями для інтерактивного вибору.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ModifierSelectionDTO {

    // ===== БАЗОВА ІНФОРМАЦІЯ МОДИФІКАТОРА =====

    /**
     * ID модифікатора
     */
    private UUID id;

    /**
     * Код модифікатора
     */
    private String code;

    /**
     * Назва модифікатора
     */
    private String name;

    /**
     * Опис модифікатора
     */
    private String description;

    /**
     * Тип модифікатора (PERCENTAGE, FIXED, RANGE)
     */
    private ModifierType modifierType;

    /**
     * Категорія модифікатора (GENERAL, TEXTILE, LEATHER)
     */
    private ModifierCategory category;

    // ===== ЗНАЧЕННЯ МОДИФІКАТОРА =====

    /**
     * Значення модифікатора (відсоток або фіксована сума)
     */
    private BigDecimal value;

    /**
     * Мінімальне значення (для діапазонних модифікаторів)
     */
    private BigDecimal minValue;

    /**
     * Максимальне значення (для діапазонних модифікаторів)
     */
    private BigDecimal maxValue;

    /**
     * Вибране значення користувачем (для діапазонних модифікаторів)
     */
    private BigDecimal selectedValue;

    /**
     * Кількість (для фіксованих модифікаторів типу "пришивання гудзиків")
     */
    private Integer quantity;

    /**
     * Розрахована сума впливу на ціну
     */
    private BigDecimal impactAmount;

    // ===== UI СТАН =====

    /**
     * Чи вибраний модифікатор користувачем
     */
    @Builder.Default
    private Boolean isSelected = false;

    /**
     * Чи є модифікатор рекомендованим
     */
    @Builder.Default
    private Boolean isRecommended = false;

    /**
     * Чи є модифікатор обов'язковим
     */
    @Builder.Default
    private Boolean isRequired = false;

    /**
     * Чи доступний модифікатор для вибору
     */
    @Builder.Default
    private Boolean isAvailable = true;

    /**
     * Порядок сортування для відображення
     */
    private Integer sortOrder;

    // ===== UI ENHANCEMENT =====

    /**
     * Текст для відображення в UI (з форматуванням)
     */
    private String displayText;

    /**
     * Значення для відображення (з одиницями)
     */
    private String displayValue;

    /**
     * Підказка для користувача
     */
    private String tooltip;

    /**
     * Попередження про ризики
     */
    private String warning;

    /**
     * CSS клас для стилізації
     */
    private String cssClass;

    /**
     * Іконка для відображення
     */
    private String icon;

    // ===== БІЗНЕС-ЛОГІКА =====

    /**
     * Чи є модифікатор відсотковим
     */
    public Boolean isPercentageType() {
        return ModifierType.PERCENTAGE.equals(modifierType);
    }

    /**
     * Чи є модифікатор фіксованим
     */
    public Boolean isFixedType() {
        return ModifierType.FIXED.equals(modifierType);
    }

    /**
     * Чи є модифікатор діапазонним
     */
    public Boolean isRangeType() {
        return ModifierType.RANGE_PERCENTAGE.equals(modifierType);
    }

    /**
     * Чи потрібно введення значення користувачем
     */
    public Boolean requiresUserInput() {
        return isRangeType() || (isFixedType() && quantity == null);
    }

    /**
     * Чи валідне вибране значення
     */
    public Boolean isSelectedValueValid() {
        if (!isSelected || !requiresUserInput()) return true;

        if (isRangeType()) {
            return selectedValue != null &&
                   (minValue == null || selectedValue.compareTo(minValue) >= 0) &&
                   (maxValue == null || selectedValue.compareTo(maxValue) <= 0);
        }

        if (isFixedType()) {
            return quantity != null && quantity > 0;
        }

        return true;
    }

    /**
     * Отримати ефективне значення модифікатора
     */
    public BigDecimal getEffectiveValue() {
        if (isRangeType() && selectedValue != null) {
            return selectedValue;
        }
        return value;
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

        StringBuilder text = new StringBuilder(name);

        if (isPercentageType()) {
            text.append(" (").append(getEffectiveValue()).append("%)");
        } else if (isFixedType()) {
            text.append(" (").append(getEffectiveValue()).append(" грн");
            if (getEffectiveQuantity() > 1) {
                text.append(" × ").append(getEffectiveQuantity());
            }
            text.append(")");
        } else if (isRangeType()) {
            text.append(" (").append(minValue).append("%-").append(maxValue).append("%)");
            if (selectedValue != null) {
                text.append(" [").append(selectedValue).append("%]");
            }
        }

        return text.toString();
    }

    /**
     * Формування значення для відображення
     */
    public String generateDisplayValue() {
        if (displayValue != null) return displayValue;

        if (isPercentageType()) {
            return "+" + getEffectiveValue() + "%";
        } else if (isFixedType()) {
            BigDecimal total = getEffectiveValue().multiply(BigDecimal.valueOf(getEffectiveQuantity()));
            return "+" + total + " грн";
        } else if (isRangeType()) {
            if (selectedValue != null) {
                return "+" + selectedValue + "%";
            }
            return minValue + "%-" + maxValue + "%";
        }

        return "";
    }

    /**
     * Отримати CSS клас на основі стану
     */
    public String getCssClass() {
        if (cssClass != null) return cssClass;

        StringBuilder css = new StringBuilder("modifier");

        if (isSelected) css.append(" selected");
        if (isRecommended) css.append(" recommended");
        if (isRequired) css.append(" required");
        if (!isAvailable) css.append(" disabled");

        css.append(" ").append(modifierType.name().toLowerCase());
        css.append(" ").append(category.name().toLowerCase());

        return css.toString();
    }

    /**
     * Отримати іконку на основі типу та категорії
     */
    public String getIcon() {
        if (icon != null) return icon;

        if (isRequired) return "⚠️";
        if (isRecommended) return "💡";

        switch (modifierType) {
            case PERCENTAGE:
                return "📊";
            case FIXED:
                return "💰";
            case RANGE_PERCENTAGE:
                return "📏";
            case ADDITION:
                return "💳";
            default:
                return "⚙️";
        }
    }

    /**
     * Чи має модифікатор попередження
     */
    public Boolean hasWarning() {
        return warning != null && !warning.trim().isEmpty();
    }

    /**
     * Чи є модифікатор загальним (для всіх категорій)
     */
    public Boolean isGeneralCategory() {
        return ModifierCategory.GENERAL.equals(category);
    }

    /**
     * Чи є модифікатор для текстильних виробів
     */
    public Boolean isTextileCategory() {
        return ModifierCategory.TEXTILE.equals(category);
    }

    /**
     * Чи є модифікатор для шкіряних виробів
     */
    public Boolean isLeatherCategory() {
        return ModifierCategory.LEATHER.equals(category);
    }
}
