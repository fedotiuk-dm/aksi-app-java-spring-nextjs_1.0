package com.aksi.domain.pricing.valueobject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

import lombok.Value;

/**
 * Value Object для відсотка знижки.
 * Доменно-специфічний тип з валідацією та бізнес-правилами для знижок.
 */
@Value
public class DiscountPercentage {

    private static final int DEFAULT_SCALE = 2;
    private static final RoundingMode DEFAULT_ROUNDING = RoundingMode.HALF_UP;
    private static final BigDecimal MIN_DISCOUNT = BigDecimal.ZERO;
    private static final BigDecimal MAX_DISCOUNT = BigDecimal.valueOf(50); // максимум 50% знижки

    BigDecimal value;

    private DiscountPercentage(BigDecimal value) {
        validateDiscountRange(value);
        this.value = value.setScale(DEFAULT_SCALE, DEFAULT_ROUNDING);
    }

    /**
     * Створити знижку з BigDecimal.
     */
    public static DiscountPercentage of(BigDecimal value) {
        return new DiscountPercentage(value);
    }

    /**
     * Створити знижку з double.
     */
    public static DiscountPercentage of(double value) {
        return new DiscountPercentage(BigDecimal.valueOf(value));
    }

    /**
     * Створити нульову знижку.
     */
    public static DiscountPercentage none() {
        return new DiscountPercentage(BigDecimal.ZERO);
    }

    /**
     * Застосувати знижку до грошової суми.
     */
    public Money applyTo(Money amount) {
        if (isNone()) {
            return amount;
        }
        return amount.applyPercentage(this.value);
    }

    /**
     * Перевірити, чи знижка відсутня.
     */
    public boolean isNone() {
        return value.compareTo(BigDecimal.ZERO) == 0;
    }

    /**
     * Перевірити, чи знижка значна (більше 10%).
     */
    public boolean isSignificant() {
        return value.compareTo(BigDecimal.valueOf(10)) > 0;
    }

    /**
     * Валідація діапазону знижки.
     */
    private void validateDiscountRange(BigDecimal value) {
        if (value.compareTo(MIN_DISCOUNT) < 0) {
            throw new IllegalArgumentException(
                    String.format("Знижка не може бути від'ємною, отримано: %s%%", value));
        }
        if (value.compareTo(MAX_DISCOUNT) > 0) {
            throw new IllegalArgumentException(
                    String.format("Знижка не може перевищувати %s%%, отримано: %s%%",
                            MAX_DISCOUNT, value));
        }
    }

    /**
     * Отримати значення як BigDecimal.
     */
    public BigDecimal getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DiscountPercentage that = (DiscountPercentage) o;
        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return value + "% знижка";
    }
}
