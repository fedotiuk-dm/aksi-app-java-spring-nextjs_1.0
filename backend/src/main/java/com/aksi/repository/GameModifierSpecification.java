package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.api.game.dto.GameModifierType;
import com.aksi.domain.game.GameModifierEntity;

public class GameModifierSpecification {

  public static Specification<GameModifierEntity> hasActive(Boolean active) {
    return SpecificationUtils.hasActive(active);
  }

  public static Specification<GameModifierEntity> hasGameCode(String gameCode) {
    return (root, query, criteriaBuilder) ->
        gameCode == null ? null : criteriaBuilder.equal(root.get("gameCode"), gameCode);
  }

  public static Specification<GameModifierEntity> searchByNameOrCode(String search) {
    return SpecificationUtils.searchByNameOrCode(search);
  }

  public static Specification<GameModifierEntity> orderBySortOrder() {
    return SpecificationUtils.orderBySortOrder();
  }

  /** Creates a specification for finding active modifiers for a game. */
  public static Specification<GameModifierEntity> findActiveModifiersForGame(String gameCode) {
    return Specification.allOf(hasActive(true), hasGameCode(gameCode), orderBySortOrder());
  }

  /** Creates a specification for modifiers by type. */
  public static Specification<GameModifierEntity> hasType(GameModifierType type) {
    return SpecificationUtils.hasType(type);
  }

  /** Creates a specification for modifiers by service type codes. */
  public static Specification<GameModifierEntity> hasServiceTypeCode(String serviceTypeCode) {
    return (root, query, criteriaBuilder) -> {
      if (serviceTypeCode == null || serviceTypeCode.trim().isEmpty()) {
        return null; // No filtering
      }
      // Skip service type filtering for now - will filter on frontend
      return criteriaBuilder.conjunction(); // Always true
    };
  }

  /** Creates a specification for filtering modifiers with all parameters. */
  public static Specification<GameModifierEntity> filterModifiers(
      Boolean active, String gameCode, String search, GameModifierType type, String serviceTypeCode) {

    return Specification.allOf(
        hasActive(active),
        hasGameCode(gameCode),
        hasType(type),
        hasServiceTypeCode(serviceTypeCode),
        searchByNameOrCode(search),
        orderBySortOrder());
  }
}
