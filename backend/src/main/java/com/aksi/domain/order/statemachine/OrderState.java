package com.aksi.domain.order.statemachine;

/**
 * Стани Order Wizard State Machine
 *
 * Відповідає 4-етапній структурі Order Wizard з підстанами
 */
public enum OrderState {
    // Початковий стан
    INITIAL,

    // === ЕТАП 1: Клієнт та базова інформація ===
    CLIENT_SELECTION,        // 1.1 Вибір/створення клієнта
    ORDER_INITIALIZATION,    // 1.2 Базова інформація замовлення

    // === ЕТАП 2: Менеджер предметів ===
    ITEM_MANAGEMENT,         // 2.0 Головний екран менеджера предметів
    ITEM_WIZARD_ACTIVE,      // 2.x Стан активного підвізарда (деталі в Stage2StateMachine)

    // === ЕТАП 3: Загальні параметри замовлення ===
    EXECUTION_PARAMS,        // 3.1 Параметри виконання (дата, терміновість)
    GLOBAL_DISCOUNTS,        // 3.2 Знижки (глобальні для замовлення)
    PAYMENT_PROCESSING,      // 3.3 Оплата
    ADDITIONAL_INFO,         // 3.4 Додаткова інформація

    // === ЕТАП 4: Підтвердження та завершення ===
    ORDER_CONFIRMATION,      // 4.0 Початок підтвердження
    ORDER_REVIEW,            // 4.1 Перегляд замовлення з детальним розрахунком
    LEGAL_ASPECTS,           // 4.2 Юридичні аспекти та підпис
    RECEIPT_GENERATION,      // 4.3 Формування та друк квитанції

    // === ФІНАЛЬНІ СТАНИ ===
    COMPLETED,               // Замовлення успішно завершено
    CANCELLED                // Замовлення скасовано
}
