package com.aksi.domain.order.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded клас для розрахунків замовлення
 */
@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCalculationEntity {

    @Column(name = "items_total", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal itemsTotal = BigDecimal.ZERO;

    @Column(name = "urgency_charge", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal urgencyCharge = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    /**
     * Перевіряє чи є розрахунки
     */
    public boolean hasCalculations() {
        return itemsTotal != null && itemsTotal.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Отримує суму без знижки
     */
    public BigDecimal getAmountBeforeDiscount() {
        return itemsTotal.add(urgencyCharge);
    }

    /**
     * Розраховує відсоток знижки
     */
    public BigDecimal getDiscountPercentage() {
        BigDecimal beforeDiscount = getAmountBeforeDiscount();
        if (beforeDiscount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return discountAmount.divide(beforeDiscount, 4, java.math.RoundingMode.HALF_UP);
    }
}
