package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.game.GameEntity;

public class GameSpecification {

  public static Specification<GameEntity> hasActive(Boolean active) {
    return (root, query, criteriaBuilder) -> {
      if (active == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("active"), active);
    };
  }

  public static Specification<GameEntity> hasCategory(String category) {
    return (root, query, criteriaBuilder) -> {
      if (category == null || category.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("category"), category);
    };
  }

  public static Specification<GameEntity> searchByNameOrCode(String search) {
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

  public static Specification<GameEntity> orderBySortOrder() {
    return (root, query, criteriaBuilder) -> {
      query.orderBy(criteriaBuilder.asc(root.get("sortOrder")));
      return criteriaBuilder.conjunction();
    };
  }
}
