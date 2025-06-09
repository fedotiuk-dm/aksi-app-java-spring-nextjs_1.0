package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Стани пошуку клієнта в етапі 1.1.
 */
public enum ClientSearchState {

    /**
     * Початковий стан - форма пошуку порожня.
     */
    INIT,

    /**
     * Користувач вводить критерії пошуку.
     */
    SEARCHING,

    /**
     * Показані результати пошуку.
     */
    RESULTS_DISPLAYED,

    /**
     * Клієнт обраний зі списку.
     */
    CLIENT_SELECTED,

    /**
     * Режим створення нового клієнта.
     */
    CREATE_NEW_CLIENT_MODE,

    /**
     * Пошук завершено успішно.
     */
    COMPLETED
}
