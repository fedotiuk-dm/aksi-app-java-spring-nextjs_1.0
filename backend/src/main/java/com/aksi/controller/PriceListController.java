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
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for price list operations. Thin layer between OpenAPI and service with logging.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class PriceListController implements PriceListApi {

  private final PriceListService priceListService;

  @Override
  public ResponseEntity<PriceListItemInfo> getPriceListItemById(UUID priceListItemId) {
    log.debug("Getting price list item by id: {}", priceListItemId);
    return ResponseEntity.ok(priceListService.getPriceListItemById(priceListItemId));
  }

  @Override
  public ResponseEntity<PriceListItemsResponse> listPriceListItems(
      @Nullable ServiceCategoryType categoryCode, Boolean active, Integer offset, Integer limit) {
    log.debug(
        "Listing price list items with categoryCode: {}, active: {}, offset: {}, limit: {}",
        categoryCode,
        active,
        offset,
        limit);
    return ResponseEntity.ok(
        priceListService.listPriceListItems(categoryCode, active, offset, limit));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<PriceListItemInfo> createPriceListItem(
      CreatePriceListItemRequest createPriceListItemRequest) {
    log.debug("Creating new price list item");
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(priceListService.createPriceListItem(createPriceListItemRequest));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<PriceListItemInfo> updatePriceListItem(
      UUID priceListItemId, UpdatePriceListItemRequest updatePriceListItemRequest) {
    log.debug("Updating price list item: {}", priceListItemId);
    return ResponseEntity.ok(
        priceListService.updatePriceListItem(priceListItemId, updatePriceListItemRequest));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deletePriceListItem(UUID priceListItemId) {
    log.debug("Deleting price list item: {}", priceListItemId);
    priceListService.deletePriceListItem(priceListItemId);
    return ResponseEntity.noContent().build();
  }

  // Category management endpoints

  @GetMapping("/api/price-list/categories")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<List<CategoryManagementService.CategoryInfo>> getAllCategories() {
    log.debug("Getting all categories with statistics");
    return ResponseEntity.ok(priceListService.getAllCategoriesInfo());
  }

  @PutMapping("/api/price-list/categories/{categoryCode}/deactivate")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> deactivateCategory(
      @PathVariable ServiceCategoryType categoryCode) {
    log.info("Deactivating category: {}", categoryCode);
    int deactivatedCount = priceListService.deactivateCategory(categoryCode);
    return ResponseEntity.ok(
        Map.of(
            "categoryCode", categoryCode,
            "deactivatedItems", deactivatedCount,
            "message",
                String.format(
                    "Деактивовано %d позицій в категорії %s", deactivatedCount, categoryCode)));
  }

  @PutMapping("/api/price-list/categories/{categoryCode}/activate")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> activateCategory(
      @PathVariable ServiceCategoryType categoryCode) {
    log.info("Activating category: {}", categoryCode);
    int activatedCount = priceListService.activateCategory(categoryCode);
    return ResponseEntity.ok(
        Map.of(
            "categoryCode", categoryCode,
            "activatedItems", activatedCount,
            "message",
                String.format(
                    "Активовано %d позицій в категорії %s", activatedCount, categoryCode)));
  }
}
