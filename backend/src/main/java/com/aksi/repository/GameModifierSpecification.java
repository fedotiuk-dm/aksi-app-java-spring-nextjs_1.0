package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.api.game.dto.GameModifierOperation;
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

  /** Creates a specification for modifiers by operation. */
  public static Specification<GameModifierEntity> hasOperation(GameModifierOperation operation) {
    return (root, query, criteriaBuilder) -> {
      if (operation == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("operation"), operation);
    };
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
      Boolean active, String gameCode, String search, GameModifierType type,
      String serviceTypeCode, GameModifierOperation operation) {

    var specs = new java.util.ArrayList<Specification<GameModifierEntity>>();

    // Active filter - if null, show all; if true/false, filter accordingly
    if (active != null) {
      specs.add(hasActive(active));
    }

    // Game code filter - show all modifiers if gameCode is null/empty
    // Otherwise, show modifiers for specific game OR game-agnostic modifiers
    if (gameCode != null && !gameCode.trim().isEmpty()) {
      specs.add(Specification.anyOf(hasGameCode(gameCode), hasGameCode(null), hasGameCode(""), hasGameCode("*")));
    }

    // Type filter
    if (type != null) {
      specs.add(hasType(type));
    }

    // Operation filter
    if (operation != null) {
      specs.add(hasOperation(operation));
    }

    // Service type filter
    if (serviceTypeCode != null && !serviceTypeCode.trim().isEmpty()) {
      specs.add(hasServiceTypeCode(serviceTypeCode));
    }

    // Search filter
    if (search != null && !search.trim().isEmpty()) {
      specs.add(searchByNameOrCode(search));
    }

    // Always order by sort order
    specs.add(orderBySortOrder());

    return Specification.allOf(specs);
  }
}
