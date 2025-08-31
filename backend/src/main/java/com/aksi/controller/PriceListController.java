package com.aksi.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.service.PriceListApi;
import com.aksi.api.service.dto.CreatePriceListItemRequest;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.PriceListItemsResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.api.service.dto.UpdatePriceListItemRequest;
import com.aksi.service.catalog.CategoryManagementService;
import com.aksi.service.catalog.PriceListService;

import lombok.RequiredArgsConstructor;

/** REST controller for price list operations. Thin layer between OpenAPI and service. */
@RestController
@RequiredArgsConstructor
public class PriceListController implements PriceListApi {

  private final PriceListService priceListService;

  @Override
  public ResponseEntity<PriceListItemInfo> getPriceListItemById(UUID priceListItemId) {
    return ResponseEntity.ok(priceListService.getPriceListItemById(priceListItemId));
  }

  @Override
  public ResponseEntity<PriceListItemsResponse> listPriceListItems(
      @Nullable ServiceCategoryType categoryCode, Boolean active, Integer offset, Integer limit) {
    return ResponseEntity.ok(
        priceListService.listPriceListItems(categoryCode, active, offset, limit));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<PriceListItemInfo> createPriceListItem(
      CreatePriceListItemRequest createPriceListItemRequest) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(priceListService.createPriceListItem(createPriceListItemRequest));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<PriceListItemInfo> updatePriceListItem(
      UUID priceListItemId, UpdatePriceListItemRequest updatePriceListItemRequest) {
    return ResponseEntity.ok(
        priceListService.updatePriceListItem(priceListItemId, updatePriceListItemRequest));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deletePriceListItem(UUID priceListItemId) {
    priceListService.deletePriceListItem(priceListItemId);
    return ResponseEntity.noContent().build();
  }

  // Category management endpoints

  @GetMapping("/api/price-list/categories")
  @PreAuthorize("hasAnyRole('OPERATOR', 'MANAGER', 'ADMIN')")
  public ResponseEntity<List<CategoryManagementService.CategoryInfo>> getAllCategories() {
    return ResponseEntity.ok(priceListService.getAllCategoriesInfo());
  }

  @PutMapping("/api/price-list/categories/{categoryCode}/deactivate")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> deactivateCategory(
      @PathVariable ServiceCategoryType categoryCode) {
    int deactivatedCount = priceListService.deactivateCategory(categoryCode);
    return ResponseEntity.ok(
        Map.of(
            "categoryCode", categoryCode,
            "deactivatedItems", deactivatedCount,
            "message",
                String.format(
                    "Deactivated %d items in category %s", deactivatedCount, categoryCode)));
  }

  @PutMapping("/api/price-list/categories/{categoryCode}/activate")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> activateCategory(
      @PathVariable ServiceCategoryType categoryCode) {
    int activatedCount = priceListService.activateCategory(categoryCode);
    return ResponseEntity.ok(
        Map.of(
            "categoryCode", categoryCode,
            "activatedItems", activatedCount,
            "message",
                String.format("Activated %d items in category %s", activatedCount, categoryCode)));
  }
}
