package com.aksi.api.item.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.item.PriceModifiersApi;
import com.aksi.api.item.dto.PriceModifierListResponse;
import com.aksi.api.item.dto.PriceModifierResponse;
import com.aksi.domain.item.service.PriceModifierService;

import lombok.RequiredArgsConstructor;

/** Controller for price modifiers endpoints. */
@RestController
@RequiredArgsConstructor
public class PriceModifiersController implements PriceModifiersApi {

  private final PriceModifierService priceModifierService;

  @Override
  public ResponseEntity<PriceModifierListResponse> getPriceModifiers(
      String categoryCode, Boolean activeOnly) {
    PriceModifierListResponse response =
        priceModifierService.getModifiers(categoryCode, activeOnly);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<PriceModifierResponse> getPriceModifier(String code) {
    PriceModifierResponse response = priceModifierService.getModifierByCode(code);
    return ResponseEntity.ok(response);
  }
}
