package com.aksi.repository;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.game.DifficultyLevelEntity;

public class DifficultyLevelSpecification {

  public static Specification<DifficultyLevelEntity> hasActive(Boolean active) {
    return (root, query, criteriaBuilder) -> {
      if (active == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("active"), active);
    };
  }

  public static Specification<DifficultyLevelEntity> hasGameId(UUID gameId) {
    return (root, query, criteriaBuilder) -> {
      if (gameId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("game").get("id"), gameId);
    };
  }

  public static Specification<DifficultyLevelEntity> searchByNameOrCode(String search) {
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

  public static Specification<DifficultyLevelEntity> orderBySortOrder() {
    return (root, query, criteriaBuilder) -> {
      query.orderBy(criteriaBuilder.asc(root.get("sortOrder")));
      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<DifficultyLevelEntity> hasCode(String code) {
    return (root, query, criteriaBuilder) -> {
      if (code == null || code.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("code"), code);
    };
  }
}
