package com.aksi.service.game;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.PriceConfigurationListResponse;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for PriceConfiguration operations. Delegates to specialized command and
 * query services for proper separation of concerns.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PriceConfigurationServiceImpl implements PriceConfigurationService {

  private final PriceConfigurationCommandService commandService;
  private final PriceConfigurationQueryService queryService;

  // Create operations

  @Override
  public PriceConfiguration createPriceConfiguration(CreatePriceConfigurationRequest request) {
    log.info(
        "Creating price configuration for game: {}, difficulty: {}, service: {}",
        request.getGameId(),
        request.getDifficultyLevelId(),
        request.getServiceTypeId());
    return commandService.createPriceConfiguration(request);
  }

  // Read operations

  @Override
  @Transactional(readOnly = true)
  public PriceConfiguration getPriceConfigurationById(UUID priceConfigurationId) {
    return queryService.getPriceConfigurationById(priceConfigurationId);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<PriceConfiguration> getPriceConfigurationByCombination(
      UUID gameId, UUID difficultyLevelId, UUID serviceTypeId) {
    return queryService.getPriceConfigurationByCombination(
        gameId, difficultyLevelId, serviceTypeId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<PriceConfiguration> getPriceConfigurationsByGameId(UUID gameId) {
    return queryService.getPriceConfigurationsByGameId(gameId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<PriceConfiguration> getAllActivePriceConfigurations() {
    return queryService.getAllActivePriceConfigurations();
  }

  @Override
  @Transactional(readOnly = true)
  public List<PriceConfiguration> getDefaultPriceConfigurations() {
    return queryService.getDefaultPriceConfigurations();
  }

  @Override
  @Transactional(readOnly = true)
  public List<PriceConfiguration> getDefaultPriceConfigurationsByGameId(UUID gameId) {
    return queryService.getDefaultPriceConfigurationsByGameId(gameId);
  }

  @Override
  @Transactional(readOnly = true)
  public PriceConfigurationListResponse getPriceConfigurations(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      UUID gameId,
      UUID difficultyLevelId,
      UUID serviceTypeId,
      Boolean active,
      Integer minBasePrice,
      Integer maxBasePrice) {

    return queryService.getPriceConfigurations(
        page,
        size,
        sortBy,
        sortOrder,
        gameId,
        difficultyLevelId,
        serviceTypeId,
        active,
        minBasePrice,
        maxBasePrice);
  }

  // Update operations

  @Override
  public PriceConfiguration updatePriceConfiguration(
      UUID priceConfigurationId, UpdatePriceConfigurationRequest request) {
    log.info("Updating price configuration: {}", priceConfigurationId);
    return commandService.updatePriceConfiguration(priceConfigurationId, request);
  }

  @Override
  public PriceConfiguration setActive(UUID priceConfigurationId, boolean active) {
    log.info("Setting price configuration {} to active: {}", priceConfigurationId, active);
    return active
        ? commandService.activatePriceConfiguration(priceConfigurationId)
        : commandService.deactivatePriceConfiguration(priceConfigurationId);
  }

  // Delete operations

  @Override
  public void deletePriceConfiguration(UUID priceConfigurationId) {
    log.info("Deleting price configuration: {}", priceConfigurationId);
    commandService.deletePriceConfiguration(priceConfigurationId);
  }

  // Bulk operations

  @Override
  public int bulkUpdatePriceConfigurations(
      UUID gameId, Double basePriceMultiplier, Double pricePerLevelMultiplier) {
    log.info(
        "Bulk updating price configurations for game: {} with multipliers: base={}, perLevel={}",
        gameId,
        basePriceMultiplier,
        pricePerLevelMultiplier);
    return commandService.bulkUpdatePriceConfigurations(
        gameId, basePriceMultiplier, pricePerLevelMultiplier);
  }

  // Utility operations

  @Override
  @Transactional(readOnly = true)
  public long countActiveByGameId(UUID gameId) {
    return queryService.countActiveByGameId(gameId);
  }
}
