package com.aksi.domain.order.statemachine.stage2.enums;

/**
 * Події головного екрану менеджера предметів (Етап 2.0).
 */
public enum Stage2Event {
    /**
     * Початок етапу
     */
    START_STAGE,

    /**
     * Ініціалізація завершена успішно
     */
    INITIALIZATION_COMPLETED,

    /**
     * Запуск нового підвізарда додавання предмета
     */
    START_NEW_ITEM_WIZARD,

    /**
     * Запуск підвізарда редагування існуючого предмета
     */
    START_EDIT_ITEM_WIZARD,

    /**
     * Підвізард завершено успішно (предмет додано/оновлено)
     */
    ITEM_WIZARD_COMPLETED,

    /**
     * Видалення предмета зі списку
     */
    DELETE_ITEM,

    /**
     * Повернення до головного екрану з підвізарда
     */
    RETURN_TO_MANAGER_SCREEN,

    /**
     * Перевірка готовності до переходу на наступний етап
     */
    CHECK_READY_TO_PROCEED,

    /**
     * Готовий до переходу (мінімум один предмет додано)
     */
    READY_TO_PROCEED,

    /**
     * Перехід на наступний етап
     */
    PROCEED_TO_NEXT_STAGE,

    /**
     * Скидання етапу до початкового стану
     */
    RESET_STAGE,

    /**
     * Системна помилка
     */
    SYSTEM_ERROR
}
