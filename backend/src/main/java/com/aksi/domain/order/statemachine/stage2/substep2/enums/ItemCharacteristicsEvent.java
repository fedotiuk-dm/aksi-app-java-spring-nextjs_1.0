package com.aksi.domain.order.statemachine.stage2.substep2.enums;

/**
 * Події для підетапу 2.2 - Характеристики предмета
 */
public enum ItemCharacteristicsEvent {
    /**
     * Початок підетапу
     */
    START_SUBSTEP,

    /**
     * Матеріал вибрано
     */
    MATERIAL_SELECTED,

    /**
     * Колір вибрано
     */
    COLOR_SELECTED,

    /**
     * Наповнювач вибрано
     */
    FILLER_SELECTED,

    /**
     * Ступінь зносу вибрано
     */
    WEAR_DEGREE_SELECTED,

    /**
     * Валідувати дані
     */
    VALIDATE_DATA,

    /**
     * Дані валідні
     */
    DATA_VALID,

    /**
     * Завершити підетап
     */
    COMPLETE_SUBSTEP,

    /**
     * Повернутися до попереднього кроку
     */
    GO_BACK,

    /**
     * Скинути підетап
     */
    RESET_SUBSTEP,

    /**
     * Помилка валідації
     */
    VALIDATION_ERROR,

    /**
     * Системна помилка
     */
    SYSTEM_ERROR
}
