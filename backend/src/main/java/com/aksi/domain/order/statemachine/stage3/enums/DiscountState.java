package com.aksi.domain.order.statemachine.stage3.enums;

/**
 * Стани для підетапу 3.2 - Знижки
 * Управління глобальними знижками для замовлення
 */
public enum DiscountState {

    /**
     * Початкова ініціалізація конфігурації знижок
     */
    DISCOUNT_INIT("Ініціалізація знижок"),

    /**
     * Вибір типу знижки (Еверкард, соцмережі, ЗСУ, інше)
     */
    TYPE_SELECTION("Вибір типу знижки"),

    /**
     * Валідація сумісності знижки з категоріями послуг
     */
    VALIDATION("Валідація знижки"),

    /**
     * Розрахунок фінальної суми після застосування знижки
     */
    CALCULATION("Розрахунок знижки"),

    /**
     * Конфігурація знижок завершена
     */
    DISCOUNT_COMPLETED("Знижки налаштовані");

    private final String description;

    DiscountState(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    // === ПЕРЕВІРКИ СТАНІВ ===

    /**
     * Чи можна вибирати тип знижки
     */
    public boolean canSelectType() {
        return this == DISCOUNT_INIT || this == TYPE_SELECTION;
    }

    /**
     * Чи можна валідувати знижку
     */
    public boolean canValidate() {
        return this == TYPE_SELECTION || this == VALIDATION;
    }

    /**
     * Чи можна розраховувати знижку
     */
    public boolean canCalculate() {
        return this == VALIDATION || this == CALCULATION;
    }

    /**
     * Чи завершена конфігурація знижок
     */
    public boolean isCompleted() {
        return this == DISCOUNT_COMPLETED;
    }

    /**
     * Чи в процесі налаштування
     */
    public boolean isInProgress() {
        return this == TYPE_SELECTION || this == VALIDATION || this == CALCULATION;
    }
}
