package com.aksi.domain.auth.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Ролі користувачів в системі хімчистки
 * Синхронізовано з OpenAPI enum UserRole
 */
@Getter
@RequiredArgsConstructor
public enum UserRole {
    ADMIN("ADMIN", "Адміністратор системи"),
    MANAGER("MANAGER", "Менеджер філії"),
    EMPLOYEE("EMPLOYEE", "Працівник філії"),
    CASHIER("CASHIER", "Касир"),
    OPERATOR("OPERATOR", "Оператор прийому/видачі");

    private final String value;
    private final String description;

    /**
     * Конвертація з API значення до domain enum
     */
    public static UserRole fromApiValue(String value) {
        if (value == null) {
            return null;
        }
        for (UserRole role : values()) {
            if (role.value.equals(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Невідома роль користувача: " + value);
    }

    /**
     * Конвертація до API значення
     */
    public String toApiValue() {
        return this.value;
    }

    /**
     * Перевірка чи є роль адміністративною
     */
    public boolean isAdministrative() {
        return this == ADMIN || this == MANAGER;
    }

    /**
     * Перевірка чи може роль працювати з касою
     */
    public boolean canHandleCash() {
        return this == CASHIER || this == MANAGER || this == ADMIN;
    }

    /**
     * Перевірка чи може роль приймати замовлення
     */
    public boolean canTakeOrders() {
        return this == OPERATOR || this == EMPLOYEE || this == MANAGER || this == ADMIN;
    }
}
