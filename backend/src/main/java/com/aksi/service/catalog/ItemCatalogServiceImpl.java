package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.CreateItemInfoRequest;
import com.aksi.api.service.dto.ItemCategory;
import com.aksi.api.service.dto.ItemInfo;
import com.aksi.api.service.dto.UpdateItemInfoRequest;
import com.aksi.domain.catalog.ItemCatalog;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.catalog.ItemCatalogMapper;
import com.aksi.repository.catalog.ItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of ItemService */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ItemCatalogServiceImpl implements ItemCatalogService {

  private final ItemRepository itemRepository;
  private final ItemCatalogMapper itemCatalogMapper;

  @Override
  @Transactional(readOnly = true)
  public Page<ItemInfo> listItems(
      Boolean active, ItemCategory category, String search, Pageable pageable) {
    log.debug("Listing items with active: {}, category: {}, search: {}", active, category, search);

    Page<ItemCatalog> page;

    if (search != null && !search.trim().isEmpty()) {
      page = itemRepository.findByNameContainingIgnoreCaseAndActiveTrue(search.trim(), pageable);
    } else if (active != null && active) {
      page = itemRepository.findByActiveTrue(pageable);
    } else {
      page = itemRepository.findAll(pageable);
    }

    List<ItemInfo> dtos =
        page.getContent().stream()
            .map(itemCatalogMapper::toItemResponse)
            .collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, page.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public ItemInfo getItemById(UUID itemId) {
    log.debug("Getting item by id: {}", itemId);

    ItemCatalog itemCatalog =
        itemRepository
            .findById(itemId)
            .orElseThrow(() -> new NotFoundException("Item not found with id: " + itemId));

    return itemCatalogMapper.toItemResponse(itemCatalog);
  }

  @Override
  public ItemInfo createItem(CreateItemInfoRequest request) {
    log.debug("Creating new item with code: {}", request.getCode());

    // Check if code already exists
    if (itemRepository.existsByCode(request.getCode())) {
      throw new ConflictException("Item with code already exists: " + request.getCode());
    }

    ItemCatalog itemCatalog = itemCatalogMapper.toEntity(request);
    itemCatalog.setActive(true);

    ItemCatalog saved = itemRepository.save(itemCatalog);
    log.info("Created new item with id: {}", saved.getId());

    return itemCatalogMapper.toItemResponse(saved);
  }

  @Override
  public ItemInfo updateItem(UUID itemId, UpdateItemInfoRequest request) {
    log.debug("Updating item with id: {}", itemId);

    ItemCatalog itemCatalog =
        itemRepository
            .findById(itemId)
            .orElseThrow(() -> new NotFoundException("Item not found with id: " + itemId));

    itemCatalogMapper.updateEntityFromDto(request, itemCatalog);

    ItemCatalog updated = itemRepository.save(itemCatalog);
    log.info("Updated item with id: {}", updated.getId());

    return itemCatalogMapper.toItemResponse(updated);
  }

  @Override
  public void deleteItem(UUID itemId) {
    log.debug("Deleting item with id: {}", itemId);

    if (!itemRepository.existsById(itemId)) {
      throw new NotFoundException("Item not found with id: " + itemId);
    }

    itemRepository.deleteById(itemId);
    log.info("Deleted item with id: {}", itemId);
  }

  @Override
  @Transactional(readOnly = true)
  public boolean existsByCode(String code) {
    return itemRepository.existsByCode(code);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ItemInfo> getItemsByCategory(ItemCategory category) {
    log.debug("Getting items by category: {}", category);

    // Note: Item entity uses ServiceCategoryType, not ItemCategory
    // This would need to be mapped properly based on business logic
    Page<ItemCatalog> items = itemRepository.findByActiveTrue(Pageable.unpaged());

    return items.stream().map(itemCatalogMapper::toItemResponse).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<ItemInfo> searchItems(String searchTerm) {
    log.debug("Searching items with term: {}", searchTerm);

    if (searchTerm == null || searchTerm.trim().isEmpty()) {
      return List.of();
    }

    Page<ItemCatalog> items =
        itemRepository.findByNameContainingIgnoreCaseAndActiveTrue(
            searchTerm.trim(), Pageable.unpaged());

    return items.stream().map(itemCatalogMapper::toItemResponse).collect(Collectors.toList());
  }
}
