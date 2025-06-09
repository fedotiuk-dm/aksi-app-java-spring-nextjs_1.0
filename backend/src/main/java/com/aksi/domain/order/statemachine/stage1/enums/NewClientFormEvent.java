package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Enum для подій форми нового клієнта.
 * Визначає всі можливі події що можуть відбутися у процесі створення клієнта.
 */
public enum NewClientFormEvent {

    /**
     * Початок заповнення форми.
     */
    START_FILLING,

    /**
     * Оновлення базової інформації.
     */
    UPDATE_BASIC_INFO,

    /**
     * Завершення заповнення базової інформації.
     */
    COMPLETE_BASIC_INFO,

    /**
     * Оновлення контактної інформації.
     */
    UPDATE_CONTACT_INFO,

    /**
     * Завершення заповнення контактної інформації.
     */
    COMPLETE_CONTACT_INFO,

    /**
     * Запуск валідації.
     */
    VALIDATE,

    /**
     * Валідація пройшла успішно.
     */
    VALIDATION_SUCCESS,

    /**
     * Валідація не пройшла.
     */
    VALIDATION_FAILED,

    /**
     * Запуск перевірки дублікатів.
     */
    CHECK_DUPLICATES,

    /**
     * Дублікати не знайдені.
     */
    NO_DUPLICATES_FOUND,

    /**
     * Знайдені дублікати.
     */
    DUPLICATES_FOUND,

    /**
     * Користувач вирішив продовжити зі знайденими дублікатами.
     */
    PROCEED_WITH_DUPLICATES,

    /**
     * Користувач вирішив відмінити через дублікати.
     */
    CANCEL_DUE_TO_DUPLICATES,

    /**
     * Запуск збереження клієнта.
     */
    SAVE_CLIENT,

    /**
     * Клієнт збережений успішно.
     */
    CLIENT_SAVED,

    /**
     * Помилка збереження клієнта.
     */
    SAVE_ERROR,

    /**
     * Скасування процесу.
     */
    CANCEL,

    /**
     * Скидання форми до початкового стану.
     */
    RESET
}
