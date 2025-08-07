package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;

import com.aksi.api.service.dto.CreatePriceListItemRequest;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.PriceListItemsResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.api.service.dto.UpdatePriceListItemRequest;

/** Service for managing price list items */
public interface PriceListService {

  /**
   * Get price list item by ID
   *
   * @param priceListItemId Price list item ID
   * @return Price list item details
   */
  PriceListItemInfo getPriceListItemById(UUID priceListItemId);

  /**
   * Create new price list item
   *
   * @param request Create price list item request
   * @return Created price list item
   */
  PriceListItemInfo createPriceListItem(CreatePriceListItemRequest request);

  /**
   * Update existing price list item
   *
   * @param priceListItemId Price list item ID
   * @param request Update price list item request
   * @return Updated price list item
   */
  PriceListItemInfo updatePriceListItem(UUID priceListItemId, UpdatePriceListItemRequest request);

  /**
   * Delete price list item
   *
   * @param priceListItemId Price list item ID
   */
  void deletePriceListItem(UUID priceListItemId);

  // Admin functionality methods - essential for price management
  // Implemented in PriceListAdminController:
  // - POST /api/admin/price-list/sync - synchronizePrices()
  // - GET /api/admin/price-list/export - exportActivePriceList()
  // - GET /api/admin/price-list/categories - getDistinctActiveCategories()
  // TODO: Add import from CSV: POST /api/admin/price-list/import

  /**
   * Synchronize prices from price list to service items
   *
   * @return Number of synchronized items
   */
  int synchronizePrices();

  /**
   * Get distinct active categories for filtering
   *
   * @return List of distinct active category types
   */
  List<ServiceCategoryType> getDistinctActiveCategories();

  /**
   * Export all active price list items
   *
   * @return List of all active price list items for export
   */
  List<PriceListItemInfo> exportActivePriceList();

  /**
   * List price list items with response DTO
   *
   * @param categoryCode Filter by category code
   * @param active Filter by active status
   * @param offset Number of items to skip
   * @param limit Number of items to return
   * @return Price list items response
   */
  PriceListItemsResponse listPriceListItems(
      ServiceCategoryType categoryCode, Boolean active, Integer offset, Integer limit);

  // Category management functions

  /**
   * Get all categories with statistics
   *
   * @return List of category information
   */
  List<CategoryManagementService.CategoryInfo> getAllCategoriesInfo();

  /**
   * Deactivate all items in a category
   *
   * @param categoryCode Category to deactivate
   * @return Number of deactivated items
   */
  int deactivateCategory(ServiceCategoryType categoryCode);

  /**
   * Activate all items in a category
   *
   * @param categoryCode Category to activate
   * @return Number of activated items
   */
  int activateCategory(ServiceCategoryType categoryCode);
}
