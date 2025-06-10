package com.aksi.domain.order.statemachine.stage3.enums;

/**
 * Стани для підетапу 3.3 - Оплата
 * Управління способом оплати та фінансовими деталями
 */
public enum PaymentState {

    /**
     * Початкова ініціалізація конфігурації оплати
     */
    PAYMENT_INIT("Ініціалізація оплати"),

    /**
     * Вибір способу оплати (термінал, готівка, на рахунок)
     */
    METHOD_SELECTION("Вибір способу оплати"),

    /**
     * Розрахунок загальної вартості та сум оплати
     */
    AMOUNT_CALCULATION("Розрахунок сум"),

    /**
     * Введення суми передоплати
     */
    PREPAYMENT_INPUT("Введення передоплати"),

    /**
     * Валідація балансу оплати
     */
    VALIDATION("Валідація оплати"),

    /**
     * Конфігурація оплати завершена
     */
    PAYMENT_COMPLETED("Оплата налаштована");

    private final String description;

    PaymentState(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    // === ПЕРЕВІРКИ СТАНІВ ===

    /**
     * Чи можна вибирати спосіб оплати
     */
    public boolean canSelectMethod() {
        return this == PAYMENT_INIT || this == METHOD_SELECTION;
    }

    /**
     * Чи можна розраховувати суми
     */
    public boolean canCalculateAmounts() {
        return this == METHOD_SELECTION || this == AMOUNT_CALCULATION;
    }

    /**
     * Чи можна вводити передоплату
     */
    public boolean canSetPrepayment() {
        return this == AMOUNT_CALCULATION || this == PREPAYMENT_INPUT;
    }

    /**
     * Чи можна валідувати оплату
     */
    public boolean canValidate() {
        return this == PREPAYMENT_INPUT || this == VALIDATION;
    }

    /**
     * Чи завершена конфігурація оплати
     */
    public boolean isCompleted() {
        return this == PAYMENT_COMPLETED;
    }

    /**
     * Чи в процесі налаштування
     */
    public boolean isInProgress() {
        return this == METHOD_SELECTION ||
               this == AMOUNT_CALCULATION ||
               this == PREPAYMENT_INPUT ||
               this == VALIDATION;
    }
}
