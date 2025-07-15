package com.aksi.domain.auth.validation;

import org.springframework.stereotype.Component;

/**
 * Валідатор для бізнес-правил користувачів. Містить тільки методи нормалізації даних. Bean
 * Validation (@NotNull, @Size, @Pattern, @Email) використовується в OpenAPI.
 */
@Component
public class UserValidator {

  /**
   * Нормалізація email (приведення до нижнього регістру). Аналог normalizePhone в ClientValidator.
   */
  public String normalizeEmail(String email) {
    return email != null ? email.trim().toLowerCase() : null;
  }

  /** Нормалізація username (приведення до нижнього регістру). */
  public String normalizeUsername(String username) {
    return username != null ? username.trim().toLowerCase() : null;
  }
}
