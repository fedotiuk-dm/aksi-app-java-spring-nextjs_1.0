package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Події процесу заповнення базової інформації замовлення в етапі 1.3.
 * Представляє всі можливі дії користувача та системи під час створення базової інформації.
 */
public enum BasicOrderInfoEvent {
    /**
     * Початок процесу заповнення базової інформації.
     */
    START_BASIC_INFO_PROCESS,

    /**
     * Запуск генерації номера квитанції.
     */
    GENERATE_RECEIPT_NUMBER,

    /**
     * Номер квитанції успішно згенеровано.
     */
    RECEIPT_NUMBER_GENERATED_SUCCESS,

    /**
     * Помилка при генерації номера квитанції.
     */
    RECEIPT_NUMBER_GENERATION_FAILED,

    /**
     * Введення унікальної мітки.
     */
    ENTER_UNIQUE_TAG,

    /**
     * Унікальна мітка введена та валідна.
     */
    UNIQUE_TAG_VALIDATED,

    /**
     * Унікальна мітка невалідна або дублікат.
     */
    UNIQUE_TAG_INVALID,

    /**
     * Скановано унікальну мітку (QR/штрих-код).
     */
    UNIQUE_TAG_SCANNED,

    /**
     * Вибір філії для прийому замовлення.
     */
    SELECT_BRANCH,

    /**
     * Філію вибрано та підтверджено.
     */
    BRANCH_SELECTED,

    /**
     * Встановлення дати створення замовлення.
     */
    SET_CREATION_DATE,

    /**
     * Дата створення встановлена.
     */
    CREATION_DATE_SET,

    /**
     * Завершення заповнення базової інформації.
     */
    COMPLETE_BASIC_INFO,

    /**
     * Очищення введених даних.
     */
    CLEAR_BASIC_INFO,

    /**
     * Повернення до попереднього кроку.
     */
    GO_BACK,

    /**
     * Скасування процесу.
     */
    CANCEL
}
