package com.aksi.service.game.util;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.repository.PriceConfigurationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Utility class for bulk operations on game entities. Provides reusable patterns for bulk updates
 * across game services.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BulkOperationUtils {

  private final PriceConfigurationRepository priceConfigurationRepository;

  /**
   * Bulk update price configurations for a game with multipliers.
   *
   * @param gameId Game ID
   * @param basePriceMultiplier Multiplier for base price
   * @param pricePerLevelMultiplier Multiplier for price per level
   * @return Number of updated configurations
   */
  public int bulkUpdatePriceConfigurations(
      UUID gameId, Double basePriceMultiplier, Double pricePerLevelMultiplier) {

    log.info(
        "Starting bulk update for game: {} with multipliers: base={}, perLevel={}",
        gameId,
        basePriceMultiplier,
        pricePerLevelMultiplier);

    // Get all active configurations for the game
    List<PriceConfigurationEntity> configurations =
        priceConfigurationRepository.findByGameIdAndActiveTrue(gameId);

    if (configurations.isEmpty()) {
      log.info("No active configurations found for game: {}", gameId);
      return 0;
    }

    // Apply multipliers
    for (PriceConfigurationEntity config : configurations) {
      applyPriceMultipliers(config, basePriceMultiplier, pricePerLevelMultiplier);
    }

    // Save all updated configurations
    priceConfigurationRepository.saveAll(configurations);

    log.info("Bulk updated {} price configurations for game: {}", configurations.size(), gameId);
    return configurations.size();
  }

  /**
   * Apply price multipliers to a configuration.
   *
   * @param config Price configuration entity
   * @param basePriceMultiplier Multiplier for base price
   * @param pricePerLevelMultiplier Multiplier for price per level
   */
  private void applyPriceMultipliers(
      PriceConfigurationEntity config, Double basePriceMultiplier, Double pricePerLevelMultiplier) {

    if (basePriceMultiplier != null && !basePriceMultiplier.equals(1.0)) {
      int newBasePrice =
          PriceValidationUtils.calculateMultipliedPrice(config.getBasePrice(), basePriceMultiplier);
      config.setBasePrice(newBasePrice);

      log.debug(
          "Updated base price for config {}: {} -> {}",
          config.getId(),
          config.getBasePrice(),
          newBasePrice);
    }

    if (pricePerLevelMultiplier != null && !pricePerLevelMultiplier.equals(1.0)) {
      int newPricePerLevel =
          PriceValidationUtils.calculateMultipliedPrice(
              config.getPricePerLevel(), pricePerLevelMultiplier);
      config.setPricePerLevel(newPricePerLevel);

      log.debug(
          "Updated price per level for config {}: {} -> {}",
          config.getId(),
          config.getPricePerLevel(),
          newPricePerLevel);
    }
  }

  /**
   * Bulk activate price configurations for a game.
   *
   * @param gameId Game ID
   * @return Number of activated configurations
   */
  public int bulkActivatePriceConfigurations(UUID gameId) {
    return bulkSetActiveStatus(gameId, true);
  }

  /**
   * Bulk deactivate price configurations for a game.
   *
   * @param gameId Game ID
   * @return Number of deactivated configurations
   */
  public int bulkDeactivatePriceConfigurations(UUID gameId) {
    return bulkSetActiveStatus(gameId, false);
  }

  /**
   * Bulk set active status for all configurations of a game.
   *
   * @param gameId Game ID
   * @param active New active status
   * @return Number of updated configurations
   */
  private int bulkSetActiveStatus(UUID gameId, boolean active) {
    log.info("Bulk setting active status to {} for all configurations of game: {}", active, gameId);

    List<PriceConfigurationEntity> configurations =
        priceConfigurationRepository.findByGameId(gameId);

    if (configurations.isEmpty()) {
      log.info("No configurations found for game: {}", gameId);
      return 0;
    }

    // Update active status
    configurations.forEach(config -> config.setActive(active));

    // Save all updated configurations
    priceConfigurationRepository.saveAll(configurations);

    log.info(
        "Bulk updated {} configurations active status to {} for game: {}",
        configurations.size(),
        active,
        gameId);
    return configurations.size();
  }

  /**
   * Get count of active configurations for a game.
   *
   * @param gameId Game ID
   * @return Count of active configurations
   */
  public long countActiveConfigurations(UUID gameId) {
    return priceConfigurationRepository.countActiveByGameId(gameId);
  }

  /**
   * Validate bulk operation parameters.
   *
   * @param gameId Game ID
   * @param basePriceMultiplier Base price multiplier
   * @param pricePerLevelMultiplier Price per level multiplier
   */
  public static void validateBulkOperationParameters(
      UUID gameId, Double basePriceMultiplier, Double pricePerLevelMultiplier) {

    if (gameId == null) {
      throw new IllegalArgumentException("Game ID cannot be null for bulk operations");
    }

    if (basePriceMultiplier != null && basePriceMultiplier < 0) {
      throw new IllegalArgumentException("Base price multiplier cannot be negative");
    }

    if (pricePerLevelMultiplier != null && pricePerLevelMultiplier < 0) {
      throw new IllegalArgumentException("Price per level multiplier cannot be negative");
    }

    if ((basePriceMultiplier == null || basePriceMultiplier.equals(1.0))
        && (pricePerLevelMultiplier == null || pricePerLevelMultiplier.equals(1.0))) {
      throw new IllegalArgumentException(
          "At least one multiplier must be provided and not equal to 1.0");
    }
  }
}
