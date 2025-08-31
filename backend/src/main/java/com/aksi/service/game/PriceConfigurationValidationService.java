package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;
import com.aksi.exception.ConflictException;
import com.aksi.repository.DifficultyLevelRepository;
import com.aksi.repository.GameRepository;
import com.aksi.repository.PriceConfigurationRepository;
import com.aksi.repository.ServiceTypeRepository;

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

  private final PriceConfigurationRepository priceConfigurationRepository;
  private final GameRepository gameRepository;
  private final DifficultyLevelRepository difficultyLevelRepository;
  private final ServiceTypeRepository serviceTypeRepository;

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
    validateGameExists(request.getGameId());
    validateDifficultyLevelExists(request.getDifficultyLevelId());
    validateServiceTypeExists(request.getServiceTypeId());

    // Validate combination uniqueness
    validateCombinationUniqueness(
        request.getGameId(), request.getDifficultyLevelId(), request.getServiceTypeId(), null);

    // Validate price values
    validatePrices(request.getBasePrice(), request.getPricePerLevel());

    // Validate calculation formula if present
    String calculationFormula = request.getCalculationFormula();
    if (calculationFormula != null && !calculationFormula.trim().isEmpty()) {
      validateCalculationFormula(calculationFormula);
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
    validateGameExists(request.getGameId());
    validateDifficultyLevelExists(request.getDifficultyLevelId());
    validateServiceTypeExists(request.getServiceTypeId());

    // Validate combination uniqueness (excluding current configuration)
    validateCombinationUniqueness(
        request.getGameId(),
        request.getDifficultyLevelId(),
        request.getServiceTypeId(),
        priceConfigurationId);

    // Validate price values
    validatePrices(request.getBasePrice(), request.getPricePerLevel());

    // Validate calculation formula if present
    String calculationFormula = request.getCalculationFormula();
    if (calculationFormula != null && !calculationFormula.trim().isEmpty()) {
      validateCalculationFormula(calculationFormula);
    }
  }

  /**
   * Validate that game exists.
   *
   * @param gameId Game ID
   * @throws ConflictException if game not found
   */
  private void validateGameExists(UUID gameId) {
    if (!gameRepository.existsById(gameId)) {
      log.error("Game not found with id: {}", gameId);
      throw new ConflictException("Game not found with id: " + gameId);
    }
  }

  /**
   * Validate that difficulty level exists.
   *
   * @param difficultyLevelId Difficulty level ID
   * @throws ConflictException if difficulty level not found
   */
  private void validateDifficultyLevelExists(UUID difficultyLevelId) {
    if (!difficultyLevelRepository.existsById(difficultyLevelId)) {
      log.error("Difficulty level not found with id: {}", difficultyLevelId);
      throw new ConflictException("Difficulty level not found with id: " + difficultyLevelId);
    }
  }

  /**
   * Validate that service type exists.
   *
   * @param serviceTypeId Service type ID
   * @throws ConflictException if service type not found
   */
  private void validateServiceTypeExists(UUID serviceTypeId) {
    if (!serviceTypeRepository.existsById(serviceTypeId)) {
      log.error("Service type not found with id: {}", serviceTypeId);
      throw new ConflictException("Service type not found with id: " + serviceTypeId);
    }
  }

  /**
   * Validate combination uniqueness.
   *
   * @param gameId Game ID
   * @param difficultyLevelId Difficulty level ID
   * @param serviceTypeId Service type ID
   * @param excludeConfigurationId Configuration ID to exclude from uniqueness check (for updates)
   * @throws ConflictException if combination already exists
   */
  private void validateCombinationUniqueness(
      UUID gameId, UUID difficultyLevelId, UUID serviceTypeId, UUID excludeConfigurationId) {
    boolean exists =
        priceConfigurationRepository
            .findByIdsAndActive(gameId, difficultyLevelId, serviceTypeId)
            .map(
                existingConfig -> {
                  // If updating, exclude the current configuration from uniqueness check
                  return excludeConfigurationId == null
                      || !existingConfig.getId().equals(excludeConfigurationId);
                })
            .orElse(false);

    if (exists) {
      log.error(
          "Price configuration already exists for combination: game={}, difficulty={}, service={}",
          gameId,
          difficultyLevelId,
          serviceTypeId);
      throw new ConflictException(
          "Price configuration already exists for this game, difficulty level, and service type combination");
    }
  }

  /**
   * Validate price values.
   *
   * @param basePrice Base price in kopiykas
   * @param pricePerLevel Price per level in kopiykas
   * @throws ConflictException if prices are invalid
   */
  private void validatePrices(Integer basePrice, Integer pricePerLevel) {
    if (basePrice != null && basePrice < 0) {
      log.error("Base price must be non-negative, got: {}", basePrice);
      throw new ConflictException("Base price must be non-negative");
    }

    if (pricePerLevel != null && pricePerLevel < 0) {
      log.error("Price per level must be non-negative, got: {}", pricePerLevel);
      throw new ConflictException("Price per level must be non-negative");
    }
  }

  /**
   * Validate calculation formula.
   *
   * @param calculationFormula JSON calculation formula
   * @throws ConflictException if formula is invalid
   */
  private void validateCalculationFormula(String calculationFormula) {
    if (calculationFormula == null || calculationFormula.trim().isEmpty()) {
      return; // Empty formula is allowed
    }

    // Basic validation - check if it's valid JSON
    try {
      // For now, just check if it starts and ends with braces/brackets
      String trimmed = calculationFormula.trim();
      if (!((trimmed.startsWith("{") && trimmed.endsWith("}"))
          || (trimmed.startsWith("[") && trimmed.endsWith("]")))) {
        throw new IllegalArgumentException("Formula must be valid JSON");
      }

      // TODO: Add more sophisticated JSON validation or formula syntax validation
      // This could include checking for valid mathematical expressions, variable references, etc.

    } catch (Exception e) {
      log.error("Invalid calculation formula: {}", calculationFormula, e);
      throw new ConflictException("Invalid calculation formula format: " + e.getMessage());
    }
  }

  /**
   * Validate that price configuration can be deleted (no dependencies).
   *
   * @param priceConfigurationId Price configuration ID
   * @throws ConflictException if price configuration cannot be deleted
   */
  public void validateForDelete(UUID priceConfigurationId) {
    log.debug("Validating price configuration deletion for id: {}", priceConfigurationId);

    // Check if price configuration is referenced by active boosters or orders
    // This is a placeholder - in a real implementation, you would check related entities
    // For example:
    // if (boosterRepository.hasActivePriceConfiguration(priceConfigurationId)) {
    //   throw new ConflictException("Cannot delete price configuration with active boosters");
    // }
  }

  /**
   * Validate that price configuration exists.
   *
   * @param priceConfigurationId Price configuration ID
   * @throws ConflictException if price configuration not found
   */
  public void validatePriceConfigurationExists(UUID priceConfigurationId) {
    if (!priceConfigurationRepository.existsById(priceConfigurationId)) {
      log.error("Price configuration not found with id: {}", priceConfigurationId);
      throw new ConflictException("Price configuration not found with id: " + priceConfigurationId);
    }
  }

  /**
   * Validate bulk update parameters.
   *
   * @param basePriceMultiplier Base price multiplier
   * @param pricePerLevelMultiplier Price per level multiplier
   * @throws ConflictException if parameters are invalid
   */
  public void validateBulkUpdateParameters(
      Double basePriceMultiplier, Double pricePerLevelMultiplier) {
    if (basePriceMultiplier != null && basePriceMultiplier <= 0) {
      log.error("Base price multiplier must be positive, got: {}", basePriceMultiplier);
      throw new ConflictException("Base price multiplier must be positive");
    }

    if (pricePerLevelMultiplier != null && pricePerLevelMultiplier <= 0) {
      log.error("Price per level multiplier must be positive, got: {}", pricePerLevelMultiplier);
      throw new ConflictException("Price per level multiplier must be positive");
    }
  }
}
