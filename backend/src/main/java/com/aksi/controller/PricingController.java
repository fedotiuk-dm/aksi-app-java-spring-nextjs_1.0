package com.aksi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.pricing.PricingApi;
import com.aksi.api.pricing.dto.DiscountsResponse;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PriceModifiersResponse;
import com.aksi.service.pricing.PricingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** REST controller for pricing operations */
@Slf4j
@RestController
@RequiredArgsConstructor
public class PricingController implements PricingApi {

  private final PricingService pricingService;

  @Override
  public ResponseEntity<PriceCalculationResponse> calculatePrice(
      PriceCalculationRequest priceCalculationRequest) {
    log.debug("Calculating price for {} items", priceCalculationRequest.getItems().size());
    return ResponseEntity.ok(pricingService.calculatePrice(priceCalculationRequest));
  }

  @Override
  public ResponseEntity<PriceModifiersResponse> listPriceModifiers(
      @Nullable String categoryCode, Boolean active) {
    log.debug("Listing price modifiers for category: {}, active: {}", categoryCode, active);
    return ResponseEntity.ok(pricingService.listPriceModifiers(categoryCode, active));
  }

  @Override
  public ResponseEntity<DiscountsResponse> listDiscounts(Boolean active) {
    log.debug("Listing discounts, active: {}", active);
    return ResponseEntity.ok(pricingService.listDiscounts(active));
  }
}