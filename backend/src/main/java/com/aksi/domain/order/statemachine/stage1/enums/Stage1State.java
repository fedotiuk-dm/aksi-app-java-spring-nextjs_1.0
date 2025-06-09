package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Стани Stage1 - Вибір клієнта.
 */
public enum Stage1State {

    /**
     * Початковий стан.
     */
    INIT,

    /**
     * Вибір або створення клієнта.
     */
    CLIENT_SELECTION,

    /**
     * Завершено вибір клієнта.
     */
    COMPLETED
}
