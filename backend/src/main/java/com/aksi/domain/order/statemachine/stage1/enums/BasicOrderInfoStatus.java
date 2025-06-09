package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Статуси базової інформації замовлення (етап 1.2).
 */
public enum BasicOrderInfoStatus {

    /**
     * Порожня - тільки створена.
     */
    EMPTY,

    /**
     * Частково заповнена.
     */
    PARTIAL,

    /**
     * Готова для валідації.
     */
    READY_FOR_VALIDATION,

    /**
     * Валідна та готова.
     */
    VALID,

    /**
     * Має помилки валідації.
     */
    INVALID
}
