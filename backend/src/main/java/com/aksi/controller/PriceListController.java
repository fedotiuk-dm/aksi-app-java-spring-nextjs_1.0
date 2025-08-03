package com.aksi.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    PriceListItemInfo priceListItem = priceListService.getPriceListItemById(priceListItemId);
    log.debug("Retrieved price list item details for id: {}", priceListItemId);
    return ResponseEntity.ok(priceListItem);
  }

  @Override
  public ResponseEntity<PriceListItemsResponse> listPriceListItems(
      @Nullable ServiceCategoryType categoryCode, Boolean active, Integer offset, Integer limit) {
    log.debug(
        "Listing price list items with categoryCode: {}, active: {}", categoryCode, active);

    // Create pageable from offset and limit
    int pageNumber = (offset != null && limit != null && limit > 0) ? offset / limit : 0;
    int pageSize = (limit != null && limit > 0) ? limit : 20;
    Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("catalogNumber").ascending());

    // Convert DTO enum to domain enum
    com.aksi.domain.catalog.ServiceCategoryType domainCategoryCode = null;
    if (categoryCode != null) {
      domainCategoryCode = mapToDomainCategoryType(categoryCode);
    }

    Page<PriceListItemInfo> priceListPage =
        priceListService.listPriceListItems(domainCategoryCode, active, pageable);

    PriceListItemsResponse response = new PriceListItemsResponse();
    response.setPriceListItems(priceListPage.getContent());
    response.setTotalCount((int) priceListPage.getTotalElements());

    log.debug("Listed {} price list items successfully", priceListPage.getNumberOfElements());
    return ResponseEntity.ok(response);
  }

  /** Maps API ServiceCategoryType to domain ServiceCategoryType */
  private com.aksi.domain.catalog.ServiceCategoryType mapToDomainCategoryType(
      ServiceCategoryType apiCategoryType) {
    return switch (apiCategoryType) {
      case CLOTHING -> com.aksi.domain.catalog.ServiceCategoryType.CLOTHING;
      case LAUNDRY -> com.aksi.domain.catalog.ServiceCategoryType.LAUNDRY;
      case IRONING -> com.aksi.domain.catalog.ServiceCategoryType.IRONING;
      case DYEING -> com.aksi.domain.catalog.ServiceCategoryType.DYEING;
      case LEATHER -> com.aksi.domain.catalog.ServiceCategoryType.LEATHER;
      case REPAIRS -> com.aksi.domain.catalog.ServiceCategoryType.REPAIRS;
      case SHOE_CARE -> com.aksi.domain.catalog.ServiceCategoryType.SHOE_CARE;
      case CARPETS -> com.aksi.domain.catalog.ServiceCategoryType.CARPETS;
      case ADDITIONAL_SERVICES -> com.aksi.domain.catalog.ServiceCategoryType.ADDITIONAL_SERVICES;
    };
  }
}