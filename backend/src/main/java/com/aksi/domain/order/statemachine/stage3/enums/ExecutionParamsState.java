package com.aksi.domain.order.statemachine.stage3.enums;

/**
 * Стани для підетапу 3.1 - Параметри виконання
 * Управління датою виконання та терміновістю
 */
public enum ExecutionParamsState {

    /**
     * Початкова ініціалізація параметрів виконання
     */
    PARAMS_INIT("Ініціалізація параметрів"),

    /**
     * Вибір дати виконання (вручну або автоматично)
     */
    DATE_SELECTION("Вибір дати виконання"),

    /**
     * Налаштування терміновості виконання (стандартне, +50%, +100%)
     */
    URGENCY_SELECTION("Налаштування терміновості"),

    /**
     * Валідація консистентності дати та терміновості
     */
    VALIDATION("Валідація параметрів"),

    /**
     * Параметри виконання повністю налаштовані та валідні
     */
    PARAMS_COMPLETED("Параметри завершені");

    private final String description;

    ExecutionParamsState(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    // === ПЕРЕВІРКИ СТАНІВ ===

    /**
     * Чи можна встановлювати дату виконання
     */
    public boolean canSetDate() {
        return this == PARAMS_INIT || this == DATE_SELECTION || this == URGENCY_SELECTION;
    }

    /**
     * Чи можна встановлювати терміновість
     */
    public boolean canSetUrgency() {
        return this == DATE_SELECTION || this == URGENCY_SELECTION;
    }

    /**
     * Чи готові параметри до валідації
     */
    public boolean canValidate() {
        return this == DATE_SELECTION || this == URGENCY_SELECTION;
    }

    /**
     * Чи завершені параметри виконання
     */
    public boolean isCompleted() {
        return this == PARAMS_COMPLETED;
    }

    /**
     * Чи в процесі налаштування
     */
    public boolean isInProgress() {
        return this == DATE_SELECTION || this == URGENCY_SELECTION || this == VALIDATION;
    }
}
