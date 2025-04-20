package com.aksi.domain.order.entity;

/**
 * Enum representing the possible statuses of an order in the dry cleaning system.
 */
public enum OrderStatus {
    /**
     * The order has been created but not yet processed.
     */
    CREATED,
    
    /**
     * The order is in progress (being cleaned).
     */
    IN_PROGRESS,
    
    /**
     * The order is ready for pickup.
     */
    READY,
    
    /**
     * The order has been picked up by the client.
     */
    COMPLETED,
    
    /**
     * The order has been cancelled.
     */
    CANCELLED
}
