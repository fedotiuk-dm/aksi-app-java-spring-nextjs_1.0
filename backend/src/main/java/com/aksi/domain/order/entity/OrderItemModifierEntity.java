package com.aksi.domain.order.entity;

import java.math.BigDecimal;

import com.aksi.api.order.dto.ModifierType;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded клас для модифікаторів ціни позиції замовлення
 */
@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemModifierEntity {

    @Column(name = "modifier_name", nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "modifier_type", nullable = false)
    private ModifierType type;

    @Column(name = "modifier_value", nullable = false, precision = 10, scale = 4)
    private BigDecimal value;

    @Column(name = "calculated_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal calculatedAmount;

    @Column(name = "modifier_description", length = 200)
    private String description;

    /**
     * Розраховує суму модифікатора для базової ціни
     */
    public BigDecimal calculateModifierAmount(BigDecimal basePrice) {
        return switch (type) {
            case PERCENTAGE -> basePrice.multiply(value).divide(BigDecimal.valueOf(100));
            case FIXED_AMOUNT -> value;
        };
    }

    /**
     * Перевіряє чи це відсотковий модифікатор
     */
    public boolean isPercentage() {
        return type == ModifierType.PERCENTAGE;
    }

    /**
     * Перевіряє чи це фіксований модифікатор
     */
    public boolean isFixedAmount() {
        return type == ModifierType.FIXED_AMOUNT;
    }

    /**
     * Отримує відсоток для відображення (тільки для PERCENTAGE)
     */
    public int getPercentageValue() {
        if (type != ModifierType.PERCENTAGE) {
            return 0;
        }
        return value.intValue();
    }

    /**
     * Перевіряє чи модифікатор має позитивний вплив на ціну
     */
    public boolean isPositiveModifier() {
        return calculatedAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє чи модифікатор має негативний вплив на ціну (знижка)
     */
    public boolean isNegativeModifier() {
        return calculatedAmount.compareTo(BigDecimal.ZERO) < 0;
    }

    /**
     * Створює модифікатор для текстильних послуг
     */
    public static OrderItemModifierEntity createTextileModifier(String name, int percentage, String description) {
        BigDecimal percentageValue = BigDecimal.valueOf(percentage);
        return OrderItemModifierEntity.builder()
            .name(name)
            .type(ModifierType.PERCENTAGE)
            .value(percentageValue)
            .calculatedAmount(BigDecimal.ZERO) // Буде розраховано пізніше
            .description(description)
            .build();
    }

    /**
     * Створює модифікатор для шкіряних послуг
     */
    public static OrderItemModifierEntity createLeatherModifier(String name, int percentage, String description) {
        return createTextileModifier(name, percentage, description);
    }

    /**
     * Створює фіксований модифікатор
     */
    public static OrderItemModifierEntity createFixedModifier(String name, BigDecimal amount, String description) {
        return OrderItemModifierEntity.builder()
            .name(name)
            .type(ModifierType.FIXED_AMOUNT)
            .value(amount)
            .calculatedAmount(amount)
            .description(description)
            .build();
    }

    /**
     * Оновлює розраховану суму для базової ціни
     */
    public void updateCalculatedAmount(BigDecimal basePrice) {
        this.calculatedAmount = calculateModifierAmount(basePrice);
    }
}
