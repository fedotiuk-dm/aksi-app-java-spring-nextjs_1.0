package com.aksi.domain.order.model;

/**
 * Типи термінового виконання замовлення
 */
public enum ExpediteType {
    /**
     * Звичайне (без націнки)
     */
    STANDARD,
    
    /**
     * +50% за 48 год
     */
    EXPRESS_48H,
    
    /**
     * +100% за 24 год
     */
    EXPRESS_24H
} 