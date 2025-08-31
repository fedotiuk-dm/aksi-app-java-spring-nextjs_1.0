package com.aksi.service.game;

import com.aksi.api.game.dto.CalculationRequest;
import com.aksi.api.game.dto.CalculationResult;

/**
 * Service interface for calculating game service prices. Handles dynamic price calculations based
 * on game configurations, difficulty levels, service types, and modifiers.
 */
public interface CalculatorService {

  /**
   * Calculate price for boosting service based on request parameters.
   *
   * @param request Calculation request with game details
   * @return Calculation result with total price and breakdown
   */
  CalculationResult calculateBoostingPrice(CalculationRequest request);

  /**
   * Calculate service price based on request parameters.
   *
   * @param request Calculation request with game details
   * @return Calculation result with total price and breakdown
   */
  default CalculationResult calculatePrice(CalculationRequest request) {
    return calculateBoostingPrice(request);
  }
}
