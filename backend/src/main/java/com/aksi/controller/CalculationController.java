package com.aksi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.game.CalculatorApi;
import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;
import com.aksi.service.game.CalculationService;

import lombok.RequiredArgsConstructor;

/** REST controller for calculator operations */
@RestController
@RequiredArgsConstructor
public class CalculationController implements CalculatorApi {

  private final CalculationService calculationService;

  @Override
  public ResponseEntity<UniversalCalculationResponse> calculateWithFormula(
      String formulaType,
      UniversalCalculationRequest universalCalculationRequest) {

    UniversalCalculationResponse response = calculationService.calculateWithFormula(
        formulaType, universalCalculationRequest);
    return ResponseEntity.ok(response);
  }
}
