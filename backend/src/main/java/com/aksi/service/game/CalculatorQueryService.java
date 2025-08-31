package com.aksi.service.game;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

/**
 * Query service for calculator-related read operations. Currently empty as calculator service is
 * primarily for calculations, not data retrieval.
 */
@Service
@Transactional(readOnly = true)
@Slf4j
public class CalculatorQueryService {

  // Calculator service primarily performs calculations, not data queries
  // This service is kept for architectural consistency with CQRS pattern

}
