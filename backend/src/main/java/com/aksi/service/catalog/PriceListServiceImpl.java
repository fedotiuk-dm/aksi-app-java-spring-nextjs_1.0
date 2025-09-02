package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.pricelist.dto.CreatePriceListItemRequest;
import com.aksi.api.pricelist.dto.PriceListItemInfo;
import com.aksi.api.pricelist.dto.PriceListItemsResponse;
import com.aksi.api.pricelist.dto.ServiceCategoryType;
import com.aksi.api.pricelist.dto.UpdatePriceListItemRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade implementation of PriceListService. Provides a unified API while delegating to specialized
 * Query and Command services.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PriceListServiceImpl implements PriceListService {

  private final PriceListQueryService queryService;
  private final PriceListCommandService commandService;
  private final CategoryManagementService categoryManagementService;

  // Query methods - delegate to PriceListQueryService

  @Override
  @Transactional(readOnly = true)
  public PriceListItemInfo getPriceListItemById(UUID priceListItemId) {
    return queryService.getPriceListItemById(priceListItemId);
  }

  @Override
  @Transactional(readOnly = true)
  public PriceListItemsResponse listPriceListItems(
      ServiceCategoryType categoryCode, Boolean active, Integer offset, Integer limit) {
    return queryService.listPriceListItems(categoryCode, active, offset, limit);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ServiceCategoryType> getDistinctActiveCategories() {
    return queryService.getDistinctActiveCategories();
  }

  @Override
  @Transactional(readOnly = true)
  public List<PriceListItemInfo> exportActivePriceList() {
    return queryService.exportActivePriceList();
  }

  // Command methods - delegate to PriceListCommandService

  @Override
  public PriceListItemInfo createPriceListItem(CreatePriceListItemRequest request) {
    return commandService.createPriceListItem(request);
  }

  @Override
  public PriceListItemInfo updatePriceListItem(
      UUID priceListItemId, UpdatePriceListItemRequest request) {
    return commandService.updatePriceListItem(priceListItemId, request);
  }

  @Override
  public void deletePriceListItem(UUID priceListItemId) {
    commandService.deletePriceListItem(priceListItemId);
  }

  @Override
  public int synchronizePrices() {
    return commandService.synchronizePrices();
  }

  // Category management methods

  @Override
  @Transactional(readOnly = true)
  public List<CategoryManagementService.CategoryInfo> getAllCategoriesInfo() {
    return categoryManagementService.getAllCategories();
  }

  @Override
  @Transactional
  public int deactivateCategory(ServiceCategoryType categoryCode) {
    return categoryManagementService.deactivateCategory(categoryCode);
  }

  @Override
  @Transactional
  public int activateCategory(ServiceCategoryType categoryCode) {
    return categoryManagementService.activateCategory(categoryCode);
  }
}
