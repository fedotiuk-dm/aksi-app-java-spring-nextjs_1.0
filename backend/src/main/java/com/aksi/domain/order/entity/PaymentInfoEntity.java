package com.aksi.domain.order.entity;

import java.math.BigDecimal;

import com.aksi.api.order.dto.PaymentMethod;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded клас для інформації про оплату
 */
@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfoEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod; // Використовуємо API enum

    @Column(name = "paid_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    /**
     * Перевіряє чи є часткова оплата
     */
    public boolean hasPartialPayment() {
        return paidAmount != null && paidAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Розраховує суму до доплати
     */
    public BigDecimal calculateRemainingAmount(BigDecimal totalAmount) {
        if (totalAmount == null || paidAmount == null) {
            return totalAmount;
        }
        return totalAmount.subtract(paidAmount);
    }

    /**
     * Перевіряє чи повністю оплачено
     */
    public boolean isFullyPaid(BigDecimal totalAmount) {
        if (totalAmount == null || paidAmount == null) {
            return false;
        }
        return paidAmount.compareTo(totalAmount) >= 0;
    }

    /**
     * Перевіряє чи є переплата
     */
    public boolean hasOverpayment(BigDecimal totalAmount) {
        if (totalAmount == null || paidAmount == null) {
            return false;
        }
        return paidAmount.compareTo(totalAmount) > 0;
    }
}
