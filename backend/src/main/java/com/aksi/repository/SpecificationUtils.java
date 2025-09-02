package com.aksi.repository;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.game.ServiceTypeEntity;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;

/**
 * Utility class for JPA Specifications to handle common patterns safely. Contains reusable
 * specification patterns to reduce code duplication.
 */
public class SpecificationUtils {

  // ========== COMMON FIELD SPECIFICATIONS ==========

  /**
   * Creates a specification for filtering by active status.
   *
   * @param active the active status (null means no filtering)
   * @return Specification for active filtering
   */
  public static <T> Specification<T> hasActive(Boolean active) {
    return (root, query, criteriaBuilder) -> {
      if (active == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("active"), active);
    };
  }

  /**
   * Creates a specification for filtering by code.
   *
   * @param code the code value (null or empty means no filtering)
   * @return Specification for code filtering
   */
  public static <T> Specification<T> hasCode(String code) {
    return (root, query, criteriaBuilder) -> {
      if (code == null || code.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("code"), code);
    };
  }

  // ========== RELATIONSHIP SPECIFICATIONS ==========

  /**
   * Creates a specification for filtering by game ID through relationship.
   *
   * @param gameId the game ID (null means no filtering)
   * @return Specification for game ID filtering
   */
  public static <T> Specification<T> hasGameId(UUID gameId) {
    return (root, query, criteriaBuilder) -> {
      if (gameId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("game").get("id"), gameId);
    };
  }

  /**
   * Creates a specification for filtering by difficulty level ID through relationship.
   *
   * @param difficultyLevelId the difficulty level ID (null means no filtering)
   * @return Specification for difficulty level ID filtering
   */
  public static <T> Specification<T> hasDifficultyLevelId(UUID difficultyLevelId) {
    return (root, query, criteriaBuilder) -> {
      if (difficultyLevelId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("difficultyLevel").get("id"), difficultyLevelId);
    };
  }

  /**
   * Creates a specification for filtering by service type ID through relationship.
   *
   * @param serviceTypeId the service type ID (null means no filtering)
   * @return Specification for service type ID filtering
   */
  public static <T> Specification<T> hasServiceTypeId(UUID serviceTypeId) {
    return (root, query, criteriaBuilder) -> {
      if (serviceTypeId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("serviceType").get("id"), serviceTypeId);
    };
  }

  // ========== SEARCH SPECIFICATIONS ==========

