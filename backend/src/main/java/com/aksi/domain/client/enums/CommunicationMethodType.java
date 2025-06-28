package com.aksi.domain.client.enums;

/**
 * Способи зв'язку з клієнтом
 * Синхронізовано з OpenAPI enum CommunicationMethod
 */
public enum CommunicationMethodType {

    /**
     * Телефонний дзвінок
     */
    PHONE("Телефонний дзвінок"),

    /**
     * SMS повідомлення
     */
    SMS("SMS повідомлення"),

    /**
     * Viber месенджер
     */
    VIBER("Viber месенджер"),

    /**
     * Telegram месенджер
     */
    TELEGRAM("Telegram месенджер"),

    /**
     * Електронна пошта
     */
    EMAIL("Електронна пошта");

    private final String description;

    CommunicationMethodType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Domain-specific метод для перевірки чи є метод електронним
     */
    public boolean isElectronic() {
        return this == EMAIL || this == VIBER || this == TELEGRAM;
    }

    /**
     * Domain-specific метод для перевірки чи є метод миттєвим месенджером
     */
    public boolean isInstantMessaging() {
        return this == VIBER || this == TELEGRAM || this == SMS;
    }
}
