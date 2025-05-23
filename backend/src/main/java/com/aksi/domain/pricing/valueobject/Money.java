package com.aksi.domain.pricing.valueobject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;
import java.util.Objects;

import static com.aksi.domain.pricing.constants.PriceCalculationConstants.ROUNDING_MODE;
import static com.aksi.domain.pricing.constants.PricingConstants.CURRENCY_DECIMAL_PLACES;
import static com.aksi.domain.pricing.constants.PricingConstants.DEFAULT_CURRENCY_CODE;

import lombok.Value;

/**
 * Value Object для представлення грошових сум.
 * Забезпечує типобезпеку та інкапсулює логіку роботи з грошима.
 */
@Value
public class Money {

    private static final Currency DEFAULT_CURRENCY = Currency.getInstance(DEFAULT_CURRENCY_CODE);
    private static final int DEFAULT_SCALE = CURRENCY_DECIMAL_PLACES;
    private static final RoundingMode DEFAULT_ROUNDING = ROUNDING_MODE;

    BigDecimal amount;
    Currency currency;

    private Money(BigDecimal amount, Currency currency) {
        this.amount = amount.setScale(DEFAULT_SCALE, DEFAULT_ROUNDING);
        this.currency = currency;
    }

    /**
     * Створити Money з BigDecimal в гривнях.
     */
    public static Money of(BigDecimal amount) {
        return new Money(amount, DEFAULT_CURRENCY);
    }

    /**
     * Створити Money з double в гривнях.
     */
    public static Money of(double amount) {
        return new Money(BigDecimal.valueOf(amount), DEFAULT_CURRENCY);
    }

    /**
     * Створити Money з BigDecimal та валютою.
     */
    public static Money of(BigDecimal amount, Currency currency) {
        return new Money(amount, currency);
    }

    /**
     * Створити нульову суму.
     */
    public static Money zero() {
        return new Money(BigDecimal.ZERO, DEFAULT_CURRENCY);
    }

    /**
     * Додати іншу грошову суму.
     */
    public Money add(Money other) {
        validateSameCurrency(other);
        return new Money(this.amount.add(other.amount), this.currency);
    }

    /**
     * Відняти іншу грошову суму.
     */
    public Money subtract(Money other) {
        validateSameCurrency(other);
        return new Money(this.amount.subtract(other.amount), this.currency);
    }

    /**
     * Помножити на коефіцієнт.
     */
    public Money multiply(BigDecimal multiplier) {
        return new Money(this.amount.multiply(multiplier), this.currency);
    }

    /**
     * Помножити на ціле число.
     */
    public Money multiply(int multiplier) {
        return multiply(BigDecimal.valueOf(multiplier));
    }

    /**
     * Поділити на коефіцієнт.
     */
    public Money divide(BigDecimal divisor) {
        return new Money(this.amount.divide(divisor, DEFAULT_SCALE, DEFAULT_ROUNDING), this.currency);
    }

    /**
     * Застосувати відсоток.
     */
    public Money applyPercentage(BigDecimal percentage) {
        BigDecimal multiplier = percentage.divide(BigDecimal.valueOf(100), DEFAULT_SCALE, DEFAULT_ROUNDING);
        return multiply(multiplier);
    }

    /**
     * Перевірити, чи сума позитивна.
     */
    public boolean isPositive() {
        return amount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевірити, чи сума нульова.
     */
    public boolean isZero() {
        return amount.compareTo(BigDecimal.ZERO) == 0;
    }

    /**
     * Перевірити, чи сума негативна.
     */
    public boolean isNegative() {
        return amount.compareTo(BigDecimal.ZERO) < 0;
    }

    /**
     * Порівняти з іншою сумою.
     */
    public int compareTo(Money other) {
        validateSameCurrency(other);
        return this.amount.compareTo(other.amount);
    }

    /**
     * Перевірити, чи валюти однакові.
     */
    private void validateSameCurrency(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException(
                    String.format("Неможливо виконати операцію з різними валютами: %s та %s",
                            this.currency.getCurrencyCode(), other.currency.getCurrencyCode()));
        }
    }

    /**
     * Отримати суму як BigDecimal.
     */
    public BigDecimal getAmount() {
        return amount;
    }

    /**
     * Отримати валюту.
     */
    public Currency getCurrency() {
        return currency;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Money money = (Money) o;
        return Objects.equals(amount, money.amount) && Objects.equals(currency, money.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(amount, currency);
    }

    @Override
    public String toString() {
        return String.format("%s %s", amount, currency.getCurrencyCode());
    }
}
