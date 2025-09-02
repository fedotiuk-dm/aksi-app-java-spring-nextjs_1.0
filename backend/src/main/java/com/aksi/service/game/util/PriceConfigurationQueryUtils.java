package com.aksi.service.game.util;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.repository.PriceConfigurationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Utility class for PriceConfiguration query operations. Provides optimized query strategies based
 * on parameters.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PriceConfigurationQueryUtils {

  private final PriceConfigurationRepository priceConfigurationRepository;

  /**
   * Get price configurations with optimized query strategy based on parameters.
   *
   * @param gameId Game ID filter (optional)
   * @param pageable Pagination and sorting
   * @return Page of price configurations
   */
  public Page<PriceConfigurationEntity> getPriceConfigurations(UUID gameId, Pageable pageable) {
    if (gameId != null) {
      log.debug("Using optimized query for game-specific price configurations: {}", gameId);
      return priceConfigurationRepository.findActiveByGameIdOrderBySortOrder(gameId, pageable);
    } else {
      log.debug("Using optimized query for all active price configurations");
      return priceConfigurationRepository.findAllActiveOrderBySortOrder(pageable);
    }
  }

  /**
   * Check if combination already exists (for uniqueness validation).
   *
   * @param gameId Game ID
   * @param difficultyLevelId Difficulty level ID
   * @param serviceTypeId Service type ID
   * @return true if combination exists
   */
  public boolean combinationExists(UUID gameId, UUID difficultyLevelId, UUID serviceTypeId) {
    return priceConfigurationRepository
        .findByIdsAndActive(gameId, difficultyLevelId, serviceTypeId)
        .isPresent();
  }

  /**
   * Check if combination exists excluding specific configuration (for update validation).
   *
   * @param gameId Game ID
   * @param difficultyLevelId Difficulty level ID
   * @param serviceTypeId Service type ID
   * @param excludeConfigurationId Configuration ID to exclude
   * @return true if combination exists for other configurations
   */
  public boolean combinationExistsExcluding(
      UUID gameId, UUID difficultyLevelId, UUID serviceTypeId, UUID excludeConfigurationId) {
    return priceConfigurationRepository
        .findByIdsAndActive(gameId, difficultyLevelId, serviceTypeId)
        .map(existing -> !existing.getId().equals(excludeConfigurationId))
        .orElse(false);
  }
}
