package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.CreateItemInfoRequest;
import com.aksi.api.service.dto.ItemCategory;
import com.aksi.api.service.dto.ItemInfo;
import com.aksi.api.service.dto.ListItemsResponse;
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
    } else if (category != null && active != null && active) {
      page = itemRepository.findByCategoryAndActiveTrue(category, pageable);
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
    if (existsByCode(request.getCode())) {
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

  private boolean existsByCode(String code) {
    return itemRepository.existsByCode(code);
  }


  @Override
  @Transactional(readOnly = true)
  public ItemInfo getItemByCode(String code) {
    log.debug("Getting item by code: {}", code);

    ItemCatalog itemCatalog =
        itemRepository
            .findByCode(code)
            .orElseThrow(() -> new NotFoundException("Item not found with code: " + code));

    return itemCatalogMapper.toItemResponse(itemCatalog);
  }

  @Override
  @Transactional(readOnly = true)
  public ItemInfo getItemByCatalogNumber(Integer catalogNumber) {
    log.debug("Getting item by catalog number: {}", catalogNumber);

    ItemCatalog itemCatalog =
        itemRepository
            .findByCatalogNumber(catalogNumber)
            .orElseThrow(
                () ->
                    new NotFoundException("Item not found with catalog number: " + catalogNumber));

    return itemCatalogMapper.toItemResponse(itemCatalog);
  }

  @Override
  @Transactional(readOnly = true)
  public ListItemsResponse listItems(
      Boolean active, ItemCategory category, String search, Integer offset, Integer limit) {
    int pageNumber = (offset != null && limit != null && limit > 0) ? offset / limit : 0;
    int pageSize = (limit != null && limit > 0) ? limit : 20;

    Page<ItemInfo> page =
        listItems(
            active,
            category,
            search,
            PageRequest.of(pageNumber, pageSize, Sort.by("sortOrder").ascending()));

    return new ListItemsResponse()
        .items(page.getContent())
        .totalCount((int) page.getTotalElements());
  }
}
