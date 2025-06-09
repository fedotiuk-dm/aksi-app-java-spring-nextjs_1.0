package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Типи генерації номера квитанції.
 */
public enum ReceiptNumberGenerationType {

    /**
     * Автоматична генерація системою.
     */
    AUTOMATIC,

    /**
     * Ручне введення оператором.
     */
    MANUAL,

    /**
     * На основі коду філії та послідовності.
     */
    BRANCH_BASED,

    /**
     * Імпорт з зовнішньої системи.
     */
    IMPORTED
}
