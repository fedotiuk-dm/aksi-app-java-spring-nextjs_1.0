package com.aksi.domain.client.enums;

/**
 * Джерела надходження клієнтів.
 * Синхронізовано з OpenAPI схемою ClientSourceType.
 */
public enum ClientSourceType {

    /** Рекомендація */
    REFERRAL("Рекомендація"),

    /** Реклама */
    ADVERTISING("Реклама"),

    /** Соціальні мережі */
    SOCIAL_MEDIA("Соціальні мережі"),

    /** Веб-сайт */
    WEBSITE("Веб-сайт"),

    /** Проходив повз */
    WALKING_BY("Проходив повз"),

    /** Постійний клієнт */
    REPEAT_CUSTOMER("Постійний клієнт"),

    /** Інше */
    OTHER("Інше");

    private final String displayName;

    ClientSourceType(String displayName) {
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
    public static ClientSourceType fromApiValue(String apiValue) {
        if (apiValue == null) {
            return null;
        }
        try {
            return ClientSourceType.valueOf(apiValue.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Невідомий тип джерела клієнта: " + apiValue);
        }
    }

    /**
     * Перевірка чи потребує уточнення
     */
    public boolean requiresSpecification() {
        return this == OTHER;
    }
}
