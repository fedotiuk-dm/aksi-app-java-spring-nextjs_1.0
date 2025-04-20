package com.aksi.domain.order.entity;

/**
 * Enum representing the types of defects that can be documented on a clothing item.
 */
public enum DefectType {
    /**
     * Worn areas on the item.
     */
    WORN,
    
    /**
     * Torn areas on the item.
     */
    TORN,
    
    /**
     * Missing parts or accessories.
     */
    MISSING_ACCESSORIES,
    
    /**
     * Damaged accessories.
     */
    DAMAGED_ACCESSORIES,
    
    /**
     * Risk of color change during cleaning.
     */
    COLOR_CHANGE_RISK,
    
    /**
     * Risk of deformation during cleaning.
     */
    DEFORMATION_RISK,
    
    /**
     * Other types of defects not categorized above.
     */
    OTHER
}
