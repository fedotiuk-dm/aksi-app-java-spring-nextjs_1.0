package com.aksi.domain.order.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Enum representing the urgency types for order processing in the dry cleaning system.
 */
@Getter
@RequiredArgsConstructor
public enum UrgencyType {
    /**
     * Standard processing - no additional charge.
     */
    STANDARD(0, 0),
    
    /**
     * 48-hour processing - 50% additional charge.
     */
    HOURS_48(50, 48),
    
    /**
     * 24-hour processing - 100% additional charge.
     */
    HOURS_24(100, 24);
    
    /**
     * The percentage surcharge for the urgency type.
     */
    private final int percentage;
    
    /**
     * The number of hours for processing.
     */
    private final int hours;
}
