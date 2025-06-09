package com.aksi.domain.order.statemachine.stage1.enums;

/**
 * Типи помилок валідації форми нового клієнта.
 */
public enum NewClientFormValidationError {

    // Помилки обов'язкових полів
    FIRST_NAME_EMPTY("Ім'я є обов'язковим"),
    FIRST_NAME_TOO_SHORT("Ім'я повинно містити мінімум 2 символи"),
    FIRST_NAME_INVALID_FORMAT("Ім'я містить недопустимі символи"),

    LAST_NAME_EMPTY("Прізвище є обов'язковим"),
    LAST_NAME_TOO_SHORT("Прізвище повинно містити мінімум 2 символи"),
    LAST_NAME_INVALID_FORMAT("Прізвище містить недопустимі символи"),

    PHONE_EMPTY("Телефон є обов'язковим"),
    PHONE_INVALID_FORMAT("Неправильний формат телефону"),
    PHONE_TOO_SHORT("Телефон повинен містити мінімум 10 символів"),
    PHONE_DUPLICATE("Клієнт з таким телефоном вже існує"),

    // Помилки опціональних полів
    EMAIL_INVALID_FORMAT("Неправильний формат email"),
    ADDRESS_TOO_LONG("Адреса занадто довга"),

    // Помилки джерела інформації
    SOURCE_NOT_SELECTED("Джерело інформації не вибрано"),
    SOURCE_DETAILS_MISSING("Для джерела 'Інше' потрібно вказати деталі"),
    SOURCE_DETAILS_TOO_LONG("Деталі джерела занадто довгі"),

    // Помилки каналів комунікації
    COMMUNICATION_CHANNELS_EMPTY("Не вибрано жодного каналу комунікації");

    private final String message;

    NewClientFormValidationError(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
