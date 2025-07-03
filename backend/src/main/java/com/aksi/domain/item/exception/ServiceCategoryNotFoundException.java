package com.aksi.domain.item.exception;

import java.util.UUID;

/** Виняток коли категорія послуг не знайдена Domain-specific RuntimeException для Item domain. */
public class ServiceCategoryNotFoundException extends RuntimeException {

  public ServiceCategoryNotFoundException(String message) {
    super(message);
  }

  public ServiceCategoryNotFoundException(UUID id) {
    super("Категорія послуг не знайдена з ID: " + id);
  }

  public ServiceCategoryNotFoundException(String field, String value) {
    super("Категорія послуг не знайдена з " + field + ": " + value);
  }

  public ServiceCategoryNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  // Static factory methods для різних сценаріїв

  public static ServiceCategoryNotFoundException byCode(String code) {
    return new ServiceCategoryNotFoundException("code", code);
  }

  public static ServiceCategoryNotFoundException byName(String name) {
    return new ServiceCategoryNotFoundException("name", name);
  }
}
