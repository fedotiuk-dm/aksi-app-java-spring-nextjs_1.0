package com.aksi.service.game.util;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.PriceConfigurationMapper;
import com.aksi.repository.PriceConfigurationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Utility class for common entity update operations. Provides reusable patterns for
 * activate/deactivate operations across game services.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EntityUpdateUtils {

  private final PriceConfigurationRepository priceConfigurationRepository;
  private final PriceConfigurationMapper priceConfigurationMapper;

  /**
   * Activate a price configuration by ID.
   *
   * @param priceConfigurationId Price configuration ID
   * @return Updated price configuration DTO
   */
  public PriceConfiguration activatePriceConfiguration(UUID priceConfigurationId) {
    log.info("Activating price configuration: {}", priceConfigurationId);

    var entity =
        priceConfigurationRepository
            .findById(priceConfigurationId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Price configuration not found: " + priceConfigurationId));

    entity.setActive(true);
    var saved = priceConfigurationRepository.save(entity);

    log.info("Activated price configuration: {}", priceConfigurationId);
    return priceConfigurationMapper.toPriceConfigurationDto(saved);
  }

  /**
   * Deactivate a price configuration by ID.
   *
   * @param priceConfigurationId Price configuration ID
   * @return Updated price configuration DTO
   */
  public PriceConfiguration deactivatePriceConfiguration(UUID priceConfigurationId) {
    log.info("Deactivating price configuration: {}", priceConfigurationId);

    var entity =
        priceConfigurationRepository
            .findById(priceConfigurationId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Price configuration not found: " + priceConfigurationId));

    entity.setActive(false);
    var saved = priceConfigurationRepository.save(entity);

    log.info("Deactivated price configuration: {}", priceConfigurationId);
    return priceConfigurationMapper.toPriceConfigurationDto(saved);
  }

  /**
   * Toggle active status of a price configuration.
   *
   * @param priceConfigurationId Price configuration ID
   * @param active New active status
   * @return Updated price configuration DTO
   */
  public PriceConfiguration setActive(UUID priceConfigurationId, boolean active) {
    return active
        ? activatePriceConfiguration(priceConfigurationId)
        : deactivatePriceConfiguration(priceConfigurationId);
  }
}
