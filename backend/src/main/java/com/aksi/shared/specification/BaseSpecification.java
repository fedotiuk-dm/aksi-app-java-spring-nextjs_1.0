package com.aksi.shared.specification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

/**
 * Базовий клас для JPA Specifications з загальними методами пошуку. Зменшує дублювання коду в
 * доменних Specification класах. Працює з BaseEntity UUID архітектурою.
 */
public final class BaseSpecification {

  private BaseSpecification() {
    // Утилітарний клас
  }

  /**
   * Створює Specification для пошуку за UUID ID (BaseEntity.id).
   *
   * @param id UUID значення для пошуку
   * @param <T> тип entity
   * @return Specification або null
   */
  public static <T> Specification<T> hasId(UUID id) {
    return Optional.ofNullable(id)
        .map(value -> (Specification<T>) (root, query, cb) -> cb.equal(root.get("id"), value))
        .orElse(null);
  }

  /**
   * Створює Specification для пошуку за назвою (case-insensitive).
   *
   * @param name назва для пошуку
   * @param <T> тип entity
   * @return Specification або null
   */
  public static <T> Specification<T> hasName(String name) {
    return hasStringField("name", name);
  }

  /**
   * Створює Specification для пошуку за рядковим полем (case-insensitive).
   *
   * @param fieldName назва поля
   * @param value значення для пошуку
   * @param <T> тип entity
   * @return Specification або null
   */
  public static <T> Specification<T> hasStringField(String fieldName, String value) {
    return Optional.ofNullable(value)
        .filter(v -> !v.trim().isEmpty())
        .map(
            v ->
                (Specification<T>)
                    (root, query, cb) ->
                        cb.like(cb.lower(root.get(fieldName)), "%" + v.toLowerCase() + "%"))
        .orElse(null);
  }

  /**
   * Створює Specification для пошуку за boolean полем.
   *
   * @param fieldName назва поля
   * @param value значення для пошуку
   * @param <T> тип entity
   * @return Specification або null
   */
  public static <T> Specification<T> hasBooleanField(String fieldName, Boolean value) {
    return Optional.ofNullable(value)
        .map(v -> (Specification<T>) (root, query, cb) -> cb.equal(root.get(fieldName), v))
        .orElse(null);
  }

  /**
   * Створює Specification для пошуку за періодом дат.
   *
   * @param fieldName назва поля з датою
   * @param startDate початкова дата
   * @param endDate кінцева дата
   * @param <T> тип entity
   * @return Specification або null
   */
  public static <T> Specification<T> isDateBetween(
      String fieldName, LocalDateTime startDate, LocalDateTime endDate) {
    return (root, query, cb) -> {
      Predicate predicate = cb.conjunction();

      if (startDate != null) {
        predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get(fieldName), startDate));
      }

      if (endDate != null) {
        predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get(fieldName), endDate));
      }

      return predicate;
    };
  }

  /**
   * Створює Specification для пошуку за списком значень (IN clause).
   *
   * @param fieldName назва поля
   * @param values список значень
   * @param <T> тип entity
   * @param <V> тип значень
   * @return Specification або null
   */
  public static <T, V> Specification<T> hasFieldIn(String fieldName, List<V> values) {
    return Optional.ofNullable(values)
        .filter(list -> !list.isEmpty())
        .map(list -> (Specification<T>) (root, query, cb) -> root.get(fieldName).in(list))
        .orElse(null);
  }

  /**
   * Комбінує список Specifications через AND.
   *
   * @param specifications список specifications
   * @param <T> тип entity
   * @return комбіноване Specification
   */
  public static <T> Specification<T> combineWithAnd(List<Specification<T>> specifications) {
    return specifications.stream()
        .filter(spec -> spec != null)
        .reduce(Specification::and)
        .orElse(null);
  }

  /**
   * Комбінує список Specifications через OR.
   *
   * @param specifications список specifications
   * @param <T> тип entity
   * @return комбіноване Specification
   */
  public static <T> Specification<T> combineWithOr(List<Specification<T>> specifications) {
    return specifications.stream()
        .filter(spec -> spec != null)
        .reduce(Specification::or)
        .orElse(null);
  }
}
