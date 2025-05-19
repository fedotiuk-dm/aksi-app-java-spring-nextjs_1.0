package com.aksi.domain.order.model;

import java.math.BigDecimal;

import com.aksi.domain.pricing.constants.PriceCalculationConstants;

/**
 * Типи термінового виконання замовлення
 */
public enum ExpediteType {
    /**
     * Звичайне (без націнки)
     */
    STANDARD(BigDecimal.ZERO),
    
    /**
     * +50% за 48 год
     */
    EXPRESS_48H(PriceCalculationConstants.EXPEDITE_48H_PERCENTAGE),
    
    /**
     * +100% за 24 год
     */
    EXPRESS_24H(PriceCalculationConstants.EXPEDITE_24H_PERCENTAGE);
    
    private final BigDecimal surchargePercentage;
    
    ExpediteType(BigDecimal surchargePercentage) {
        this.surchargePercentage = surchargePercentage;
    }
    
    /**
     * Отримати відсоток надбавки за терміновість
     * 
     * @return відсоток надбавки
     */
    public BigDecimal getSurchargePercentage() {
        return surchargePercentage;
    }
    
    /**
     * Перевіряє, чи може бути застосована терміновість до категорії послуг
     * 
     * @param categoryCode код категорії послуг
     * @return true, якщо терміновість може бути застосована
     */
    public boolean canBeAppliedToCategory(String categoryCode) {
        if (this == STANDARD) {
            return true; // Звичайне виконання можна застосувати до будь-якої категорії
        }
        
        return !NonExpeditableCategory.isNonExpeditable(categoryCode);
    }
} 
