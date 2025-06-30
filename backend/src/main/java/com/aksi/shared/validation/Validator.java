package com.aksi.shared.validation;

import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;

/**
 * Функціональний інтерфейс для валідації. Дозволяє композицію валідаційних правил без
 * if-нагромаджень.
 *
 * <p>Використовується всіма доменами для консистентної валідації.
 *
 * @param <T> тип об'єкта для валідації
 */
@FunctionalInterface
public interface Validator<T> {

  ValidationResult validate(T entity);

  /** Композиція валідаторів (AND логіка). */
  default Validator<T> and(Validator<T> other) {
    return entity -> this.validate(entity).and(other.validate(entity));
  }

  /** Альтернативна валідація (OR логіка). */
  default Validator<T> or(Validator<T> other) {
    return entity -> this.validate(entity).or(other.validate(entity));
  }

  /** Інверсія валідатора. */
  default Validator<T> not() {
    return entity -> this.validate(entity).not();
  }

  /** Створює валідатор з предіката. */
  static <T> Validator<T> from(Predicate<T> predicate, String errorMessage) {
    return entity ->
        predicate.test(entity) ? ValidationResult.valid() : ValidationResult.invalid(errorMessage);
  }

  /** Створює валідатор з Optional результатом. */
  static <T, R> Validator<T> fromOptional(
      Function<T, Optional<R>> optionalFunction, String errorMessage) {
    return entity ->
        optionalFunction.apply(entity).isPresent()
            ? ValidationResult.valid()
            : ValidationResult.invalid(errorMessage);
  }

  /** Створює валідатор з функції що повертає boolean. */
  static <T> Validator<T> fromFunction(
      Function<T, Boolean> validationFunction, String errorMessage) {
    return entity ->
        Boolean.TRUE.equals(validationFunction.apply(entity))
            ? ValidationResult.valid()
            : ValidationResult.invalid(errorMessage);
  }

  /** Валідатор що завжди проходить. */
  static <T> Validator<T> valid() {
    return entity -> ValidationResult.valid();
  }

  /** Валідатор що завжди не проходить. */
  static <T> Validator<T> invalid(String error) {
    return entity -> ValidationResult.invalid(error);
  }

  /** Умовний валідатор - застосовується тільки якщо умова true. */
  static <T> Validator<T> when(Predicate<T> condition, Validator<T> validator) {
    return entity -> condition.test(entity) ? validator.validate(entity) : ValidationResult.valid();
  }

  /** Валідатор для списків елементів. */
  static <T> Validator<Iterable<T>> forEach(Validator<T> itemValidator) {
    return items -> {
      for (T item : items) {
        var result = itemValidator.validate(item);
        if (!result.isValid()) {
          return result;
        }
      }
      return ValidationResult.valid();
    };
  }
}
