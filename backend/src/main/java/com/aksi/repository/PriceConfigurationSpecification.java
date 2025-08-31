package com.aksi.repository;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.game.PriceConfigurationEntity;

public class PriceConfigurationSpecification {

  public static Specification<PriceConfigurationEntity> hasActive(Boolean active) {
    return (root, query, criteriaBuilder) -> {
      if (active == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("active"), active);
    };
  }

  public static Specification<PriceConfigurationEntity> hasGameId(UUID gameId) {
    return (root, query, criteriaBuilder) -> {
      if (gameId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("game").get("id"), gameId);
    };
  }

  public static Specification<PriceConfigurationEntity> hasServiceTypeId(UUID serviceTypeId) {
    return (root, query, criteriaBuilder) -> {
      if (serviceTypeId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("serviceType").get("id"), serviceTypeId);
    };
  }

  public static Specification<PriceConfigurationEntity> hasDifficultyLevelId(
      UUID difficultyLevelId) {
    return (root, query, criteriaBuilder) -> {
      if (difficultyLevelId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("difficultyLevel").get("id"), difficultyLevelId);
    };
  }

  public static Specification<PriceConfigurationEntity> hasCalculationType(String calculationType) {
    return (root, query, criteriaBuilder) -> {
      if (calculationType == null || calculationType.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("calculationType"), calculationType);
    };
  }

  public static Specification<PriceConfigurationEntity> hasCurrency(String currency) {
    return (root, query, criteriaBuilder) -> {
      if (currency == null || currency.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("currency"), currency);
    };
  }

  public static Specification<PriceConfigurationEntity> searchByGameName(String search) {
    return (root, query, criteriaBuilder) -> {
      if (search == null || search.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }

      String searchPattern = "%" + search.toLowerCase() + "%";
      return criteriaBuilder.like(
          criteriaBuilder.lower(root.get("game").get("name")), searchPattern);
    };
  }

  public static Specification<PriceConfigurationEntity> orderBySortOrder() {
    return (root, query, criteriaBuilder) -> {
      query.orderBy(criteriaBuilder.asc(root.get("sortOrder")));
      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<PriceConfigurationEntity> hasCombination(
      UUID gameId, UUID difficultyLevelId, UUID serviceTypeId) {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.and(
          gameId != null
              ? criteriaBuilder.equal(root.get("game").get("id"), gameId)
              : criteriaBuilder.conjunction(),
          difficultyLevelId != null
              ? criteriaBuilder.equal(root.get("difficultyLevel").get("id"), difficultyLevelId)
              : criteriaBuilder.conjunction(),
          serviceTypeId != null
              ? criteriaBuilder.equal(root.get("serviceType").get("id"), serviceTypeId)
              : criteriaBuilder.conjunction());
    };
  }
}
