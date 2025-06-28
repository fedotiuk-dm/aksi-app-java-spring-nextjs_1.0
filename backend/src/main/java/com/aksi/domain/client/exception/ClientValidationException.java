package com.aksi.domain.client.exception;

/**
 * Виняток, що виникає при порушенні бізнес-правил валідації клієнта
 */
public class ClientValidationException extends RuntimeException {

    public ClientValidationException(String message) {
        super(message);
    }

    public ClientValidationException(String message, Throwable cause) {
        super(message, cause);
    }

    public static ClientValidationException invalidPhone(String phone) {
        return new ClientValidationException("Некоректний формат телефону: " + phone + ". Очікується формат +380XXXXXXXXX");
    }

    public static ClientValidationException invalidEmail(String email) {
        return new ClientValidationException("Некоректний формат email: " + email);
    }

    public static ClientValidationException emptyFirstName() {
        return new ClientValidationException("Ім'я клієнта не може бути порожнім");
    }

    public static ClientValidationException emptyLastName() {
        return new ClientValidationException("Прізвище клієнта не може бути порожнім");
    }

    public static ClientValidationException firstNameTooShort() {
        return new ClientValidationException("Ім'я клієнта має містити мінімум 2 символи");
    }

    public static ClientValidationException lastNameTooShort() {
        return new ClientValidationException("Прізвище клієнта має містити мінімум 2 символи");
    }

    public static ClientValidationException notesTooLong() {
        return new ClientValidationException("Примітки не можуть перевищувати 500 символів");
    }

    public static ClientValidationException noCommunicationMethods() {
        return new ClientValidationException("Клієнт повинен мати принаймні один спосіб зв'язку");
    }
}
