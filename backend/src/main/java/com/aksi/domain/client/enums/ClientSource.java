package com.aksi.domain.client.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Джерела інформації про хімчистку.
 *
 * Цей enum замінює ClientSourceEntity та вкладені enum в DTO класах
 * для уникнення проблем з генерацією TypeScript типів.
 */
public enum ClientSource {
    /**
     * Соціальна мережа Instagram.
     */
    INSTAGRAM("INSTAGRAM", "Instagram"),

    /**
     * Пошукова система Google.
     */
    GOOGLE("GOOGLE", "Google"),

    /**
     * Рекомендації від інших клієнтів.
     */
    RECOMMENDATION("RECOMMENDATION", "Рекомендації"),

    /**
     * Інше джерело (з уточненням).
     */
    OTHER("OTHER", "Інше");

    private final String code;
    private final String displayName;

    ClientSource(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    /**
     * Отримати код джерела для API.
     */
    @JsonValue
    public String getCode() {
        return code;
    }

    /**
     * Отримати назву для відображення.
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Створити enum з коду (для десеріалізації JSON).
     */
    @JsonCreator
    public static ClientSource fromCode(String code) {
        if (code == null) {
            return OTHER;
        }

        for (ClientSource source : values()) {
            if (source.code.equals(code)) {
                return source;
            }
        }

        return OTHER;
    }

    /**
     * Перевірити, чи є код валідним.
     */
    public static boolean isValidCode(String code) {
        if (code == null) {
            return false;
        }

        for (ClientSource source : values()) {
            if (source.code.equals(code)) {
                return true;
            }
        }

        return false;
    }

    @Override
    public String toString() {
        return code;
    }
}
