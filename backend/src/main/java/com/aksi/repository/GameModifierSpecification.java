package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.api.game.dto.GameModifierType;
import com.aksi.domain.game.GameModifierEntity;

public class GameModifierSpecification {

  public static Specification<GameModifierEntity> hasActive(Boolean active) {
    return SpecificationUtils.hasActive(active);
  }

  public static Specification<GameModifierEntity> hasGameCode(String gameCode) {
    return (root, query, criteriaBuilder) -> {
      if (gameCode == null) {
        return criteriaBuilder.isNull(root.get("gameCode"));
      } else if (gameCode.trim().isEmpty() || "*".equals(gameCode)) {
        return criteriaBuilder.or(
            criteriaBuilder.isNull(root.get("gameCode")),
            criteriaBuilder.equal(root.get("gameCode"), ""),
            criteriaBuilder.equal(root.get("gameCode"), "*")
        );
      } else {
        return criteriaBuilder.equal(root.get("gameCode"), gameCode);
      }
    };
  }

  public static Specification<GameModifierEntity> searchByNameOrCode(String search) {
    return SpecificationUtils.searchByNameOrCode(search);
  }

  public static Specification<GameModifierEntity> orderBySortOrder() {
    return SpecificationUtils.orderBySortOrder();
  }

  /** Creates a specification for finding active modifiers for a game. */
  public static Specification<GameModifierEntity> findActiveModifiersForGame(String gameCode) {
    return Specification.allOf(
        hasActive(true),
        // Game-specific modifiers for this game OR game-agnostic modifiers (empty game_code)
        Specification.anyOf(hasGameCode(gameCode), hasGameCode(""), hasGameCode("*")),
        orderBySortOrder()
    );
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

      // Filter modifiers that have the specified service type code in their serviceTypeCodes collection
      // OR modifiers that have no service type codes specified (apply to all)
      return criteriaBuilder.or(
          criteriaBuilder.isMember(serviceTypeCode, root.get("serviceTypeCodes")),
          criteriaBuilder.isEmpty(root.get("serviceTypeCodes"))
      );
    };
  }

  /** Creates a specification for filtering modifiers with all parameters. */
  public static Specification<GameModifierEntity> filterModifiers(
      Boolean active, String gameCode, String search, GameModifierType type, String serviceTypeCode) {

    return Specification.allOf(
        hasActive(active),
        // If gameCode is null/empty, show both game-specific and game-agnostic modifiers
        // If gameCode is specified, show game-specific or game-agnostic modifiers
        gameCode == null || gameCode.trim().isEmpty()
            ? Specification.anyOf(hasGameCode(null), hasGameCode(""), hasGameCode("*"))
            : Specification.anyOf(hasGameCode(gameCode), hasGameCode(null), hasGameCode(""), hasGameCode("*")),
        hasType(type),
        hasServiceTypeCode(serviceTypeCode),
        searchByNameOrCode(search),
        orderBySortOrder());
  }
}
