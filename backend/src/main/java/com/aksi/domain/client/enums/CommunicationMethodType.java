package com.aksi.domain.client.enums;

/**
 * Способи зв'язку з клієнтом.
 * Синхронізовано з OpenAPI схемою CommunicationMethod.
 */
public enum CommunicationMethodType {

    /** Телефонний дзвінок */
    PHONE("Телефонний дзвінок"),

    /** SMS повідомлення */
    SMS("SMS повідомлення"),

    /** Viber месенджер */
    VIBER("Viber месенджер"),

    /** Telegram месенджер */
    TELEGRAM("Telegram месенджер"),

    /** Електронна пошта */
    EMAIL("Електронна пошта");

    private final String displayName;

    CommunicationMethodType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Конвертація до рядка для API
     */
    public String toApiValue() {
        return this.name();
    }

    /**
     * Створення з API значення
     */
    public static CommunicationMethodType fromApiValue(String apiValue) {
        if (apiValue == null) {
            return null;
        }
        try {
            return CommunicationMethodType.valueOf(apiValue.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Невідомий тип зв'язку: " + apiValue);
        }
    }
}
