package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Стани пошуку клієнта для Stage 1.1.
 */
public enum ClientSearchState {
    /**
     * Початковий стан - готовність до пошуку.
     */
    INIT,

    /**
     * Готовність до пошуку.
     */
    READY_TO_SEARCH,

    /**
     * Виконується пошук клієнтів.
     */
    SEARCHING,

    /**
     * Результати пошуку отримані.
     */
    RESULTS_FOUND,

    /**
     * Результати пошуку відображені.
     */
    RESULTS_DISPLAYED,

    /**
     * Результати пошуку порожні.
     */
    NO_RESULTS,

    /**
     * Клієнт вибраний зі списку.
     */
    CLIENT_SELECTED,

    /**
     * Режим створення нового клієнта.
     */
    CREATE_NEW_CLIENT_MODE,

    /**
     * Пошук завершено успішно.
     */
    COMPLETED,

    /**
     * Помилка під час пошуку.
     */
    SEARCH_ERROR,

    /**
     * Пошук скасований.
     */
    CANCELLED
}
