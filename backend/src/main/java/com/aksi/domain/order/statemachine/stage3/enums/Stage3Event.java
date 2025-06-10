package com.aksi.domain.order.statemachine.stage3.enums;

/**
 * Події для Stage3 State Machine
 * Визначає переходи між станами для кожного підетапу
 */
public enum Stage3Event {

    // === ЗАГАЛЬНІ ПОДІЇ ===
    INITIALIZE_STAGE3("Ініціалізація Stage3"),
    COMPLETE_STAGE3("Завершення Stage3"),
    ERROR_OCCURRED("Виникла помилка"),
    RESET_STAGE3("Скидання Stage3"),

    // === 3.1 ПАРАМЕТРИ ВИКОНАННЯ ===
    START_EXECUTION_PARAMS("Розпочати налаштування параметрів виконання"),
    SET_EXECUTION_DATE("Встановити дату виконання"),
    CALCULATE_DATE("Розрахувати дату автоматично"),
    SET_URGENCY("Встановити терміновість"),
    VALIDATE_EXECUTION_PARAMS("Валідувати параметри виконання"),
    COMPLETE_EXECUTION_PARAMS("Завершити параметри виконання"),

    // === 3.2 ЗНИЖКИ ===
    START_DISCOUNT_CONFIG("Розпочати конфігурацію знижок"),
    SET_DISCOUNT_TYPE("Встановити тип знижки"),
    CALCULATE_DISCOUNT("Розрахувати знижку"),
    VALIDATE_DISCOUNT("Валідувати знижку"),
    REMOVE_DISCOUNT("Видалити знижку"),
    COMPLETE_DISCOUNT_CONFIG("Завершити конфігурацію знижок"),

    // === 3.3 ОПЛАТА ===
    START_PAYMENT_CONFIG("Розпочати конфігурацію оплати"),
    SET_PAYMENT_METHOD("Встановити спосіб оплати"),
    SET_PREPAID_AMOUNT("Встановити суму передоплати"),
    CALCULATE_PAYMENT("Розрахувати оплату"),
    VALIDATE_PAYMENT("Валідувати оплату"),
    COMPLETE_PAYMENT_CONFIG("Завершити конфігурацію оплати"),

    // === 3.4 ДОДАТКОВА ІНФОРМАЦІЯ ===
    START_ADDITIONAL_INFO("Розпочати введення додаткової інформації"),
    SET_ORDER_NOTES("Встановити примітки до замовлення"),
    SET_CUSTOMER_REQUIREMENTS("Встановити додаткові вимоги клієнта"),
    CLEAR_NOTES("Очистити примітки"),
    CLEAR_REQUIREMENTS("Очистити вимоги"),
    VALIDATE_ADDITIONAL_INFO("Валідувати додаткову інформацію"),
    COMPLETE_ADDITIONAL_INFO("Завершити додаткову інформацію"),

    // === НАВІГАЦІЯ ===
    GO_TO_EXECUTION_PARAMS("Перейти до параметрів виконання"),
    GO_TO_DISCOUNT_CONFIG("Перейти до конфігурації знижок"),
    GO_TO_PAYMENT_CONFIG("Перейти до конфігурації оплати"),
    GO_TO_ADDITIONAL_INFO("Перейти до додаткової інформації"),

    // === ДОПОМІЖНІ ПОДІЇ ===
    RECALCULATE_ALL("Перерахувати всі параметри"),
    SAVE_DRAFT("Зберегти чернетку"),
    LOAD_DRAFT("Завантажити чернетку");

    private final String description;

    Stage3Event(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    // === КАТЕГОРІЇ ПОДІЙ ===

    public boolean isExecutionParamsEvent() {
        return this == START_EXECUTION_PARAMS ||
               this == SET_EXECUTION_DATE ||
               this == CALCULATE_DATE ||
               this == SET_URGENCY ||
               this == VALIDATE_EXECUTION_PARAMS ||
               this == COMPLETE_EXECUTION_PARAMS;
    }

    public boolean isDiscountEvent() {
        return this == START_DISCOUNT_CONFIG ||
               this == SET_DISCOUNT_TYPE ||
               this == CALCULATE_DISCOUNT ||
               this == VALIDATE_DISCOUNT ||
               this == REMOVE_DISCOUNT ||
               this == COMPLETE_DISCOUNT_CONFIG;
    }

    public boolean isPaymentEvent() {
        return this == START_PAYMENT_CONFIG ||
               this == SET_PAYMENT_METHOD ||
               this == SET_PREPAID_AMOUNT ||
               this == CALCULATE_PAYMENT ||
               this == VALIDATE_PAYMENT ||
               this == COMPLETE_PAYMENT_CONFIG;
    }

    public boolean isAdditionalInfoEvent() {
        return this == START_ADDITIONAL_INFO ||
               this == SET_ORDER_NOTES ||
               this == SET_CUSTOMER_REQUIREMENTS ||
               this == CLEAR_NOTES ||
               this == CLEAR_REQUIREMENTS ||
               this == VALIDATE_ADDITIONAL_INFO ||
               this == COMPLETE_ADDITIONAL_INFO;
    }

    public boolean isNavigationEvent() {
        return this == GO_TO_EXECUTION_PARAMS ||
               this == GO_TO_DISCOUNT_CONFIG ||
               this == GO_TO_PAYMENT_CONFIG ||
               this == GO_TO_ADDITIONAL_INFO;
    }

    public boolean isUtilityEvent() {
        return this == RECALCULATE_ALL ||
               this == SAVE_DRAFT ||
               this == LOAD_DRAFT;
    }
}
