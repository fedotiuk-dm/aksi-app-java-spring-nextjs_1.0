package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.game.GameEntity;

public class GameSpecification {

  public static Specification<GameEntity> hasActive(Boolean active) {
    return SpecificationUtils.hasActive(active);
  }

  public static Specification<GameEntity> searchByNameOrCode(String search) {
    return SpecificationUtils.searchByNameOrCode(search);
  }

  public static Specification<GameEntity> orderBySortOrder() {
    return SpecificationUtils.orderBySortOrder();
  }

  /** Creates a specification for finding active games ordered by sort order. */
  public static Specification<GameEntity> findActiveOrderedBySortOrder() {
    return Specification.allOf(hasActive(true), orderBySortOrder());
  }

  /** Creates a specification for filtering games with search and pagination. */
  public static Specification<GameEntity> filterGames(Boolean active, String search) {
    return Specification.allOf(hasActive(active), searchByNameOrCode(search), orderBySortOrder());
  }
}
