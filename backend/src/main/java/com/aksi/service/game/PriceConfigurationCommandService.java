package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;
import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.PriceConfigurationMapper;
import com.aksi.repository.DifficultyLevelRepository;
import com.aksi.repository.GameRepository;
import com.aksi.repository.PriceConfigurationRepository;
import com.aksi.repository.ServiceTypeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for price configuration-related write operations. All methods are write-only and
 * optimized for creating, updating, and deleting price configurations.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PriceConfigurationCommandService {

  private final PriceConfigurationRepository priceConfigurationRepository;
  private final PriceConfigurationMapper priceConfigurationMapper;
  private final PriceConfigurationValidationService validationService;
  private final GameRepository gameRepository;
  private final DifficultyLevelRepository difficultyLevelRepository;
  private final ServiceTypeRepository serviceTypeRepository;

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

    // Find required entities using utility
    GameEntity game =
        gameRepository
            .findById(request.getGameId())
            .orElseThrow(() -> new NotFoundException("Game not found: " + request.getGameId()));
    DifficultyLevelEntity difficultyLevel =
        difficultyLevelRepository
            .findById(request.getDifficultyLevelId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Difficulty level not found: " + request.getDifficultyLevelId()));
    ServiceTypeEntity serviceType =
        serviceTypeRepository
            .findById(request.getServiceTypeId())
            .orElseThrow(
                () ->
                    new NotFoundException("Service type not found: " + request.getServiceTypeId()));

    // Create entity
    PriceConfigurationEntity entity = priceConfigurationMapper.toPriceConfigurationEntity(request);
    entity.setGame(game);
    entity.setDifficultyLevel(difficultyLevel);
    entity.setServiceType(serviceType);

    PriceConfigurationEntity savedEntity = priceConfigurationRepository.save(entity);
    log.info("Created price configuration with id: {}", savedEntity.getId());

    return priceConfigurationMapper.toPriceConfigurationDto(savedEntity);
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

    // Find required entities using utility
    GameEntity game =
        gameRepository
            .findById(request.getGameId())
            .orElseThrow(() -> new NotFoundException("Game not found: " + request.getGameId()));
    DifficultyLevelEntity difficultyLevel =
        difficultyLevelRepository
            .findById(request.getDifficultyLevelId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Difficulty level not found: " + request.getDifficultyLevelId()));
    ServiceTypeEntity serviceType =
        serviceTypeRepository
            .findById(request.getServiceTypeId())
            .orElseThrow(
                () ->
                    new NotFoundException("Service type not found: " + request.getServiceTypeId()));

    // Update fields
    existingEntity.setGame(game);
    existingEntity.setDifficultyLevel(difficultyLevel);
    existingEntity.setServiceType(serviceType);
    existingEntity.setBasePrice(request.getBasePrice());
    existingEntity.setPricePerLevel(request.getPricePerLevel());
    existingEntity.setCalculationFormula(request.getCalculationFormula());
    existingEntity.setActive(request.getActive());

    PriceConfigurationEntity savedEntity = priceConfigurationRepository.save(existingEntity);
    log.info("Updated price configuration with id: {}", savedEntity.getId());

    return priceConfigurationMapper.toPriceConfigurationDto(savedEntity);
  }

  /**
   * Soft delete a price configuration by setting it as inactive.
   *
   * @param priceConfigurationId Price configuration ID
   * @throws NotFoundException if price configuration not found
   */
  public void deletePriceConfiguration(UUID priceConfigurationId) {
    log.info("Deleting price configuration with id: {}", priceConfigurationId);

    PriceConfigurationEntity entity =
        priceConfigurationRepository
            .findById(priceConfigurationId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Price configuration not found with id: " + priceConfigurationId));

    entity.setActive(false);
    priceConfigurationRepository.save(entity);

    log.info("Deleted price configuration with id: {}", priceConfigurationId);
  }

  /**
   * Restore a soft deleted price configuration by setting it as active.
   *
   * @param priceConfigurationId Price configuration ID
   * @return Restored price configuration
   * @throws NotFoundException if price configuration not found
   */
  public PriceConfiguration restorePriceConfiguration(UUID priceConfigurationId) {
    log.info("Restoring price configuration with id: {}", priceConfigurationId);

    PriceConfigurationEntity entity =
        priceConfigurationRepository
            .findById(priceConfigurationId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Price configuration not found with id: " + priceConfigurationId));

    entity.setActive(true);
    PriceConfigurationEntity savedEntity = priceConfigurationRepository.save(entity);

    log.info("Restored price configuration with id: {}", priceConfigurationId);

    return priceConfigurationMapper.toPriceConfigurationDto(savedEntity);
  }

  /**
   * Bulk update price configurations for a game.
   *
   * @param gameId Game ID
   * @param basePriceMultiplier Multiplier for base prices
   * @param pricePerLevelMultiplier Multiplier for price per level
   * @return Number of updated configurations
   * @throws NotFoundException if game not found
   */
  public int bulkUpdatePriceConfigurations(
      UUID gameId, Double basePriceMultiplier, Double pricePerLevelMultiplier) {
    log.info(
        "Bulk updating price configurations for game: {} with multipliers: {}, {}",
        gameId,
        basePriceMultiplier,
        pricePerLevelMultiplier);

    // Validate game exists
    gameRepository
        .findById(gameId)
        .orElseThrow(() -> new NotFoundException("Game not found: " + gameId));

    // Get all active configurations for the game
    var configurations = priceConfigurationRepository.findByGameIdAndActiveTrue(gameId);

    // Update each configuration
    for (PriceConfigurationEntity config : configurations) {
      if (basePriceMultiplier != null && basePriceMultiplier != 1.0) {
        int newBasePrice = (int) Math.round(config.getBasePrice() * basePriceMultiplier);
        config.setBasePrice(Math.max(0, newBasePrice)); // Ensure non-negative
      }

      if (pricePerLevelMultiplier != null && pricePerLevelMultiplier != 1.0) {
        int newPricePerLevel =
            (int) Math.round(config.getPricePerLevel() * pricePerLevelMultiplier);
        config.setPricePerLevel(Math.max(0, newPricePerLevel)); // Ensure non-negative
      }
    }

    priceConfigurationRepository.saveAll(configurations);
    log.info("Bulk updated {} price configurations for game: {}", configurations.size(), gameId);

    return configurations.size();
  }
}
