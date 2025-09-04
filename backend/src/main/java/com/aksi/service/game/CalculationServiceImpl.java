package com.aksi.service.game;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;

import lombok.RequiredArgsConstructor;

/**
 * Implementation of CalculationService providing all calculation-related operations. Delegates to
 * specialized query services for proper separation of concerns.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class CalculationServiceImpl implements CalculationService {

  private final CalculationQueryService queryService;

  @Override
  public UniversalCalculationResponse calculateWithFormula(String formulaType, UniversalCalculationRequest request) {
    return queryService.calculateWithFormula(formulaType, request);
  }
}
