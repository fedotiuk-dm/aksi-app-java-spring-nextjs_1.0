package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Події пошуку клієнта для Stage 1.1.
 */
public enum ClientSearchEvent {

    /**
     * Початок пошуку клієнта.
     */
    START_SEARCH,

    /**
     * Пошук за телефоном.
     */
    SEARCH_BY_PHONE,

    /**
     * Пошук за іменем.
     */
    SEARCH_BY_NAME,

    /**
     * Загальний пошук.
     */
    GENERAL_SEARCH,

    /**
     * Результати пошуку знайдені.
     */
    RESULTS_FOUND,

    /**
     * Результати пошуку порожні.
     */
    NO_RESULTS_FOUND,

    /**
     * Клієнт вибраний.
     */
    CLIENT_SELECTED,

    /**
     * Помилка під час пошуку.
     */
    SEARCH_ERROR,

    /**
     * Скасування пошуку.
     */
    CANCEL_SEARCH,

    /**
     * Повернення до пошуку.
     */
    BACK_TO_SEARCH
}
