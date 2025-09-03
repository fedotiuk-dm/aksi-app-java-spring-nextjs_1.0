package com.aksi.service.game;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.formula.CalculationFormulaEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of CalculationService providing all calculation-related operations. Delegates to
 * specialized command and query services for proper separation of concerns following CQRS pattern.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CalculationServiceImpl implements CalculationService {

  private final CalculationQueryService queryService;

  // Core calculation operations

  @Override
  public BigDecimal calculatePrice(PriceConfigurationEntity config, int fromLevel, int toLevel) {
    log.info("Calculating price for config: {}, levels: {} → {}", config.getId(), fromLevel, toLevel);
    return queryService.calculatePrice(config, fromLevel, toLevel);
  }

  @Override
  public BigDecimal calculatePrice(CalculationFormulaEntity formula, BigDecimal basePrice, int fromLevel, int toLevel) {
    log.info("Calculating price with formula: {}, basePrice: {}, levels: {} → {}",
             queryService.getFormulaDescription(formula), basePrice, fromLevel, toLevel);
    return queryService.calculatePrice(formula, basePrice, fromLevel, toLevel);
  }

  @Override
  public void validateFormula(CalculationFormulaEntity formula) {
    queryService.validateFormula(formula);
  }

  @Override
  public String getFormulaDescription(CalculationFormulaEntity formula) {
    return queryService.getFormulaDescription(formula);
  }

  @Override
  public UniversalCalculationResponse calculateWithFormula(String formulaType, UniversalCalculationRequest request) {
    return queryService.calculateWithFormula(formulaType, request);
  }
}
