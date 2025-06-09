package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Типи валідації унікальної мітки.
 */
public enum UniqueTagValidationType {

    /**
     * Мітка порожня або відсутня.
     */
    EMPTY,

    /**
     * Мітка закоротка (менше 3 символів).
     */
    TOO_SHORT,

    /**
     * Мітка містить заборонені символи.
     */
    INVALID_CHARACTERS,

    /**
     * Мітка вже існує в системі.
     */
    DUPLICATE,

    /**
     * Мітка валідна та унікальна.
     */
    VALID
}
