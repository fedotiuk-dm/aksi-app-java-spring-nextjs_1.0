package com.aksi.domain.auth.exception;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Виняток для валідаційних помилок в auth domain Domain-specific RuntimeException з деталями
 * помилок.
 */
public class AuthValidationException extends RuntimeException {

  private final Map<String, List<String>> errors;

  public AuthValidationException(String message) {
    super(message);
    this.errors = new HashMap<>();
  }

  public AuthValidationException(String message, Map<String, List<String>> errors) {
    super(message);
    this.errors = errors != null ? errors : new HashMap<>();
  }

  public AuthValidationException(String field, String errorMessage) {
    super("Помилка валідації: " + field + " - " + errorMessage);
    this.errors = new HashMap<>();
    this.errors.put(field, List.of(errorMessage));
  }

  public AuthValidationException(String message, Throwable cause) {
    super(message, cause);
    this.errors = new HashMap<>();
  }

  public Map<String, List<String>> getErrors() {
    return errors;
  }

  public boolean hasErrors() {
    return !errors.isEmpty();
  }

  public void addError(String field, String errorMessage) {
    errors.computeIfAbsent(field, k -> new java.util.ArrayList<>()).add(errorMessage);
  }

  // Зручні статичні методи
  public static AuthValidationException passwordTooWeak() {
    return new AuthValidationException("password", "Пароль занадто слабкий");
  }

  public static AuthValidationException invalidEmailFormat() {
    return new AuthValidationException("email", "Невірний формат email");
  }

  public static AuthValidationException usernameInvalid() {
    return new AuthValidationException("username", "Невірний формат username");
  }
}
