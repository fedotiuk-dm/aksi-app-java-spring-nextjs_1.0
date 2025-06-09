package com.aksi.domain.order.statemachine.stage2.substep1.enums;

/**
 * Стани підетапу 2.1 - Основна інформація про предмет
 */
public enum ItemBasicInfoState {
    /**
     * Початковий стан - підетап не розпочато
     */
    NOT_STARTED,

    /**
     * Вибір категорії послуги
     */
    SELECTING_SERVICE_CATEGORY,

    /**
     * Вибір найменування виробу
     */
    SELECTING_ITEM_NAME,

    /**
     * Введення кількості та одиниці виміру
     */
    ENTERING_QUANTITY,

    /**
     * Валідація введених даних
     */
    VALIDATING,

    /**
     * Підетап завершено успішно
     */
    COMPLETED,

    /**
     * Помилка валідації
     */
    VALIDATION_ERROR
}
