package com.aksi.repository;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.game.DifficultyLevelEntity;

public class DifficultyLevelSpecification {

  public static Specification<DifficultyLevelEntity> hasActive(Boolean active) {
    return SpecificationUtils.hasActive(active);
  }

  public static Specification<DifficultyLevelEntity> hasGameId(UUID gameId) {
    return SpecificationUtils.hasGameId(gameId);
  }

  public static Specification<DifficultyLevelEntity> searchByNameOrCode(String search) {
    return SpecificationUtils.searchByNameOrCode(search);
  }

  public static Specification<DifficultyLevelEntity> orderBySortOrder() {
    return SpecificationUtils.orderBySortOrder();
  }

  /** Creates a specification for filtering difficulty levels with search and pagination. */
  public static Specification<DifficultyLevelEntity> filterDifficultyLevels(
      Boolean active, UUID gameId, String search) {

    return Specification.allOf(
        hasActive(active), hasGameId(gameId), searchByNameOrCode(search), orderBySortOrder());
  }
}
