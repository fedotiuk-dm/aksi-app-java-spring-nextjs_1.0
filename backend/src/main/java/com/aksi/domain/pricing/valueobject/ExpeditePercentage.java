package com.aksi.domain.pricing.valueobject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

import lombok.Value;

/**
 * Value Object для відсотка надбавки за терміновість.
 * Доменно-специфічний тип з валідацією та бізнес-правилами для термінових замовлень.
 */
@Value
public class ExpeditePercentage {

    private static final int DEFAULT_SCALE = 2;
    private static final RoundingMode DEFAULT_ROUNDING = RoundingMode.HALF_UP;
    private static final BigDecimal MIN_EXPEDITE = BigDecimal.ZERO;
    private static final BigDecimal MAX_EXPEDITE = BigDecimal.valueOf(200); // максимум 200% надбавки

    BigDecimal value;

    private ExpeditePercentage(BigDecimal value) {
        validateExpediteRange(value);
        this.value = value.setScale(DEFAULT_SCALE, DEFAULT_ROUNDING);
    }

    /**
     * Створити надбавку за терміновість з BigDecimal.
     */
    public static ExpeditePercentage of(BigDecimal value) {
        return new ExpeditePercentage(value);
    }

    /**
     * Створити надбавку за терміновість з double.
     */
    public static ExpeditePercentage of(double value) {
        return new ExpeditePercentage(BigDecimal.valueOf(value));
    }

    /**
     * Створити нульову надбавку (без терміновості).
     */
    public static ExpeditePercentage none() {
        return new ExpeditePercentage(BigDecimal.ZERO);
    }

    /**
     * Створити стандартну надбавку за терміновість (50%).
     */
    public static ExpeditePercentage standard() {
        return new ExpeditePercentage(BigDecimal.valueOf(50));
    }

    /**
     * Створити високу надбавку за терміновість (100%).
     */
    public static ExpeditePercentage high() {
        return new ExpeditePercentage(BigDecimal.valueOf(100));
    }

    /**
     * Застосувати надбавку за терміновість до грошової суми.
     */
    public Money applyTo(Money amount) {
        if (isNone()) {
            return Money.zero();
        }
        return amount.applyPercentage(this.value);
    }

    /**
     * Перевірити, чи надбавка відсутня.
     */
    public boolean isNone() {
        return value.compareTo(BigDecimal.ZERO) == 0;
    }

    /**
     * Перевірити, чи надбавка високя (більше 75%).
     */
    public boolean isHigh() {
        return value.compareTo(BigDecimal.valueOf(75)) > 0;
    }

    /**
     * Перевірити, чи надбавка стандартна (25-75%).
     */
    public boolean isStandard() {
        return value.compareTo(BigDecimal.valueOf(25)) >= 0 &&
               value.compareTo(BigDecimal.valueOf(75)) <= 0;
    }

    /**
     * Валідація діапазону надбавки за терміновість.
     */
    private void validateExpediteRange(BigDecimal value) {
        if (value.compareTo(MIN_EXPEDITE) < 0) {
            throw new IllegalArgumentException(
                    String.format("Надбавка за терміновість не може бути від'ємною, отримано: %s%%", value));
        }
        if (value.compareTo(MAX_EXPEDITE) > 0) {
            throw new IllegalArgumentException(
                    String.format("Надбавка за терміновість не може перевищувати %s%%, отримано: %s%%",
                            MAX_EXPEDITE, value));
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
        ExpeditePercentage that = (ExpeditePercentage) o;
        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return value + "% надбавка за терміновість";
    }
}
