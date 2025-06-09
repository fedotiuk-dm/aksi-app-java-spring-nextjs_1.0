package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Статуси форми нового клієнта (етап 1.1).
 */
public enum NewClientFormStatus {

    /**
     * Форма порожня, тільки створена.
     */
    EMPTY,

    /**
     * Заповнені основні поля (ім'я, прізвище, телефон).
     */
    BASIC_FILLED,

    /**
     * Заповнені додаткові поля (email, адреса).
     */
    DETAILED_FILLED,

    /**
     * Вибрані канали комунікації.
     */
    COMMUNICATION_SET,

    /**
     * Вказане джерело інформації.
     */
    SOURCE_SET,

    /**
     * Форма готова для валідації.
     */
    READY_FOR_VALIDATION,

    /**
     * Форма валідна та готова для створення клієнта.
     */
    VALID,

    /**
     * Форма має помилки валідації.
     */
    INVALID
}
