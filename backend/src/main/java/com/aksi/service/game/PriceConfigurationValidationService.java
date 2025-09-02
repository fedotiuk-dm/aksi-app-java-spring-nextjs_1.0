package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;
import com.aksi.exception.ConflictException;
import com.aksi.service.game.util.CalculationValidationUtils;
import com.aksi.service.game.util.EntityValidationUtils;
import com.aksi.service.game.util.PriceConfigurationQueryUtils;
import com.aksi.service.game.util.PriceValidationUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for PriceConfiguration business rules. Contains business logic validation
 * separate from data access and API layers.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PriceConfigurationValidationService {

  private final EntityValidationUtils entityValidationUtils;
  private final PriceConfigurationQueryUtils priceConfigurationQueryUtils;

  /**
   * Validate price configuration creation request.
   *
   * @param request Create price configuration request
   * @throws ConflictException if validation fails
   */
  public void validateForCreate(CreatePriceConfigurationRequest request) {
    log.debug(
        "Validating price configuration creation request: game={}, difficulty={}, service={}",
        request.getGameId(),
        request.getDifficultyLevelId(),
        request.getServiceTypeId());

    // Validate related entities exist
    entityValidationUtils.validateEntitiesExist(
        request.getGameId(), request.getDifficultyLevelId(), request.getServiceTypeId());

    // Validate combination uniqueness
    if (priceConfigurationQueryUtils.combinationExists(
        request.getGameId(), request.getDifficultyLevelId(), request.getServiceTypeId())) {
      log.error(
          "Price configuration already exists for combination: game={}, difficulty={}, service={}",
          request.getGameId(),
          request.getDifficultyLevelId(),
          request.getServiceTypeId());
      throw new ConflictException(
          "Price configuration already exists for this game, difficulty level, and service type combination");
    }

    // Validate price values
    PriceValidationUtils.validatePrices(request.getBasePrice(), request.getPricePerLevel());

    // Validate calculation formula if present
    String calculationFormula = request.getCalculationFormula();
    if (calculationFormula != null && !calculationFormula.trim().isEmpty()) {
      CalculationValidationUtils.validateCalculationFormula(calculationFormula);
    }
  }

  /**
   * Validate price configuration update request.
   *
   * @param priceConfigurationId Price configuration ID being updated
   * @param request Update price configuration request
   * @throws ConflictException if validation fails
   */
  public void validateForUpdate(
      UUID priceConfigurationId, UpdatePriceConfigurationRequest request) {
    log.debug("Validating price configuration update request for id: {}", priceConfigurationId);

    // Validate related entities exist
    entityValidationUtils.validateEntitiesExist(
        request.getGameId(), request.getDifficultyLevelId(), request.getServiceTypeId());

    // Validate combination uniqueness (excluding current configuration)
    if (priceConfigurationQueryUtils.combinationExistsExcluding(
        request.getGameId(),
        request.getDifficultyLevelId(),
        request.getServiceTypeId(),
        priceConfigurationId)) {
      log.error(
          "Price configuration already exists for combination: game={}, difficulty={}, service={}",
          request.getGameId(),
          request.getDifficultyLevelId(),
          request.getServiceTypeId());
      throw new ConflictException(
          "Price configuration already exists for this game, difficulty level, and service type combination");
    }

    // Validate price values
    PriceValidationUtils.validatePrices(request.getBasePrice(), request.getPricePerLevel());

    // Validate calculation formula if present
    String calculationFormula = request.getCalculationFormula();
    if (calculationFormula != null && !calculationFormula.trim().isEmpty()) {
      CalculationValidationUtils.validateCalculationFormula(calculationFormula);
    }
  }
}
