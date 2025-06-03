package com.aksi.domain.order.statemachine;

/**
 * Доступні дії користувача в Order Wizard
 *
 * Відповідає за визначення всіх можливих операцій,
 * які може виконати користувач в різних станах wizard
 */
public enum OrderWizardAction {

    // === БАЗОВІ ДІЇ (завжди доступні) ===
    CANCEL("Скасувати wizard"),
    GET_STATE("Отримати поточний стан"),

    // === ЕТАП 1: КЛІЄНТ ===
    SELECT_CLIENT("Вибрати існуючого клієнта"),
    CREATE_CLIENT("Створити нового клієнта"),
    SAVE_CLIENT("Зберегти дані клієнта"),

    // === ЕТАП 1: БАЗОВА ІНФОРМАЦІЯ ЗАМОВЛЕННЯ ===
    SET_ORDER_INFO("Встановити базову інформацію замовлення"),
    SAVE_ORDER_INFO("Зберегти базову інформацію замовлення"),

    // === ЕТАП 2: УПРАВЛІННЯ ПРЕДМЕТАМИ ===
    ADD_ITEM("Додати предмет до замовлення"),
    EDIT_ITEM("Редагувати предмет"),
    REMOVE_ITEM("Видалити предмет"),
    VIEW_ITEMS("Переглянути додані предмети"),
    PROCEED_TO_PARAMS("Перейти до параметрів замовлення"),

    // === ЕТАП 2: ПІДВІЗАРД ПРЕДМЕТІВ ===
    SET_ITEM_BASIC_INFO("Встановити основну інформацію предмета"),
    SET_ITEM_CHARACTERISTICS("Встановити характеристики предмета"),
    SET_ITEM_DEFECTS_STAINS("Встановити дефекти та забруднення"),
    CALCULATE_ITEM_PRICE("Розрахувати ціну предмета"),
    ADD_ITEM_PHOTOS("Додати фото предмета"),
    COMPLETE_ITEM("Завершити додавання предмета"),

    // === ЕТАП 3: ПАРАМЕТРИ ЗАМОВЛЕННЯ ===
    SET_EXECUTION_PARAMS("Встановити параметри виконання"),
    SET_GLOBAL_DISCOUNTS("Встановити глобальні знижки"),
    SET_PAYMENT_INFO("Встановити інформацію про оплату"),
    SET_ADDITIONAL_INFO("Встановити додаткову інформацію"),

    // === ЕТАП 4: ПІДТВЕРДЖЕННЯ ===
    REVIEW_ORDER("Переглянути замовлення"),
    ACCEPT_TERMS("Прийняти умови обслуговування"),
    DIGITAL_SIGNATURE("Цифровий підпис"),
    COMPLETE_ORDER("Завершити замовлення"),
    GENERATE_RECEIPT("Згенерувати квитанцію"),
    PRINT_RECEIPT("Надрукувати квитанцію");

    private final String description;

    OrderWizardAction(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Отримати назву дії для API
     */
    public String getActionName() {
        return this.name();
    }
}
