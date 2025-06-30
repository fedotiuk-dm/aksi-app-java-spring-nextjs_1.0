package com.aksi.domain.item.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.item.entity.PriceModifierEntity;

import jakarta.persistence.criteria.Predicate;

/**
 * JPA Specifications для PriceModifierEntity. Замінює складні @Query методи на type-safe Criteria
 * API.
 */
public class PriceModifierSpecification {

  /** Активні модифікатори. */
  public static Specification<PriceModifierEntity> isActive() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("isActive"));
  }

  /** Неактивні модифікатори. */
  public static Specification<PriceModifierEntity> isInactive() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isFalse(root.get("isActive"));
  }

  /** Модифікатори за кодом (містить). */
  public static Specification<PriceModifierEntity> codeContains(String code) {
    return (root, query, criteriaBuilder) -> {
      if (code == null || code.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.like(
          criteriaBuilder.lower(root.get("code")), "%" + code.toLowerCase() + "%");
    };
  }

  /** Модифікатори за назвою (містить). */
  public static Specification<PriceModifierEntity> nameContains(String name) {
    return (root, query, criteriaBuilder) -> {
      if (name == null || name.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.like(
          criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    };
  }

  /** Модифікатори за типом. */
  public static Specification<PriceModifierEntity> hasType(String modifierType) {
    return (root, query, criteriaBuilder) -> {
      if (modifierType == null || modifierType.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("modifierType"), modifierType);
    };
  }

  /** Відсоткові модифікатори. */
  public static Specification<PriceModifierEntity> isPercentage() {
    return hasType("PERCENTAGE");
  }

  /** Модифікатори з фіксованою сумою. */
  public static Specification<PriceModifierEntity> isFixedAmount() {
    return hasType("FIXED_AMOUNT");
  }

  /** Модифікатори в діапазоні значень. */
  public static Specification<PriceModifierEntity> valueBetween(Double minValue, Double maxValue) {
    return (root, query, criteriaBuilder) -> {
      if (minValue == null && maxValue == null) {
        return criteriaBuilder.conjunction();
      }
      if (minValue == null) {
        return criteriaBuilder.lessThanOrEqualTo(root.get("value"), maxValue);
      }
      if (maxValue == null) {
        return criteriaBuilder.greaterThanOrEqualTo(root.get("value"), minValue);
      }
      return criteriaBuilder.between(root.get("value"), minValue, maxValue);
    };
  }

  /** Модифікатори з позитивним значенням (надбавки). */
  public static Specification<PriceModifierEntity> isPositive() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("value"), 0.0);
  }

  /** Модифікатори з негативним значенням (знижки). */
  public static Specification<PriceModifierEntity> isNegative() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("value"), 0.0);
  }

  /** Модифікатори застосовні до певної категорії. */
  public static Specification<PriceModifierEntity> applicableToCategory(UUID categoryId) {
    return (root, query, criteriaBuilder) -> {
      if (categoryId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.isMember(categoryId, root.get("applicableTo"));
    };
  }

  /** Модифікатори застосовні до будь-яких категорій з переліку. */
  public static Specification<PriceModifierEntity> applicableToAnyCategory(List<UUID> categoryIds) {
    return (root, query, criteriaBuilder) -> {
      if (categoryIds == null || categoryIds.isEmpty()) {
        return criteriaBuilder.conjunction();
      }

      var predicates =
          categoryIds.stream()
              .map(categoryId -> criteriaBuilder.isMember(categoryId, root.get("applicableTo")))
              .toArray(Predicate[]::new);

      return criteriaBuilder.or(predicates);
    };
  }

  /** Глобальні модифікатори (застосовні до всіх категорій). */
  public static Specification<PriceModifierEntity> isGlobal() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isEmpty(root.get("applicableTo"));
  }

  /** Категорія-специфічні модифікатори. */
  public static Specification<PriceModifierEntity> isCategorySpecific() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isNotEmpty(root.get("applicableTo"));
  }

  /** Високі відсоткові модифікатори (більше певного порогу). */
  public static Specification<PriceModifierEntity> highPercentage(Double threshold) {
    return isPercentage().and(valueBetween(threshold, null));
  }

  /** Великі фіксовані модифікатори (більше певного порогу). */
  public static Specification<PriceModifierEntity> highFixedAmount(Double threshold) {
    return isFixedAmount().and(valueBetween(threshold, null));
  }

  /** Пошук за кодом або назвою. */
  public static Specification<PriceModifierEntity> codeOrNameContains(String searchTerm) {
    return (root, query, criteriaBuilder) -> {
      if (searchTerm == null || searchTerm.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      String pattern = "%" + searchTerm.toLowerCase() + "%";
      return criteriaBuilder.or(
          criteriaBuilder.like(criteriaBuilder.lower(root.get("code")), pattern),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern));
    };
  }

  /** Сортування за кодом (A-Z). */
  public static Specification<PriceModifierEntity> orderByCode() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.asc(root.get("code")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за назвою (A-Z). */
  public static Specification<PriceModifierEntity> orderByName() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.asc(root.get("name")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за значенням (зростання). */
  public static Specification<PriceModifierEntity> orderByValueAsc() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.asc(root.get("value")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за значенням (спадання). */
  public static Specification<PriceModifierEntity> orderByValueDesc() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.desc(root.get("value")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за типом та значенням. */
  public static Specification<PriceModifierEntity> orderByTypeAndValue() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(
            criteriaBuilder.asc(root.get("modifierType")), criteriaBuilder.asc(root.get("value")));
      }
      return criteriaBuilder.conjunction();
    };
  }
}
