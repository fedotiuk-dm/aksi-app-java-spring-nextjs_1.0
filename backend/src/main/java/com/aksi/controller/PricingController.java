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
import com.aksi.api.pricing.dto.ServiceCategoryType;
import com.aksi.api.pricing.dto.SortOrder;
import com.aksi.service.pricing.PricingService;

import lombok.RequiredArgsConstructor;

/** REST controller for pricing operations. Thin HTTP layer between OpenAPI and service. */
@RestController
@RequiredArgsConstructor
public class PricingController implements PricingApi {

  private final PricingService pricingService;

  @Override
  public ResponseEntity<PriceCalculationResponse> calculatePrice(
      PriceCalculationRequest priceCalculationRequest) {
    return ResponseEntity.ok(pricingService.calculatePrice(priceCalculationRequest));
  }

  @Override
  public ResponseEntity<PriceModifiersResponse> listPriceModifiers(
      @Nullable ServiceCategoryType categoryCode,
      @Nullable String sortBy,
      SortOrder sortOrder,
      @Nullable Boolean active) {
    return ResponseEntity.ok(
        pricingService.listPriceModifiers(categoryCode, active, sortBy, sortOrder.getValue()));
  }

  @Override
  public ResponseEntity<DiscountsResponse> listDiscounts(
      @Nullable Boolean active, @Nullable String sortBy, SortOrder sortOrder) {
    return ResponseEntity.ok(pricingService.listDiscounts(active, sortBy, sortOrder.getValue()));
  }

  // CRUD operations for PriceModifiers

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<PriceModifierDto> createPriceModifier(PriceModifierDto priceModifierDto) {
    PriceModifierDto created = pricingService.createPriceModifier(priceModifierDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<PriceModifierDto> updatePriceModifier(
      String code, PriceModifierDto priceModifierDto) {
    PriceModifierDto updated = pricingService.updatePriceModifier(code, priceModifierDto);
    return ResponseEntity.ok(updated);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deletePriceModifier(String code) {
    pricingService.deletePriceModifier(code);
    return ResponseEntity.noContent().build();
  }

  // CRUD operations for Discounts

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<DiscountDto> createDiscount(DiscountDto discountDto) {
    DiscountDto created = pricingService.createDiscount(discountDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<DiscountDto> updateDiscount(String code, DiscountDto discountDto) {
    DiscountDto updated = pricingService.updateDiscount(code, discountDto);
    return ResponseEntity.ok(updated);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteDiscount(String code) {
    pricingService.deleteDiscount(code);
    return ResponseEntity.noContent().build();
  }
}
