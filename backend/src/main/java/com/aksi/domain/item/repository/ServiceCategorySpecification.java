package com.aksi.domain.item.repository;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.item.entity.ServiceCategoryEntity;

import jakarta.persistence.criteria.JoinType;

/**
 * JPA Specifications для ServiceCategoryEntity. Замінює складні @Query методи на type-safe Criteria
 * API.
 */
public class ServiceCategorySpecification {

  /** Активні категорії. */
  public static Specification<ServiceCategoryEntity> isActive() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("isActive"));
  }

  /** Неактивні категорії. */
  public static Specification<ServiceCategoryEntity> isInactive() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isFalse(root.get("isActive"));
  }

  /** Категорії за кодом (містить). */
  public static Specification<ServiceCategoryEntity> codeContains(String code) {
    return (root, query, criteriaBuilder) -> {
      if (code == null || code.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.like(
          criteriaBuilder.lower(root.get("code")), "%" + code.toLowerCase() + "%");
    };
  }

  /** Категорії за назвою (містить). */
  public static Specification<ServiceCategoryEntity> nameContains(String name) {
    return (root, query, criteriaBuilder) -> {
      if (name == null || name.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.like(
          criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    };
  }

  /** Пошук за назвою або кодом. */
  public static Specification<ServiceCategoryEntity> nameOrCodeContains(String searchTerm) {
    return (root, query, criteriaBuilder) -> {
      if (searchTerm == null || searchTerm.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      String pattern = "%" + searchTerm.toLowerCase() + "%";
      return criteriaBuilder.or(
          criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("code")), pattern));
    };
  }

  /** Батьківські категорії (без parentId). */
  public static Specification<ServiceCategoryEntity> isParentCategory() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get("parentId"));
  }

  /** Дочірні категорії за parentId. */
  public static Specification<ServiceCategoryEntity> hasParent(UUID parentId) {
    return (root, query, criteriaBuilder) -> {
      if (parentId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("parentId"), parentId);
    };
  }

  /** Категорії з терміном виконання менше або рівно вказаному. */
  public static Specification<ServiceCategoryEntity> standardDaysLessThanOrEqual(Integer maxDays) {
    return (root, query, criteriaBuilder) -> {
      if (maxDays == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.lessThanOrEqualTo(root.get("standardDays"), maxDays);
    };
  }

  /** Категорії що підтримують певний матеріал. */
  public static Specification<ServiceCategoryEntity> supportsMaterial(String materialType) {
    return (root, query, criteriaBuilder) -> {
      if (materialType == null || materialType.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.isMember(materialType, root.get("availableMaterials"));
    };
  }

  /** Категорії що підтримують певний модифікатор. */
  public static Specification<ServiceCategoryEntity> supportsModifier(UUID modifierId) {
    return (root, query, criteriaBuilder) -> {
      if (modifierId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.isMember(modifierId, root.get("availableModifiers"));
    };
  }

  /** Категорії з активними предметами. */
  public static Specification<ServiceCategoryEntity> hasActiveItems() {
    return (root, query, criteriaBuilder) -> {
      if (query == null) {
        return criteriaBuilder.conjunction();
      }
      // Підзапит для підрахунку активних предметів
      var subquery = query.subquery(Long.class);
      var itemRoot = subquery.from(root.getJavaType());
      var itemJoin = itemRoot.join("items", JoinType.LEFT);

      subquery
          .select(criteriaBuilder.count(itemJoin))
          .where(
              criteriaBuilder.equal(itemRoot.get("id"), root.get("id")),
              criteriaBuilder.isTrue(itemJoin.get("isActive")));

      return criteriaBuilder.greaterThan(subquery, 0L);
    };
  }

  /** Категорії без активних предметів (можна видаляти). */
  public static Specification<ServiceCategoryEntity> isDeletable() {
    return isInactive().and(hasNoActiveItems());
  }

  /** Категорії без активних предметів. */
  public static Specification<ServiceCategoryEntity> hasNoActiveItems() {
    return (root, query, criteriaBuilder) -> {
      if (query == null) {
        return criteriaBuilder.conjunction();
      }
      var subquery = query.subquery(Long.class);
      var itemRoot = subquery.from(root.getJavaType());
      var itemJoin = itemRoot.join("items", JoinType.LEFT);

      subquery
          .select(criteriaBuilder.count(itemJoin))
          .where(
              criteriaBuilder.equal(itemRoot.get("id"), root.get("id")),
              criteriaBuilder.isTrue(itemJoin.get("isActive")));

      return criteriaBuilder.equal(subquery, 0L);
    };
  }

  /** Сортування за назвою (A-Z). */
  public static Specification<ServiceCategoryEntity> orderByName() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.asc(root.get("name")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за ієрархією (батьки першими, потім діти). */
  public static Specification<ServiceCategoryEntity> orderByHierarchy() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(
            criteriaBuilder.asc(
                criteriaBuilder
                    .selectCase()
                    .when(criteriaBuilder.isNull(root.get("parentId")), 0)
                    .otherwise(1)),
            criteriaBuilder.asc(root.get("name")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за популярністю (кількістю предметів). */
  public static Specification<ServiceCategoryEntity> orderByPopularity() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        var itemJoin = root.join("items", JoinType.LEFT);
        query
            .groupBy(root.get("id"))
            .orderBy(criteriaBuilder.desc(criteriaBuilder.count(itemJoin)));
      }
      return criteriaBuilder.conjunction();
    };
  }
}
