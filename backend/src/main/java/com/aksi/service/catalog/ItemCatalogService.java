package com.aksi.service.catalog;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aksi.api.service.dto.CreateItemInfoRequest;
import com.aksi.api.service.dto.ItemCategory;
import com.aksi.api.service.dto.ItemInfo;
import com.aksi.api.service.dto.ListItemsResponse;
import com.aksi.api.service.dto.UpdateItemInfoRequest;

/** Service for managing item catalog */
public interface ItemCatalogService {

  /**
   * List all items with optional filters
   *
   * @param active Filter by active status
   * @param category Filter by category
   * @param search Search by name
   * @param pageable Pagination parameters
   * @return Page of items
   */
  Page<ItemInfo> listItems(Boolean active, ItemCategory category, String search, Pageable pageable);

  /**
   * Get item by ID
   *
   * @param itemId Item ID
   * @return Item details
   */
  ItemInfo getItemById(UUID itemId);

  /**
   * Create new item
   *
   * @param request Create item request
   * @return Created item
   */
  ItemInfo createItem(CreateItemInfoRequest request);

  /**
   * Update existing item
   *
   * @param itemId Item ID
   * @param request Update item request
   * @return Updated item
   */
  ItemInfo updateItem(UUID itemId, UpdateItemInfoRequest request);

  /**
   * Get item by code TODO: Add REST endpoint in future if needed for API access
   *
   * @param code Item code
   * @return Item details
   */
  ItemInfo getItemByCode(String code);

  /**
   * Get item by catalog number Used for price synchronization from PriceListService
   *
   * @param catalogNumber Catalog number
   * @return Item details
   */
  ItemInfo getItemByCatalogNumber(Integer catalogNumber);

  /**
   * List items with response DTO
   *
   * @param active Filter by active status
   * @param category Filter by category
   * @param search Search by name
   * @param offset Number of items to skip
   * @param limit Number of items to return
   * @return List items response
   */
  ListItemsResponse listItems(
      Boolean active, ItemCategory category, String search, Integer offset, Integer limit);
}
