package com.aksi.domain.order.model;

/**
 * Статуси замовлення.
 */
public enum OrderStatusEnum {
    DRAFT,           // Чернетка
    NEW,             // Нове замовлення
    IN_PROGRESS,     // В обробці
    COMPLETED,       // Виконано
    DELIVERED,       // Видано клієнту
    CANCELLED        // Скасовано
}
