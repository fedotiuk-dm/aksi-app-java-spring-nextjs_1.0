package com.aksi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.game.CalculatorApi;
import com.aksi.api.game.dto.CalculationRequest;
import com.aksi.api.game.dto.CalculationResult;
import com.aksi.service.game.CalculatorService;

import lombok.RequiredArgsConstructor;

/** REST controller for calculator operations */
@RestController
@RequiredArgsConstructor
public class CalculatorController implements CalculatorApi {

  private final CalculatorService calculatorService;

  @Override
  public ResponseEntity<CalculationResult> calculateGamePrice(CalculationRequest calculationRequest) {
    CalculationResult result = calculatorService.calculatePrice(calculationRequest);
    return ResponseEntity.ok(result);
  }
}
