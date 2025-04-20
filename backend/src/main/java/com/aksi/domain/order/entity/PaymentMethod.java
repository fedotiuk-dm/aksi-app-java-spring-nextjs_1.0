package com.aksi.domain.order.entity;

/**
 * Enum representing payment methods available in the dry cleaning system.
 */
public enum PaymentMethod {
    /**
     * Payment via card terminal.
     */
    TERMINAL,
    
    /**
     * Cash payment.
     */
    CASH,
    
    /**
     * Bank transfer payment.
     */
    BANK_TRANSFER
}
