package com.aksi.domain.item.repository;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.item.entity.PriceListItemEntity;

/**
 * JPA Specifications для PriceListItemEntity. Замінює складні @Query методи на type-safe Criteria
 * API.
 */
public class PriceListItemSpecification {

  /** Активні предмети. */
  public static Specification<PriceListItemEntity> isActive() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("isActive"));
  }

  /** Неактивні предмети. */
  public static Specification<PriceListItemEntity> isInactive() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isFalse(root.get("isActive"));
  }

  /** Предмети за категорією. */
  public static Specification<PriceListItemEntity> belongsToCategory(UUID categoryId) {
    return (root, query, criteriaBuilder) -> {
      if (categoryId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("categoryId"), categoryId);
    };
  }

  /** Предмети за назвою (містить). */
  public static Specification<PriceListItemEntity> nameContains(String searchTerm) {
    return (root, query, criteriaBuilder) -> {
      if (searchTerm == null || searchTerm.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.like(
          criteriaBuilder.lower(root.get("name")), "%" + searchTerm.toLowerCase() + "%");
    };
  }

  /** Предмети за одиницею виміру. */
  public static Specification<PriceListItemEntity> hasUnitOfMeasure(String unitOfMeasure) {
    return (root, query, criteriaBuilder) -> {
      if (unitOfMeasure == null || unitOfMeasure.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("unitOfMeasure"), unitOfMeasure);
    };
  }

  /** Предмети в діапазоні базової ціни. */
  public static Specification<PriceListItemEntity> basePriceBetween(
      Double minPrice, Double maxPrice) {
    return (root, query, criteriaBuilder) -> {
      if (minPrice == null && maxPrice == null) {
        return criteriaBuilder.conjunction();
      }
      if (minPrice == null) {
        return criteriaBuilder.lessThanOrEqualTo(root.get("basePrice"), maxPrice);
      }
      if (maxPrice == null) {
        return criteriaBuilder.greaterThanOrEqualTo(root.get("basePrice"), minPrice);
      }
      return criteriaBuilder.between(root.get("basePrice"), minPrice, maxPrice);
    };
  }

  /** Предмети з кольоровим-специфічними цінами. */
  public static Specification<PriceListItemEntity> hasColorSpecificPricing() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.or(
            criteriaBuilder.isNotNull(root.get("priceBlack")),
            criteriaBuilder.isNotNull(root.get("priceColor")));
  }

  /** Предмети без кольорових цін. */
  public static Specification<PriceListItemEntity> hasNoColorPricing() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.and(
            criteriaBuilder.isNull(root.get("priceBlack")),
            criteriaBuilder.isNull(root.get("priceColor")));
  }

  /** Предмети з ціною чорного більше базової. */
  public static Specification<PriceListItemEntity> blackPriceHigherThanBase() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.greaterThan(root.get("priceBlack"), root.get("basePrice"));
  }

  /** Предмети з ціною кольорового більше базової. */
  public static Specification<PriceListItemEntity> colorPriceHigherThanBase() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.greaterThan(root.get("priceColor"), root.get("basePrice"));
  }

  /** Швидкий пошук для Order Wizard. */
  public static Specification<PriceListItemEntity> quickSearch(UUID categoryId, String searchTerm) {
    return isActive().and(belongsToCategory(categoryId)).and(nameContains(searchTerm));
  }

  /** Предмети з каталоговим номером в діапазоні. */
  public static Specification<PriceListItemEntity> catalogNumberBetween(
      Integer minNumber, Integer maxNumber) {
    return (root, query, criteriaBuilder) -> {
      if (minNumber == null && maxNumber == null) {
        return criteriaBuilder.conjunction();
      }
      if (minNumber == null) {
        return criteriaBuilder.lessThanOrEqualTo(root.get("catalogNumber"), maxNumber);
      }
      if (maxNumber == null) {
        return criteriaBuilder.greaterThanOrEqualTo(root.get("catalogNumber"), minNumber);
      }
      return criteriaBuilder.between(root.get("catalogNumber"), minNumber, maxNumber);
    };
  }

  /** Дублікати за назвою в межах категорії. */
  public static Specification<PriceListItemEntity> duplicateNamesInCategory(UUID categoryId) {
    return (root, query, criteriaBuilder) -> {
      if (categoryId == null || query == null) {
        return criteriaBuilder.conjunction();
      }

      // Підзапит для знаходження назв що повторюються
      var subquery = query.subquery(String.class);
      var subRoot = subquery.from(PriceListItemEntity.class);

      subquery
          .select(subRoot.get("name"))
          .where(criteriaBuilder.equal(subRoot.get("categoryId"), categoryId))
          .groupBy(subRoot.get("name"))
          .having(criteriaBuilder.greaterThan(criteriaBuilder.count(subRoot), 1L));

      return criteriaBuilder.and(
          criteriaBuilder.equal(root.get("categoryId"), categoryId),
          criteriaBuilder.in(root.get("name")).value(subquery));
    };
  }

  /** Сортування за назвою (A-Z). */
  public static Specification<PriceListItemEntity> orderByName() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.asc(root.get("name")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за каталоговим номером. */
  public static Specification<PriceListItemEntity> orderByCatalogNumber() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.asc(root.get("catalogNumber")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за базовою ціною (зростання). */
  public static Specification<PriceListItemEntity> orderByPriceAsc() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.asc(root.get("basePrice")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за базовою ціною (спадання). */
  public static Specification<PriceListItemEntity> orderByPriceDesc() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.desc(root.get("basePrice")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Предмети що вимірюються в штуках. */
  public static Specification<PriceListItemEntity> measuredInPieces() {
    return hasUnitOfMeasure("шт");
  }

  /** Предмети що вимірюються в кілограмах. */
  public static Specification<PriceListItemEntity> measuredInKilograms() {
    return hasUnitOfMeasure("кг");
  }

  /** Предмети що вимірюються в парах. */
  public static Specification<PriceListItemEntity> measuredInPairs() {
    return hasUnitOfMeasure("пара");
  }

  /** Предмети що вимірюються в квадратних метрах. */
  public static Specification<PriceListItemEntity> measuredInSquareMeters() {
    return hasUnitOfMeasure("кв.м");
  }
}
