package com.aksi.api.item;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.item.dto.CalculateOrderSummaryRequest;
import com.aksi.api.item.dto.ItemCalculationRequest;
import com.aksi.api.item.dto.ItemCalculationResponse;
import com.aksi.api.item.dto.ItemPricePreviewResponse;
import com.aksi.api.item.dto.OrderSummaryResponse;
import com.aksi.domain.item.service.ItemCalculationService;

import lombok.RequiredArgsConstructor;

/**
 * HTTP контролер для розрахунків цін предметів
 */
@Controller
@RequiredArgsConstructor
public class ItemCalculationsApiController implements ItemCalculationsApi {

    private final ItemCalculationService itemCalculationService;

    @Override
    public ResponseEntity<ItemCalculationResponse> calculateItemPrice(ItemCalculationRequest itemCalculationRequest) {
        var response = itemCalculationService.calculateItemPrice(itemCalculationRequest);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<OrderSummaryResponse> calculateOrderSummary(CalculateOrderSummaryRequest calculateOrderSummaryRequest) {
        var response = itemCalculationService.calculateOrderSummary(calculateOrderSummaryRequest);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<ItemPricePreviewResponse> previewItemPrice(ItemCalculationRequest itemCalculationRequest) {
        var response = itemCalculationService.previewItemPrice(itemCalculationRequest);
        return ResponseEntity.ok(response);
    }
}
