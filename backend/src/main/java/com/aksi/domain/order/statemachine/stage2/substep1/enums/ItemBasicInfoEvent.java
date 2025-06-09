package com.aksi.domain.order.statemachine.stage2.substep1.enums;

/**
 * Події підетапу 2.1 - Основна інформація про предмет
 */
public enum ItemBasicInfoEvent {
    /**
     * Початок підетапу
     */
    START_SUBSTEP,

    /**
     * Категорія послуги вибрана
     */
    SERVICE_CATEGORY_SELECTED,

    /**
     * Найменування виробу вибрано
     */
    ITEM_NAME_SELECTED,

    /**
     * Кількість введена
     */
    QUANTITY_ENTERED,

    /**
     * Запуск валідації
     */
    VALIDATE,

    /**
     * Валідація пройшла успішно
     */
    VALIDATION_SUCCESS,

    /**
     * Валідація не пройшла
     */
    VALIDATION_FAILED,

    /**
     * Завершення підетапу
     */
    COMPLETE_SUBSTEP,

    /**
     * Скидання до початкового стану
     */
    RESET
}
