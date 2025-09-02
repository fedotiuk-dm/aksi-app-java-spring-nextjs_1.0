package com.aksi.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.pricelist.dto.PriceListItemInfo;
import com.aksi.api.pricelist.dto.ServiceCategoryType;
import com.aksi.service.catalog.PriceListService;

import lombok.RequiredArgsConstructor;

/**
 * Admin controller for price list management operations. TODO: Add these endpoints to OpenAPI
 * specification
 */
@RestController
@RequestMapping("/api/admin/price-list")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PriceListAdminController {

  private final PriceListService priceListService;

  /** Synchronize prices from price list to all service items */
  @PostMapping("/sync")
  public ResponseEntity<Integer> synchronizePrices() {
    int updatedCount = priceListService.synchronizePrices();
    return ResponseEntity.ok(updatedCount);
  }

  /** Get distinct active categories for filtering */
  @GetMapping("/categories")
  public ResponseEntity<List<ServiceCategoryType>> getDistinctActiveCategories() {
    List<ServiceCategoryType> categories = priceListService.getDistinctActiveCategories();
    return ResponseEntity.ok(categories);
  }

  /** Export all active price list items */
  @GetMapping("/export")
  public ResponseEntity<List<PriceListItemInfo>> exportActivePriceList() {
    List<PriceListItemInfo> items = priceListService.exportActivePriceList();
    return ResponseEntity.ok(items);
  }
}
