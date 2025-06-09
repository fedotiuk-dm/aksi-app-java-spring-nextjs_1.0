package com.aksi.domain.order.statemachine.stage2.substep3.enums;

/**
 * Події підетапу 2.3 - Забруднення, дефекти та ризики
 */
public enum StainsDefectsEvent {
    /**
     * Початок підетапу
     */
    START_SUBSTEP,

    /**
     * Плями вибрані
     */
    STAINS_SELECTED,

    /**
     * Дефекти та ризики вибрані
     */
    DEFECTS_SELECTED,

    /**
     * Примітки введені
     */
    NOTES_ENTERED,

    /**
     * Запуск валідації
     */
    VALIDATE_DATA,

    /**
     * Валідація пройшла успішно
     */
    DATA_VALID,

    /**
     * Валідація не пройшла
     */
    VALIDATION_ERROR,

    /**
     * Завершення підетапу
     */
    COMPLETE_SUBSTEP,

    /**
     * Повернення до попереднього кроку
     */
    GO_BACK,

    /**
     * Скидання до початкового стану
     */
    RESET_SUBSTEP
}