  /**
   * Creates a specification for searching by name or code fields.
   *
   * @param search the search term (null or empty means no filtering)
   * @return Specification for name/code search
   */
  public static <T> Specification<T> searchByNameOrCode(String search) {
    return (root, query, criteriaBuilder) -> {
      if (search == null || search.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }

      String searchPattern = "%" + search.toLowerCase() + "%";
      return criteriaBuilder.or(
          criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern),
          criteriaBuilder.like(criteriaBuilder.lower(root.get("code")), searchPattern));
    };
  }

  // ========== ORDERING SPECIFICATIONS ==========

  /**
   * Creates a specification for ordering by sort order (ascending).
   *
   * @return Specification for sort order ordering
   */
  public static <T> Specification<T> orderBySortOrder() {
    return orderBy("sortOrder", true);
  }

  /**
   * Creates a specification for ordering by rating (descending).
   *
   * @return Specification for rating ordering
   */
  public static <T> Specification<T> orderByRating() {
    return orderBy("rating", false);
  }

  /**
   * Creates a specification for filtering by rating greater than or equal to.
   *
   * @param minRating the minimum rating (null means no filtering)
   * @return Specification for rating filtering
   */
  public static <T> Specification<T> hasRatingGreaterThan(Float minRating) {
    return (root, query, criteriaBuilder) -> {
      if (minRating == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), minRating);
    };
  }

  /**
   * Creates a specification for filtering by enum type field.
   *
   * @param type the enum value (null means no filtering)
   * @return Specification for type filtering
   */
  public static <T, E extends Enum<E>> Specification<T> hasType(E type) {
    return (root, query, criteriaBuilder) -> {
      if (type == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("type"), type);
    };
  }

  /**
   * Creates a specification for filtering by category restrictions containing a specific code.
   *
   * @param categoryCode the category code (null or empty means no filtering)
   * @return Specification for category filtering
   */
  public static <T> Specification<T> hasCategoryRestriction(String categoryCode) {
    return (root, query, criteriaBuilder) -> {
      if (categoryCode == null || categoryCode.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.isMember(categoryCode, root.get("categoryRestrictions"));
    };
  }

  /**
   * Creates a specification for filtering by isDefault field.
   *
   * @param isDefault the isDefault value (null means no filtering)
   * @return Specification for isDefault filtering
   */
  public static <T> Specification<T> hasIsDefault(Boolean isDefault) {
    return (root, query, criteriaBuilder) -> {
      if (isDefault == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("isDefault"), isDefault);
    };
  }

  /**
   * Creates a specification for distinct game categories.
   *
   * @return Specification for distinct game categories projection
   */
  public static Specification<ServiceTypeEntity> findDistinctGameCategories() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.distinct(true);
      }
      return criteriaBuilder.conjunction();
    };
  }

  /**
   * Creates a specification for ordering by category and catalog number.
   *
   * @return Specification for category and catalog number ordering
   */
  public static <T> Specification<T> orderByCategoryAndCatalogNumber() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(
            criteriaBuilder.asc(root.get("categoryCode")),
            criteriaBuilder.asc(root.get("catalogNumber")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /**
   * Creates a specification for ordering by sort order and name.
   *
   * @return Specification for sort order and name ordering
   */
  public static <T> Specification<T> orderBySortOrderAndName() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(
            criteriaBuilder.asc(root.get("sortOrder")), criteriaBuilder.asc(root.get("name")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  // ========== COMPOSITE SPECIFICATIONS ==========

  /**
   * Creates a specification that combines multiple specifications with AND logic. Filters out null
   * specifications automatically.
   *
   * @param specs array of specifications to combine
   * @return Combined specification or conjunction if empty
   */
  @SafeVarargs
  public static <T> Specification<T> allOf(Specification<T>... specs) {
    return (root, query, criteriaBuilder) -> {
      var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

      for (Specification<T> spec : specs) {
        if (spec != null) {
          var predicate = spec.toPredicate(root, query, criteriaBuilder);
          if (predicate != null) {
            predicates.add(predicate);
          }
        }
      }

      return predicates.isEmpty()
          ? criteriaBuilder.conjunction()
          : criteriaBuilder.and(predicates.toArray(jakarta.persistence.criteria.Predicate[]::new));
    };
  }

  /**
   * Safely applies ordering to a query, checking for null query parameter. This prevents NPE when
   * specification is used for count operations.
   *
   * @param query the CriteriaQuery (may be null for count operations)
   * @param criteriaBuilder the CriteriaBuilder
   * @param path the path to order by
   * @param ascending true for ascending order, false for descending
   */
  public static <T> void safeOrderBy(
      CriteriaQuery<T> query, CriteriaBuilder criteriaBuilder, Path<?> path, boolean ascending) {

    if (query != null) {
      if (ascending) {
        query.orderBy(criteriaBuilder.asc(path));
      } else {
        query.orderBy(criteriaBuilder.desc(path));
      }
    }
  }

  /**
   * Creates a safe ordering specification that handles null query gracefully.
   *
   * @param fieldName the field name to order by
   * @param ascending true for ascending order, false for descending
   * @return Specification that applies ordering safely
   */
  public static <T> Specification<T> orderBy(String fieldName, boolean ascending) {
    return (root, query, criteriaBuilder) -> {
      safeOrderBy(query, criteriaBuilder, root.get(fieldName), ascending);
      return criteriaBuilder.conjunction();
    };
  }
}
