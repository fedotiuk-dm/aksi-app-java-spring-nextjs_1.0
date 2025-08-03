package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.service.ItemsApi;
import com.aksi.api.service.dto.CreateItemInfoRequest;
import com.aksi.api.service.dto.ItemCategory;
import com.aksi.api.service.dto.ItemInfo;
import com.aksi.api.service.dto.ListItemsResponse;
import com.aksi.api.service.dto.UpdateItemInfoRequest;
import com.aksi.service.catalog.ItemCatalogService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for item catalog operations. Thin layer between OpenAPI and service with logging.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class ItemController implements ItemsApi {

  private final ItemCatalogService itemCatalogService;

  @Override
  public ResponseEntity<ItemInfo> createItem(CreateItemInfoRequest createItemRequest) {
    log.info("Creating new item with code: {}", createItemRequest.getCode());
    ItemInfo item = itemCatalogService.createItem(createItemRequest);
    log.info("Item created successfully with code: {}", createItemRequest.getCode());
    return ResponseEntity.status(201).body(item);
  }

  @Override
  public ResponseEntity<ItemInfo> getItemById(UUID itemId) {
    log.debug("Getting item by id: {}", itemId);
    ItemInfo item = itemCatalogService.getItemById(itemId);
    log.debug("Retrieved item details for id: {}", itemId);
    return ResponseEntity.ok(item);
  }

  @Override
  public ResponseEntity<ListItemsResponse> listItems(
      Boolean active,
      @Nullable ItemCategory category,
      @Nullable String search,
      Integer offset,
      Integer limit) {
    log.debug(
        "Listing items with active: {}, category: {}, search: {}, offset: {}, limit: {}",
        active,
        category,
        search,
        offset,
        limit);
    return ResponseEntity.ok(itemCatalogService.listItems(active, category, search, offset, limit));
  }

  @Override
  public ResponseEntity<ItemInfo> updateItem(UUID itemId, UpdateItemInfoRequest updateItemRequest) {
    log.info("Updating item with id: {}", itemId);
    ItemInfo updatedItem = itemCatalogService.updateItem(itemId, updateItemRequest);
    log.info("Item updated successfully with id: {}", itemId);
    return ResponseEntity.ok(updatedItem);
  }
}
