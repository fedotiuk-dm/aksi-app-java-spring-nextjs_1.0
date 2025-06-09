package com.aksi.domain.order.statemachine.stage2.substep2.enums;

/**
 * Стани для підетапу 2.2 - Характеристики предмета
 */
public enum ItemCharacteristicsState {
    /**
     * Підетап не розпочато
     */
    NOT_STARTED,

    /**
     * Вибір матеріалу
     */
    SELECTING_MATERIAL,

    /**
     * Вибір кольору
     */
    SELECTING_COLOR,

    /**
     * Вибір наповнювача (якщо потрібно)
     */
    SELECTING_FILLER,

    /**
     * Вибір ступеню зносу
     */
    SELECTING_WEAR_DEGREE,

    /**
     * Валідація введених даних
     */
    VALIDATING_DATA,

    /**
     * Підетап завершено успішно
     */
    COMPLETED,

    /**
     * Помилка в процесі виконання
     */
    ERROR
}
