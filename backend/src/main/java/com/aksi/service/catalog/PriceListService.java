package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.domain.catalog.ServiceCategoryType;

/** Service for managing price list items */
public interface PriceListService {

  /**
   * List all price list items with optional filters
   *
   * @param categoryCode Filter by category code
   * @param active Filter by active status
   * @param pageable Pagination parameters
   * @return Page of price list items
   */
  Page<PriceListItemInfo> listPriceListItems(
      ServiceCategoryType categoryCode, Boolean active, Pageable pageable);

  /**
   * Get price list item by ID
   *
   * @param priceListItemId Price list item ID
   * @return Price list item details
   */
  PriceListItemInfo getPriceListItemById(UUID priceListItemId);

  /**
   * Import price list from CSV
   *
   * @param csvContent CSV content as string
   * @return Number of imported items
   */
  int importFromCsv(String csvContent);

  /**
   * Get price list items by category
   *
   * @param categoryCode Category code
   * @return List of price list items
   */
  List<PriceListItemInfo> getPriceListItemsByCategory(ServiceCategoryType categoryCode);

  /**
   * Synchronize price list with service items Updates ServiceItem prices based on PriceListItem
   * prices
   *
   * @return Number of synchronized items
   */
  int synchronizePrices();

  /**
   * Get price list item by catalog number
   *
   * @param catalogNumber Catalog number
   * @return Price list item or null if not found
   */
  PriceListItemInfo getPriceListItemByCatalogNumber(Integer catalogNumber);
}
