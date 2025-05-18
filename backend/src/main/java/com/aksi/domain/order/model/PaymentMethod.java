package com.aksi.domain.order.model;

/**
 * Способи оплати замовлення
 */
public enum PaymentMethod {
    /**
     * Оплата через термінал (картою)
     */
    TERMINAL,
    
    /**
     * Оплата готівкою
     */
    CASH,
    
    /**
     * Безготівковий розрахунок на рахунок
     */
    BANK_TRANSFER
} 