package com.aksi.service.game.util;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.PriceConfigurationMapper;
import com.aksi.repository.PriceConfigurationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Utility class for PriceConfiguration business operations. Provides common operations like soft
 * delete, restore, activate/deactivate.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PriceConfigurationOperationUtils {

  private final PriceConfigurationRepository priceConfigurationRepository;
  private final PriceConfigurationMapper priceConfigurationMapper;

  /**
   * Soft delete a price configuration by setting it as inactive.
   *
   * @param priceConfigurationId Price configuration ID
   * @return Updated price configuration
   */
  public PriceConfiguration softDelete(UUID priceConfigurationId) {
    log.info("Soft deleting price configuration: {}", priceConfigurationId);

    PriceConfigurationEntity entity = findEntityById(priceConfigurationId);
    entity.setActive(false);

    PriceConfigurationEntity saved = priceConfigurationRepository.save(entity);
    log.info("Soft deleted price configuration: {}", priceConfigurationId);

    return priceConfigurationMapper.toPriceConfigurationDto(saved);
  }

  /**
   * Restore a soft deleted price configuration by setting it as active.
   *
   * @param priceConfigurationId Price configuration ID
   * @return Restored price configuration
   */
  public PriceConfiguration restore(UUID priceConfigurationId) {
    log.info("Restoring price configuration: {}", priceConfigurationId);

    PriceConfigurationEntity entity = findEntityById(priceConfigurationId);
    entity.setActive(true);

    PriceConfigurationEntity saved = priceConfigurationRepository.save(entity);
    log.info("Restored price configuration: {}", priceConfigurationId);

    return priceConfigurationMapper.toPriceConfigurationDto(saved);
  }

  /**
   * Toggle active status of a price configuration.
   *
   * @param priceConfigurationId Price configuration ID
   * @param active New active status
   * @return Updated price configuration
   */
  public PriceConfiguration setActive(UUID priceConfigurationId, boolean active) {
    log.info("Setting price configuration {} to active: {}", priceConfigurationId, active);

    PriceConfigurationEntity entity = findEntityById(priceConfigurationId);
    entity.setActive(active);

    PriceConfigurationEntity saved = priceConfigurationRepository.save(entity);
    log.info("Set price configuration {} active status to: {}", priceConfigurationId, active);

    return priceConfigurationMapper.toPriceConfigurationDto(saved);
  }

  /**
   * Check if price configuration can be deleted (business rules validation).
   *
   * @param priceConfigurationId Price configuration ID
   * @return true if can be deleted
   */
  public boolean canDelete(UUID priceConfigurationId) {
    log.debug("Checking if price configuration can be deleted: {}", priceConfigurationId);

    // Add business rules here:
    // - Check if referenced by active orders
    // - Check if referenced by active calculators
    // - Check if it's the last configuration for a game/service type combination

    // For now, always allow deletion (soft delete)
    return true;
  }

  /**
   * Find entity by ID with consistent error handling.
   *
   * @param priceConfigurationId Price configuration ID
   * @return Price configuration entity
   * @throws NotFoundException if not found
   */
  private PriceConfigurationEntity findEntityById(UUID priceConfigurationId) {
    return priceConfigurationRepository
        .findById(priceConfigurationId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Price configuration not found with id: " + priceConfigurationId));
  }
}
