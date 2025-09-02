package com.aksi.service.game;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CalculationRequest;
import com.aksi.api.game.dto.CalculationResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of CalculatorService providing all calculator-related operations. Delegates to
 * command and query services for specific operations following CQRS pattern.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CalculatorServiceImpl implements CalculatorService {

  private final CalculatorCommandService commandService;
  // Query service is reserved for future read operations (e.g., calculation history, settings)
  // Currently not used as calculator primarily performs calculations, not data retrieval
  // private final CalculatorQueryService queryService; // Temporarily disabled

  // Command operations (write)

  @Override
  public CalculationResult calculateBoostingPrice(CalculationRequest request) {
    return commandService.calculateBoostingPrice(request);
  }

  // Query operations (read)
  // Currently empty as calculator service is primarily for calculations, not data retrieval
}
