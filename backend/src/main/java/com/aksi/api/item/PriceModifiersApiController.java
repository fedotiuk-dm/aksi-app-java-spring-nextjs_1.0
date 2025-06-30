package com.aksi.api.item;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.item.dto.CreatePriceModifierRequest;
import com.aksi.api.item.dto.PriceModifierResponse;
import com.aksi.api.item.dto.UpdatePriceModifierRequest;
import com.aksi.domain.item.service.PriceModifierService;

import lombok.RequiredArgsConstructor;

/** HTTP контролер для управління модифікаторами цін. */
@Controller
@RequiredArgsConstructor
public class PriceModifiersApiController implements PriceModifiersApi {

  private final PriceModifierService priceModifierService;

  @Override
  public ResponseEntity<PriceModifierResponse> createPriceModifier(
      CreatePriceModifierRequest request) {
    var response = priceModifierService.createPriceModifier(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  public ResponseEntity<Void> deletePriceModifier(UUID id) {
    priceModifierService.deletePriceModifier(id);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<PriceModifierResponse> getPriceModifierByCode(String code) {
    var response = priceModifierService.getPriceModifierByCode(code);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<PriceModifierResponse> getPriceModifierById(UUID id) {
    var response = priceModifierService.getPriceModifierById(id);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<List<PriceModifierResponse>> getPriceModifiers(
      UUID categoryId, Boolean active) {
    List<PriceModifierResponse> response;
    if (Boolean.TRUE.equals(active)) {
      response = priceModifierService.getActivePriceModifiers();
    } else {
      response =
          priceModifierService
              .getPriceModifiers(org.springframework.data.domain.Pageable.unpaged())
              .getContent();
    }
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<PriceModifierResponse> updatePriceModifier(
      UUID id, UpdatePriceModifierRequest request) {
    var response = priceModifierService.updatePriceModifier(id, request);
    return ResponseEntity.ok(response);
  }
}
