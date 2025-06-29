package com.aksi.domain.order.entity;

import java.math.BigDecimal;

import com.aksi.domain.order.enums.DiscountType;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded клас для інформації про знижку
 */
@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type")
    private DiscountType type;

    @Column(name = "discount_percentage", precision = 5, scale = 4)
    private BigDecimal percentage;

    @Column(name = "discount_description", length = 200)
    private String description;

    /**
     * Розраховує суму знижки
     */
    public BigDecimal calculateDiscountAmount(BigDecimal totalAmount) {
        if (type == null || type == DiscountType.NONE) {
            return BigDecimal.ZERO;
        }
        return type.calculateDiscountAmount(totalAmount, percentage);
    }

    /**
     * Перевіряє чи застосована знижка
     */
    public boolean hasDiscount() {
        return type != null && type != DiscountType.NONE;
    }

    /**
     * Отримує відсоток для відображення
     */
    public int getDisplayPercentage() {
        if (type == null) return 0;

        BigDecimal displayPercentage = type.allowsCustomPercentage() && percentage != null
            ? percentage
            : type.getDefaultPercentage();

        return displayPercentage.multiply(BigDecimal.valueOf(100)).intValue();
    }
}
