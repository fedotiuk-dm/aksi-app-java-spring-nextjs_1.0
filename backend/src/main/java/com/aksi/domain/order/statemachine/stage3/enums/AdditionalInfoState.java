package com.aksi.domain.order.statemachine.stage3.enums;

/**
 * Стани для підетапу 3.4 - Додаткова інформація
 * Управління примітками та додатковими вимогами клієнта
 */
public enum AdditionalInfoState {

    /**
     * Початкова ініціалізація додаткової інформації
     */
    INFO_INIT("Ініціалізація додаткової інформації"),

    /**
     * Введення загальних приміток до замовлення
     */
    NOTES_INPUT("Введення приміток"),

    /**
     * Введення додаткових вимог клієнта
     */
    REQUIREMENTS_INPUT("Введення вимог клієнта"),

    /**
     * Валідація введеної інформації
     */
    VALIDATION("Валідація інформації"),

    /**
     * Додаткова інформація завершена
     */
    INFO_COMPLETED("Додаткова інформація завершена");

    private final String description;

    AdditionalInfoState(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    // === ПЕРЕВІРКИ СТАНІВ ===

    /**
     * Чи можна вводити примітки
     */
    public boolean canInputNotes() {
        return this == INFO_INIT ||
               this == NOTES_INPUT ||
               this == REQUIREMENTS_INPUT;
    }

    /**
     * Чи можна вводити вимоги клієнта
     */
    public boolean canInputRequirements() {
        return this == INFO_INIT ||
               this == NOTES_INPUT ||
               this == REQUIREMENTS_INPUT;
    }

    /**
     * Чи можна валідувати інформацію
     */
    public boolean canValidate() {
        return this == NOTES_INPUT ||
               this == REQUIREMENTS_INPUT ||
               this == VALIDATION;
    }

    /**
     * Чи завершена додаткова інформація
     */
    public boolean isCompleted() {
        return this == INFO_COMPLETED;
    }

    /**
     * Чи в процесі введення
     */
    public boolean isInProgress() {
        return this == NOTES_INPUT ||
               this == REQUIREMENTS_INPUT ||
               this == VALIDATION;
    }

    /**
     * Чи можна очистити примітки
     */
    public boolean canClearNotes() {
        return this != INFO_INIT && this != INFO_COMPLETED;
    }

    /**
     * Чи можна очистити вимоги
     */
    public boolean canClearRequirements() {
        return this != INFO_INIT && this != INFO_COMPLETED;
    }
}
