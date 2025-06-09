package com.aksi.domain.order.statemachine.stage2.substep3.enums;

/**
 * Стани підетапу 2.3 - Забруднення, дефекти та ризики
 */
public enum StainsDefectsState {
    /**
     * Початковий стан - підетап не розпочато
     */
    NOT_STARTED,

    /**
     * Вибір плям
     */
    SELECTING_STAINS,

    /**
     * Вибір дефектів та ризиків
     */
    SELECTING_DEFECTS,

    /**
     * Введення приміток щодо дефектів
     */
    ENTERING_NOTES,

    /**
     * Валідація введених даних
     */
    VALIDATING_DATA,

    /**
     * Підетап завершено успішно
     */
    COMPLETED,

    /**
     * Помилка валідації або обробки
     */
    ERROR
}
