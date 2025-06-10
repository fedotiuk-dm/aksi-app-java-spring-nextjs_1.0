package com.aksi.domain.order.statemachine.stage3.enums;

/**
 * Стани для Stage3 - Загальні параметри замовлення
 * Описує основні етапи роботи з параметрами замовлення
 */
public enum Stage3State {

    // === ПОЧАТКОВИЙ СТАН ===
    STAGE3_INIT("Ініціалізація Stage3"),

    // === 3.1 ПАРАМЕТРИ ВИКОНАННЯ ===
    EXECUTION_PARAMS_INIT("Ініціалізація параметрів виконання"),
    DATE_SELECTION("Вибір дати виконання"),
    URGENCY_SELECTION("Налаштування терміновості"),
    EXECUTION_PARAMS_COMPLETED("Параметри виконання завершені"),

    // === 3.2 ЗНИЖКИ ===
    DISCOUNT_CONFIG_INIT("Ініціалізація конфігурації знижок"),
    DISCOUNT_TYPE_SELECTION("Вибір типу знижки"),
    DISCOUNT_VALIDATION("Валідація знижки"),
    DISCOUNT_CONFIG_COMPLETED("Конфігурація знижок завершена"),

    // === 3.3 ОПЛАТА ===
    PAYMENT_CONFIG_INIT("Ініціалізація конфігурації оплати"),
    PAYMENT_METHOD_SELECTION("Вибір способу оплати"),
    PAYMENT_AMOUNT_CALCULATION("Розрахунок сум оплати"),
    PAYMENT_CONFIG_COMPLETED("Конфігурація оплати завершена"),

    // === 3.4 ДОДАТКОВА ІНФОРМАЦІЯ ===
    ADDITIONAL_INFO_INIT("Ініціалізація додаткової інформації"),
    NOTES_INPUT("Введення приміток"),
    REQUIREMENTS_INPUT("Введення додаткових вимог"),
    ADDITIONAL_INFO_COMPLETED("Додаткова інформація завершена"),

    // === ЗАВЕРШЕННЯ ===
    STAGE3_COMPLETED("Stage3 повністю завершений"),
    STAGE3_ERROR("Помилка в Stage3");

    private final String description;

    Stage3State(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    // === ПЕРЕВІРКИ СТАНІВ ===

    public boolean isExecutionParamsStage() {
        return this == EXECUTION_PARAMS_INIT ||
               this == DATE_SELECTION ||
               this == URGENCY_SELECTION ||
               this == EXECUTION_PARAMS_COMPLETED;
    }

    public boolean isDiscountConfigStage() {
        return this == DISCOUNT_CONFIG_INIT ||
               this == DISCOUNT_TYPE_SELECTION ||
               this == DISCOUNT_VALIDATION ||
               this == DISCOUNT_CONFIG_COMPLETED;
    }

    public boolean isPaymentConfigStage() {
        return this == PAYMENT_CONFIG_INIT ||
               this == PAYMENT_METHOD_SELECTION ||
               this == PAYMENT_AMOUNT_CALCULATION ||
               this == PAYMENT_CONFIG_COMPLETED;
    }

    public boolean isAdditionalInfoStage() {
        return this == ADDITIONAL_INFO_INIT ||
               this == NOTES_INPUT ||
               this == REQUIREMENTS_INPUT ||
               this == ADDITIONAL_INFO_COMPLETED;
    }

    public boolean isCompleted() {
        return this == STAGE3_COMPLETED;
    }

    public boolean isError() {
        return this == STAGE3_ERROR;
    }

    public boolean isInProgress() {
        return !isCompleted() && !isError() && this != STAGE3_INIT;
    }
}
