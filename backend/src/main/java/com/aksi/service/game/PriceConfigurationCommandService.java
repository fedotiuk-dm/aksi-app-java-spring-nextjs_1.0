package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.PriceConfigurationRepository;
import com.aksi.service.game.factory.PriceConfigurationFactory;
import com.aksi.service.game.util.PriceConfigurationOperationUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for price configuration-related write operations. Provides basic write operations
 * used by the main service layer.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PriceConfigurationCommandService {

  private final PriceConfigurationRepository priceConfigurationRepository;
  private final PriceConfigurationValidationService validationService;
  private final PriceConfigurationFactory priceConfigurationFactory;
  private final PriceConfigurationOperationUtils priceConfigurationOperationUtils;

  /**
   * Create a new price configuration.
   *
   * @param request Create price configuration request
   * @return Created price configuration
   * @throws ConflictException if price configuration with same combination already exists
   * @throws NotFoundException if related entities not found
   */
  public PriceConfiguration createPriceConfiguration(CreatePriceConfigurationRequest request) {
    log.info(
        "Creating price configuration for game: {}, difficulty: {}, service: {}",
        request.getGameId(),
        request.getDifficultyLevelId(),
        request.getServiceTypeId());

    // Validate request
    validationService.validateForCreate(request);

    // Create entity using factory
    PriceConfigurationEntity entity = priceConfigurationFactory.createEntity(request);

    // Save entity
    PriceConfigurationEntity savedEntity = priceConfigurationRepository.save(entity);
    log.info("Created price configuration with id: {}", savedEntity.getId());

    return priceConfigurationFactory.toDto(savedEntity);
  }

  /**
   * Update an existing price configuration.
   *
   * @param priceConfigurationId Price configuration ID
   * @param request Update price configuration request
   * @return Updated price configuration
   * @throws NotFoundException if price configuration not found
   * @throws ConflictException if update would create duplicate combination
   */
  public PriceConfiguration updatePriceConfiguration(
      UUID priceConfigurationId, UpdatePriceConfigurationRequest request) {
    log.info("Updating price configuration with id: {}", priceConfigurationId);

    // Validate request
    validationService.validateForUpdate(priceConfigurationId, request);

    // Get existing entity
    PriceConfigurationEntity existingEntity =
        priceConfigurationRepository
            .findById(priceConfigurationId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Price configuration not found with id: " + priceConfigurationId));

    // Update entity using factory
    PriceConfigurationEntity updatedEntity =
        priceConfigurationFactory.updateEntity(existingEntity, request);

    // Save updated entity
    PriceConfigurationEntity savedEntity = priceConfigurationRepository.save(updatedEntity);
    log.info("Updated price configuration with id: {}", savedEntity.getId());

    return priceConfigurationFactory.toDto(savedEntity);
  }

  /**
   * Soft delete a price configuration by setting it as inactive.
   *
   * @param priceConfigurationId Price configuration ID
   * @throws NotFoundException if price configuration not found
   */
  public void deletePriceConfiguration(UUID priceConfigurationId) {
    priceConfigurationOperationUtils.softDelete(priceConfigurationId);
  }
}
