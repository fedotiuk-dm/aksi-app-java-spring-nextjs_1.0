package com.aksi.domain.auth.validation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.aksi.domain.auth.entity.UserEntity;
import com.aksi.domain.auth.enums.UserRole;
import com.aksi.domain.auth.exception.AuthValidationException;

/**
 * Валідатор для бізнес-правил користувачів Тільки бізнес-логіка, Bean Validation
 * (@NotNull, @Size, @Pattern, @Email) в OpenAPI
 */
@Component
public class UserValidator {

  /** Валідація користувача для створення Тільки бізнес-правила */
  public void validateForCreation(UserEntity user) {
    Map<String, List<String>> errors = new HashMap<>();

    validateRoles(user, errors);

    if (!errors.isEmpty()) {
      throw new AuthValidationException("Помилки валідації при створенні користувача", errors);
    }
  }

  /** Валідація користувача для оновлення Тільки бізнес-правила */
  public void validateForUpdate(UserEntity user) {
    Map<String, List<String>> errors = new HashMap<>();

    validateRoles(user, errors);

    if (!errors.isEmpty()) {
      throw new AuthValidationException("Помилки валідації при оновленні користувача", errors);
    }
  }

  /**
   * Нормалізація email (приведення до нижнього регістру) Аналог normalizePhone в ClientValidator
   */
  public String normalizeEmail(String email) {
    return email != null ? email.trim().toLowerCase() : null;
  }

  /** Нормалізація username (приведення до нижнього регістру) */
  public String normalizeUsername(String username) {
    return username != null ? username.trim().toLowerCase() : null;
  }

  /** Нормалізація імені та прізвища */
  public String normalizeName(String name) {
    if (name == null) return null;

    String trimmed = name.trim();
    if (trimmed.isEmpty()) return null;

    // Першу літеру велику, решту малі
    return trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1).toLowerCase();
  }

  // Приватні допоміжні методи - тільки бізнес-правила

  private void validateRoles(UserEntity user, Map<String, List<String>> errors) {
    if (user.getRoles() == null || user.getRoles().isEmpty()) {
      errors
          .computeIfAbsent("roles", k -> new ArrayList<>())
          .add("Користувач повинен мати хоча б одну роль");
      return;
    }

    // Бізнес-правило: максимум 3 ролі
    if (user.getRoles().size() > 3) {
      errors
          .computeIfAbsent("roles", k -> new ArrayList<>())
          .add("Користувач не може мати більше 3 ролей");
    }

    // Бізнес-правило: ADMIN може мати тільки ADMIN роль
    if (user.getRoles().contains(UserRole.ADMIN) && user.getRoles().size() > 1) {
      errors
          .computeIfAbsent("roles", k -> new ArrayList<>())
          .add("Адміністратор може мати тільки роль ADMIN");
    }

    // Бізнес-правило: CASHIER та OPERATOR не можуть бути разом (конфлікт ролей)
    if (user.getRoles().contains(UserRole.CASHIER) && user.getRoles().contains(UserRole.OPERATOR)) {
      errors
          .computeIfAbsent("roles", k -> new ArrayList<>())
          .add("Касир і оператор не можуть бути однією особою (конфлікт ролей)");
    }
  }
}
