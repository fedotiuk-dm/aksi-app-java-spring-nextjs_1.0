package com.aksi.service.game.factory;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.ServiceTypeEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * Factory for creating calculation context maps used by modifier calculators and formula
 * evaluators. Centralizes context creation logic to avoid duplication.
 */
@Component
@Slf4j
public class CalculationContextFactory {

  /**
   * Create calculation context for game boosting price calculation.
   *
   * @param game Game entity
   * @param serviceType Service type entity
   * @param fromLevel From difficulty level entity
   * @param toLevel To difficulty level entity
   * @param basePrice Calculated base price in kopiykas
   * @return Context map for formula calculations
   */
  public Map<String, Object> createGameBoostingContext(
      GameEntity game,
      ServiceTypeEntity serviceType,
      DifficultyLevelEntity fromLevel,
      DifficultyLevelEntity toLevel,
      int basePrice) {

    Map<String, Object> context = new HashMap<>();

    // Basic price information
    context.put("basePrice", basePrice);

    // Level information
    context.put("fromLevel", fromLevel.getLevelValue());
    context.put("toLevel", toLevel.getLevelValue());
    context.put(
        "levelDifference", Math.max(0, toLevel.getLevelValue() - fromLevel.getLevelValue()));

    // Game and service information
    context.put("gameCode", game.getCode());
    context.put("gameName", game.getName());
    context.put("serviceType", serviceType.getCode());
    context.put("serviceTypeName", serviceType.getName());

    // Additional calculated values
    context.put("hasLevelProgression", fromLevel.getLevelValue() < toLevel.getLevelValue());
    context.put("isDowngrade", fromLevel.getLevelValue() > toLevel.getLevelValue());

    log.debug(
        "Created calculation context for game: {}, service: {}, levels: {}->{}",
        game.getCode(),
        serviceType.getCode(),
        fromLevel.getLevelValue(),
        toLevel.getLevelValue());

    return context;
  }

  /**
   * Create basic context with only essential information.
   *
   * @param basePrice Base price in kopiykas
   * @param levelDifference Number of levels to boost
   * @return Minimal context map
   */
  public Map<String, Object> createBasicContext(int basePrice, int levelDifference) {
    Map<String, Object> context = new HashMap<>();
    context.put("basePrice", basePrice);
    context.put("levelDifference", levelDifference);
    return context;
  }

  /**
   * Create empty context for calculations without formula modifiers.
   *
   * @return Empty context map
   */
  public Map<String, Object> createEmptyContext() {
    return new HashMap<>();
  }
}
