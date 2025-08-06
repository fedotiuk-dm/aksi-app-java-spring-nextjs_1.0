package com.aksi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.pricing.PricingApi;
import com.aksi.api.pricing.dto.DiscountDto;
import com.aksi.api.pricing.dto.DiscountsResponse;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PriceModifierDto;
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

  // CRUD operations for PriceModifiers

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<PriceModifierDto> createPriceModifier(PriceModifierDto priceModifierDto) {
    log.info("Creating new price modifier with code: {}", priceModifierDto.getCode());
    PriceModifierDto created = pricingService.createPriceModifier(priceModifierDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<PriceModifierDto> updatePriceModifier(
      String code, PriceModifierDto priceModifierDto) {
    log.info("Updating price modifier with code: {}", code);
    PriceModifierDto updated = pricingService.updatePriceModifier(code, priceModifierDto);
    return ResponseEntity.ok(updated);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deletePriceModifier(String code) {
    log.info("Deleting price modifier with code: {}", code);
    pricingService.deletePriceModifier(code);
    return ResponseEntity.noContent().build();
  }

  // CRUD operations for Discounts

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<DiscountDto> createDiscount(DiscountDto discountDto) {
    log.info("Creating new discount with code: {}", discountDto.getCode());
    DiscountDto created = pricingService.createDiscount(discountDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<DiscountDto> updateDiscount(String code, DiscountDto discountDto) {
    log.info("Updating discount with code: {}", code);
    DiscountDto updated = pricingService.updateDiscount(code, discountDto);
    return ResponseEntity.ok(updated);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteDiscount(String code) {
    log.info("Deleting discount with code: {}", code);
    pricingService.deleteDiscount(code);
    return ResponseEntity.noContent().build();
  }
}
