package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Події для State Machine базової інформації замовлення.
 * Централізує всі можливі події для кращої підтримуваності.
 */
public enum BasicOrderInfoEvents {

    // === ОСНОВНІ ПОДІЇ ===
    SAVE_DATA("Збереження даних замовлення"),
    UPDATE_DATA("Оновлення даних замовлення"),
    VALIDATE_DATA("Валідація даних замовлення"),
    CLEAR_DATA("Очищення даних замовлення"),
    COMPLETE("Завершення введення базової інформації"),

    // === ПОДІЇ ПЕРЕХОДІВ ===
    START_EDITING("Початок редагування"),
    FINISH_EDITING("Завершення редагування"),
    RESET("Скидання до початкового стану"),

    // === ПОДІЇ ВАЛІДАЦІЇ ===
    VALIDATION_PASSED("Валідація пройшла успішно"),
    VALIDATION_FAILED("Валідація не пройшла"),

    // === СИСТЕМНІ ПОДІЇ ===
    INITIALIZE("Ініціалізація контексту"),
    CLEANUP("Очищення ресурсів");

    private final String description;

    BasicOrderInfoEvents(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return name() + " (" + description + ")";
    }
}
