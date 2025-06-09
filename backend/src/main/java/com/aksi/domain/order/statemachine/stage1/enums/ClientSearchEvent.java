package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Події пошуку клієнта в етапі 1.1.
 */
public enum ClientSearchEvent {

    /**
     * Початок пошуку клієнта.
     */
    START_SEARCH,

    /**
     * Введено критерії пошуку.
     */
    SEARCH_CRITERIA_ENTERED,

    /**
     * Виконати пошук.
     */
    EXECUTE_SEARCH,

    /**
     * Обрати клієнта зі списку.
     */
    SELECT_CLIENT,

    /**
     * Перейти до створення нового клієнта.
     */
    SWITCH_TO_CREATE_NEW,

    /**
     * Завершити вибір клієнта.
     */
    COMPLETE_CLIENT_SELECTION,

    /**
     * Очистити результати пошуку.
     */
    CLEAR_SEARCH
}
