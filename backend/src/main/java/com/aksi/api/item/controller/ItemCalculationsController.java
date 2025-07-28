package com.aksi.api.item.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.item.ItemCalculationsApi;
import com.aksi.api.item.dto.CalculateOrderSummaryRequest;
import com.aksi.api.item.dto.ItemCalculationRequest;
import com.aksi.api.item.dto.ItemCalculationResponse;
import com.aksi.api.item.dto.ItemPricePreviewResponse;
import com.aksi.api.item.dto.OrderSummaryResponse;
import com.aksi.domain.item.service.CartCalculationService;
import com.aksi.domain.item.service.ItemCalculationService;

import lombok.RequiredArgsConstructor;

/** Controller for item calculations endpoints. */
@RestController
@RequiredArgsConstructor
public class ItemCalculationsController implements ItemCalculationsApi {

  private final ItemCalculationService itemCalculationService;
  private final CartCalculationService cartCalculationService;

  @Override
  public ResponseEntity<ItemCalculationResponse> calculateItemPrice(
      ItemCalculationRequest itemCalculationRequest) {
    ItemCalculationResponse response =
        itemCalculationService.calculateItemPrice(itemCalculationRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<OrderSummaryResponse> calculateOrderSummary(
      CalculateOrderSummaryRequest calculateOrderSummaryRequest) {
    OrderSummaryResponse response =
        cartCalculationService.calculateCartSummary(calculateOrderSummaryRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ItemPricePreviewResponse> previewItemPrice(
      ItemCalculationRequest itemCalculationRequest) {
    ItemPricePreviewResponse response =
        cartCalculationService.previewItemPrice(itemCalculationRequest);
    return ResponseEntity.ok(response);
  }
}
