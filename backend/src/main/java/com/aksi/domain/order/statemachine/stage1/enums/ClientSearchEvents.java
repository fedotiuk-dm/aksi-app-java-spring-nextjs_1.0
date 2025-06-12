package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Події для пошуку клієнтів в ClientSearchAdapter.
 * Централізоване управління подіями для State Machine.
 */
public enum ClientSearchEvents {

    /**
     * Початок пошуку клієнтів.
     */
    SEARCH_CLIENTS,

    /**
     * Вибір клієнта зі списку.
     */
    SELECT_CLIENT,

    /**
     * Скидання вибору клієнта.
     */
    CLEAR_SELECTION,

    /**
     * Пошук за телефоном.
     */
    SEARCH_BY_PHONE,

    /**
     * Загальний пошук.
     */
    GENERAL_SEARCH,

    /**
     * Результати знайдені.
     */
    RESULTS_FOUND,

    /**
     * Результати не знайдені.
     */
    NO_RESULTS,

    /**
     * Помилка пошуку.
     */
    SEARCH_ERROR
}
