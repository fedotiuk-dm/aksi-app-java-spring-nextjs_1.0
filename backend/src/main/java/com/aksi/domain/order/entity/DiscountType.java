package com.aksi.domain.order.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Enum representing available discount types in the dry cleaning system.
 */
@Getter
@RequiredArgsConstructor
public enum DiscountType {
    /**
     * No discount applied.
     */
    NONE(0),
    
    /**
     * Evercard discount - 10%.
     */
    EVERCARD(10),
    
    /**
     * Social media discount - 5%.
     */
    SOCIAL_MEDIA(5),
    
    /**
     * Military (ZSU) discount - 10%.
     */
    MILITARY(10),
    
    /**
     * Custom discount with a custom percentage.
     */
    CUSTOM(0);
    
    /**
     * The percentage of the discount.
     */
    private final int percentage;
    
    /**
     * Create a custom discount with the given percentage.
     * 
     * @param percentage The discount percentage
     * @return A CUSTOM discount type with the given percentage
     */
    public static DiscountType custom(int percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new IllegalArgumentException("Discount percentage must be between 0 and 100");
        }
        
        DiscountType customDiscount = CUSTOM;
        return customDiscount;
    }
}
