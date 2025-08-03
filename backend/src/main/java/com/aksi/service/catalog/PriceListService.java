package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.PriceListItemsResponse;
import com.aksi.api.service.dto.ServiceCategoryType;

/** Service for managing price list items */
public interface PriceListService {

  /**
   * Get price list item by ID
   *
   * @param priceListItemId Price list item ID
   * @return Price list item details
   */
  PriceListItemInfo getPriceListItemById(UUID priceListItemId);

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
   * Get price list item by category and catalog number
   * Used in OrderPriceCalculator for category-specific pricing
   *
   * @param categoryCode Category code
   * @param catalogNumber Catalog number
   * @return Price list item or null if not found
   */
  PriceListItemInfo getPriceListItemByCategoryAndCatalogNumber(
      ServiceCategoryType categoryCode, Integer catalogNumber);

  /**
   * Get price list item by catalog number
   * Used in OrderPriceCalculator for quick price lookups during order creation
   *
   * @param catalogNumber Catalog number
   * @return Price list item or null if not found
   */
  PriceListItemInfo getPriceListItemByCatalogNumber(Integer catalogNumber);

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
}
