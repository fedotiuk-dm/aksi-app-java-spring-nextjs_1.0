package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CalculationFormula;
import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;
import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.exception.ConflictException;
import com.aksi.mapper.FormulaConversionUtil;
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
  private final CalculationValidationService calculationValidationService;
  private final FormulaConversionUtil formulaConversionUtil;

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

    // Validate combination uniqueness only for active configurations
    if (request.getActive() != null && request.getActive() &&
        priceConfigurationQueryUtils.combinationExists(
            request.getGameId(), request.getDifficultyLevelId(), request.getServiceTypeId())) {
      log.error(
          "Active price configuration already exists for combination: game={}, difficulty={}, service={}",
          request.getGameId(),
          request.getDifficultyLevelId(),
          request.getServiceTypeId());
      throw new ConflictException(
          "Active price configuration already exists for this game, difficulty level, and service type combination. You can create an inactive configuration or update the existing one.");
    }

    // Validate price values
    PriceValidationUtils.validatePrices(request.getBasePrice(), request.getPricePerLevel());

    // Validate calculation formula if present
    if (request.getCalculationFormula() != null && request.getCalculationFormula().isPresent()) {
      CalculationFormula calculationFormula = request.getCalculationFormula().get();
      CalculationFormulaEntity domainFormula =
          formulaConversionUtil.toDomainFormula(calculationFormula);
      calculationValidationService.validateFormula(domainFormula);
      log.debug("Formula validation passed for: {}", calculationFormula.getType());
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
    if (request.getCalculationFormula() != null && request.getCalculationFormula().isPresent()) {
      CalculationFormula calculationFormula = request.getCalculationFormula().get();
      CalculationFormulaEntity domainFormula =
          formulaConversionUtil.toDomainFormula(calculationFormula);
      calculationValidationService.validateFormula(domainFormula);
      log.debug("Formula validation passed for: {}", calculationFormula.getType());
    }
  }
}
