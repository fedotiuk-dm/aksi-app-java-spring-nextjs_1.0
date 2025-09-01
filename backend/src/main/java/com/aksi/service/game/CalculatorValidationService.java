package com.aksi.service.game;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.aksi.api.game.dto.CalculationRequest;
import com.aksi.exception.BadRequestException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for calculator-related business rules and constraints. Handles validation
 * logic separate from command services.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CalculatorValidationService {

  /**
   * Validate calculation request.
   *
   * @param request Calculation request to validate
   * @throws BadRequestException if validation fails
   */
  public void validateCalculationRequest(CalculationRequest request) {
    log.debug("Validating calculation request: {}", request.getGameCode());

    // Validate required fields
    if (!StringUtils.hasText(request.getGameCode())) {
      throw new BadRequestException("Game code is required");
    }

    Integer startLevel = request.getStartLevel();
    if (startLevel == null) {
      throw new BadRequestException("Start level is required");
    }
    if (startLevel < 1) {
      throw new BadRequestException("Start level must be greater than 0");
    }

    Integer targetLevel = request.getTargetLevel();
    if (targetLevel == null) {
      throw new BadRequestException("Target level is required");
    }
    if (targetLevel < 1) {
      throw new BadRequestException("Target level must be greater than 0");
    }

    // Validate level progression
    if (targetLevel <= startLevel) {
      throw new BadRequestException("Target level must be greater than start level");
    }

    if (!StringUtils.hasText(request.getServiceTypeCode())) {
      throw new BadRequestException("Service type code is required");
    }

    // Validate difficulty level code
    if (!StringUtils.hasText(request.getDifficultyLevelCode())) {
      throw new BadRequestException("Difficulty level code is required");
    }

    log.debug("Calculation request validation passed");
  }
}
