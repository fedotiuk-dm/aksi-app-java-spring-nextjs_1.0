package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.service.PriceListApi;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.PriceListItemsResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
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
      @Nullable String categoryCode, Boolean active, Integer offset, Integer limit) {
    log.debug(
        "Listing price list items with categoryCode: {}, active: {}, offset: {}, limit: {}",
        categoryCode,
        active,
        offset,
        limit);
    ServiceCategoryType categoryType = categoryCode != null ? ServiceCategoryType.valueOf(categoryCode) : null;
    return ResponseEntity.ok(
        priceListService.listPriceListItems(categoryType, active, offset, limit));
  }
}
