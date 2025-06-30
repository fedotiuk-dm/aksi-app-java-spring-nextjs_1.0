package com.aksi.shared.validation;

import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Загальні функціональні правила валідації для всіх доменів. Уникають дублювання коду між різними
 * доменами.
 */
public final class CommonValidationRules {

  // Regex patterns для валідації
  private static final Pattern EMAIL_PATTERN =
      Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

  private static final Pattern PHONE_PATTERN =
      Pattern.compile(
          "^\\+?[1-9]\\d{1,14}$" // E.164 format
          );

  private static final Pattern UPPER_CASE_CODE_PATTERN = Pattern.compile("^[A-Z0-9_]+$");

  // ==================== ЗАГАЛЬНІ ПРАВИЛА ====================

  /** Валідація email адреси. */
  public static <T> Validator<T> validEmail(java.util.function.Function<T, String> emailExtractor) {
    return entity -> {
      String email = emailExtractor.apply(entity);
      if (email == null || email.trim().isEmpty()) {
        return ValidationResult.valid(); // email опційний
      }

      return EMAIL_PATTERN.matcher(email).matches()
          ? ValidationResult.valid()
          : ValidationResult.invalid("Неправильний формат email: " + email);
    };
  }

  /** Валідація номера телефону. */
  public static <T> Validator<T> validPhone(java.util.function.Function<T, String> phoneExtractor) {
    return entity -> {
      String phone = phoneExtractor.apply(entity);
      if (phone == null || phone.trim().isEmpty()) {
        return ValidationResult.invalid("Номер телефону обов'язковий");
      }

      // Очищуємо від пробілів та дефісів
      String cleanPhone = phone.replaceAll("[\\s-()]", "");

      return PHONE_PATTERN.matcher(cleanPhone).matches()
          ? ValidationResult.valid()
          : ValidationResult.invalid("Неправильний формат телефону: " + phone);
    };
  }

  /** Валідація UUID поля на не-null. */
  public static <T> Validator<T> requiredUuid(
      java.util.function.Function<T, UUID> uuidExtractor, String fieldName) {
    return entity -> {
      UUID uuid = uuidExtractor.apply(entity);
      return uuid != null
          ? ValidationResult.valid()
          : ValidationResult.invalid(fieldName + " обов'язковий");
    };
  }

  /** Валідація коду у верхньому регістрі (CODE_FORMAT). */
  public static <T> Validator<T> validUpperCaseCode(
      java.util.function.Function<T, String> codeExtractor, String fieldName) {
    return entity -> {
      String code = codeExtractor.apply(entity);
      if (code == null || code.trim().isEmpty()) {
        return ValidationResult.invalid(fieldName + " обов'язковий");
      }

      return UPPER_CASE_CODE_PATTERN.matcher(code).matches()
          ? ValidationResult.valid()
          : ValidationResult.invalid(
              fieldName + " повинен бути у верхньому регістрі (A-Z, 0-9, _): " + code);
    };
  }

  /** Валідація діапазону чисел. */
  public static <T> Validator<T> numberInRange(
      java.util.function.Function<T, Number> numberExtractor,
      double min,
      double max,
      String fieldName) {
    return entity -> {
      Number number = numberExtractor.apply(entity);
      if (number == null) {
        return ValidationResult.invalid(fieldName + " обов'язковий");
      }

      double value = number.doubleValue();
      if (value < min || value > max) {
        return ValidationResult.invalid(
            fieldName + " повинен бути в діапазоні " + min + "-" + max + ", отримано: " + value);
      }

      return ValidationResult.valid();
    };
  }

  /** Валідація довжини рядка. */
  public static <T> Validator<T> stringLength(
      java.util.function.Function<T, String> stringExtractor,
      int minLength,
      int maxLength,
      String fieldName) {
    return entity -> {
      String value = stringExtractor.apply(entity);
      if (value == null) {
        return minLength > 0
            ? ValidationResult.invalid(fieldName + " обов'язковий")
            : ValidationResult.valid();
      }

      int length = value.length();
      if (length < minLength || length > maxLength) {
        return ValidationResult.invalid(
            fieldName
                + " повинен бути довжиною "
                + minLength
                + "-"
                + maxLength
                + " символів, отримано: "
                + length);
      }

      return ValidationResult.valid();
    };
  }

  /**
   * Валідація унікальності через Repository. Загальний метод для будь-яких entity з exists методом.
   */
  public static <T, ID> Validator<T> uniqueField(
      java.util.function.Function<T, String> fieldExtractor,
      java.util.function.Function<String, Boolean> existsChecker,
      String fieldName) {
    return entity -> {
      String fieldValue = fieldExtractor.apply(entity);
      if (fieldValue == null) {
        return ValidationResult.valid();
      }

      return existsChecker.apply(fieldValue)
          ? ValidationResult.invalid(fieldName + " '" + fieldValue + "' вже існує")
          : ValidationResult.valid();
    };
  }

  /** Валідація унікальності при оновленні (виключаючи поточний entity). */
  public static <T> Validator<T> uniqueFieldForUpdate(
      java.util.function.Function<T, String> fieldExtractor,
      java.util.function.Function<T, UUID> uuidExtractor,
      java.util.function.BiFunction<String, UUID, Boolean> existsExcludingChecker,
      String fieldName) {
    return entity -> {
      String fieldValue = fieldExtractor.apply(entity);
      UUID currentUuid = uuidExtractor.apply(entity);

      if (fieldValue == null || currentUuid == null) {
        return ValidationResult.valid();
      }

      return existsExcludingChecker.apply(fieldValue, currentUuid)
          ? ValidationResult.invalid(fieldName + " '" + fieldValue + "' вже існує")
          : ValidationResult.valid();
    };
  }

  /** Валідація існування зв'язаної entity через Optional. */
  public static <T, R> Validator<T> relatedEntityExists(
      java.util.function.Function<T, UUID> idExtractor,
      java.util.function.Function<UUID, Optional<R>> finder,
      String entityName) {
    return entity -> {
      UUID id = idExtractor.apply(entity);
      if (id == null) {
        return ValidationResult.valid(); // optional relationship
      }

      return finder.apply(id).isPresent()
          ? ValidationResult.valid()
          : ValidationResult.invalid(entityName + " з UUID " + id + " не існує");
    };
  }
}
