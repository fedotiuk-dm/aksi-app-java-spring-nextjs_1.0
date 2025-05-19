package com.aksi.domain.order.model;

/**
 * Типи модифікаторів ціни.
 */
public enum ModifierType {
    /**
     * Відсоток від базової ціни.
     */
    PERCENTAGE,

    /**
     * Фіксована сума.
     */
    FIXED_AMOUNT,

    /**
     * Множник (коефіцієнт) для базової ціни.
     */
    MULTIPLIER
}
