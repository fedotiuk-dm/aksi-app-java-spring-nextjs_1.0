package com.aksi.service.game;

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
 * Service implementation for PriceConfiguration operations. Provides basic CRUD operations used by
 * the REST API controller.
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

  // Delete operations

  @Override
  public void deletePriceConfiguration(UUID priceConfigurationId) {
    log.info("Deleting price configuration: {}", priceConfigurationId);
    commandService.deletePriceConfiguration(priceConfigurationId);
  }
}
