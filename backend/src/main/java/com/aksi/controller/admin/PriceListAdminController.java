package com.aksi.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.service.catalog.PriceListService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Admin controller for price list management operations. TODO: Add these endpoints to OpenAPI
 * specification
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/price-list")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PriceListAdminController {

  private final PriceListService priceListService;

  /** Synchronize prices from price list to all service items */
  @PostMapping("/sync")
  public ResponseEntity<Integer> synchronizePrices() {
    log.info("Admin initiated price synchronization");
    int updatedCount = priceListService.synchronizePrices();
    log.info("Price synchronization completed. Updated {} items", updatedCount);
    return ResponseEntity.ok(updatedCount);
  }

  /** Get distinct active categories for filtering */
  @GetMapping("/categories")
  public ResponseEntity<List<ServiceCategoryType>> getDistinctActiveCategories() {
    log.debug("Getting distinct active categories");
    List<ServiceCategoryType> categories = priceListService.getDistinctActiveCategories();
    return ResponseEntity.ok(categories);
  }

  /** Export all active price list items */
  @GetMapping("/export")
  public ResponseEntity<List<PriceListItemInfo>> exportActivePriceList() {
    log.info("Admin initiated price list export");
    List<PriceListItemInfo> items = priceListService.exportActivePriceList();
    log.info("Exported {} price list items", items.size());
    return ResponseEntity.ok(items);
  }
}
