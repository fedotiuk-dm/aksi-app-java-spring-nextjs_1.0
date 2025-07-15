package com.aksi.domain.auth.enums;

import lombok.Getter;

/** Ролі користувачів в системі хімчистки Синхронізовано з OpenAPI enum UserRole. */
@Getter
public enum UserRole {
  ADMIN("ADMIN", "Адміністратор системи"),
  MANAGER("MANAGER", "Менеджер філії"),
  EMPLOYEE("EMPLOYEE", "Працівник філії"),
  CASHIER("CASHIER", "Касир"),
  OPERATOR("OPERATOR", "Оператор прийому/видачі");

  private final String value;
  private final String description;

  /** Конструктор enum. */
  UserRole(String value, String description) {
    this.value = value;
    this.description = description;
  }

  /** Конвертація з API значення до domain enum. */
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

  /** Конвертація до API значення. */
  public String toApiValue() {
    return this.value;
  }
}
