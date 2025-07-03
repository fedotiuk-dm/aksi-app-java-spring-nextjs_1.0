package com.aksi.shared.validation;

import java.util.Optional;
import java.util.UUID;
import java.util.function.Predicate;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aksi.shared.BaseEntity;

/**
 * Базовий abstract клас для Validators з загальними методами валідації. Зменшує дублювання коду в
 * доменних Validator класах. Працює з BaseEntity UUID архітектурою.
 *
 * @param <T> тип Entity
 * @param <R> тип Repository
 */
public abstract class BaseValidator<T extends BaseEntity, R extends JpaRepository<T, UUID>> {

  protected final R repository;

  protected BaseValidator(R repository) {
    this.repository = repository;
  }

  /**
   * Валідує entity для створення.
   *
   * @param entity entity для валідації
   * @return результат валідації
   */
  public ValidationResult validateForCreate(T entity) {
    ValidationResult result = ValidationResult.valid();

    // Базова валідація
    result = result.and(validateNotNull(entity, "Entity не може бути null"));

    if (!result.isValid()) {
      return result;
    }

    // Специфічна валідація
    return result.and(performCreateValidation(entity));
  }

  /**
   * Валідує entity для оновлення.
   *
   * @param entity entity для валідації
   * @return результат валідації
   */
  public ValidationResult validateForUpdate(T entity) {
    ValidationResult result = ValidationResult.valid();

    // Базова валідація
    result = result.and(validateNotNull(entity, "Entity не може бути null"));
    result = result.and(validateNotNull(entity.getId(), "ID не може бути null для оновлення"));

    if (!result.isValid()) {
      return result;
    }

    // Перевірка існування
    result = result.and(validateExists(entity.getId()));

    if (!result.isValid()) {
      return result;
    }

    // Специфічна валідація
    return result.and(performUpdateValidation(entity));
  }

  /**
   * Валідує entity для видалення.
   *
   * @param id UUID ID entity для видалення
   * @return результат валідації
   */
  public ValidationResult validateForDelete(UUID id) {
    ValidationResult result = ValidationResult.valid();

    // Базова валідація
    result = result.and(validateNotNull(id, "ID не може бути null"));

    if (!result.isValid()) {
      return result;
    }

    // Перевірка існування
    result = result.and(validateExists(id));

    if (!result.isValid()) {
      return result;
    }

    // Специфічна валідація
    return result.and(performDeleteValidation(id));
  }

  /**
   * Перевіряє чи об'єкт не null.
   *
   * @param value об'єкт для перевірки
   * @param errorMessage повідомлення про помилку
   * @return результат валідації
   */
  protected ValidationResult validateNotNull(Object value, String errorMessage) {
    return value != null ? ValidationResult.valid() : ValidationResult.invalid(errorMessage);
  }

  /**
   * Перевіряє чи рядок не пустий.
   *
   * @param value рядок для перевірки
   * @param errorMessage повідомлення про помилку
   * @return результат валідації
   */
  protected ValidationResult validateNotEmpty(String value, String errorMessage) {
    return Optional.ofNullable(value)
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .map(s -> ValidationResult.valid())
        .orElse(ValidationResult.invalid(errorMessage));
  }

  /**
   * Перевіряє унікальність значення.
   *
   * @param predicate предикат для перевірки
   * @param errorMessage повідомлення про помилку
   * @return результат валідації
   */
  protected ValidationResult validateUnique(Predicate<R> predicate, String errorMessage) {
    return predicate.test(repository)
        ? ValidationResult.invalid(errorMessage)
        : ValidationResult.valid();
  }

  /**
   * Перевіряє чи існує entity за UUID ID.
   *
   * @param id UUID ID для перевірки
   * @return результат валідації
   */
  protected ValidationResult validateExists(UUID id) {
    return repository.existsById(id)
        ? ValidationResult.valid()
        : ValidationResult.invalid("Entity з ID " + id + " не знайдено");
  }

  /**
   * Перевіряє чи НЕ існує entity за UUID ID.
   *
   * @param id UUID ID для перевірки
   * @return результат валідації
   */
  protected ValidationResult validateNotExists(UUID id) {
    return !repository.existsById(id)
        ? ValidationResult.valid()
        : ValidationResult.invalid("Entity з ID " + id + " вже існує");
  }

  /**
   * Виконує специфічну валідацію для створення. Має бути перевизначений в дочірніх класах.
   *
   * @param entity entity для валідації
   * @return результат валідації
   */
  protected abstract ValidationResult performCreateValidation(T entity);

  /**
   * Виконує специфічну валідацію для оновлення. Може бути перевизначений в дочірніх класах.
   *
   * @param entity entity для валідації
   * @return результат валідації
   */
  protected ValidationResult performUpdateValidation(T entity) {
    return performCreateValidation(entity);
  }

  /**
   * Виконує специфічну валідацію для видалення. Може бути перевизначений в дочірніх класах.
   *
   * @param id UUID ID entity для видалення
   * @return результат валідації
   */
  protected ValidationResult performDeleteValidation(UUID id) {
    return ValidationResult.valid();
  }
}
