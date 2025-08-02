package com.aksi.service.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.service.PriceListItem;
import com.aksi.domain.service.ServiceCategoryType;
import com.aksi.dto.service.PriceListItemDTO;
import com.aksi.mapper.service.PriceListItemMapper;
import com.aksi.repository.service.PriceListItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for managing price list items */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PriceListService {

  private final PriceListItemRepository priceListItemRepository;
  private final PriceListItemMapper priceListItemMapper;

  /** Get all active price list items */
  public List<PriceListItemDTO> getAllActive() {
    log.debug("Getting all active price list items");
    List<PriceListItem> items = priceListItemRepository.findAllActiveOrderedByCategoryAndNumber();
    return priceListItemMapper.toDtoList(items);
  }

  /** Get price list items by category */
  public List<PriceListItemDTO> getByCategory(ServiceCategoryType categoryCode) {
    log.debug("Getting price list items for category: {}", categoryCode);
    List<PriceListItem> items =
        priceListItemRepository.findByCategoryCodeAndActiveTrue(categoryCode);
    return priceListItemMapper.toDtoList(items);
  }

  /** Get price list item by ID */
  public PriceListItemDTO getById(UUID id) {
    log.debug("Getting price list item by id: {}", id);
    PriceListItem item =
        priceListItemRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Price list item not found: " + id));
    return priceListItemMapper.toDto(item);
  }

  /** Get price list item by category and catalog number */
  public PriceListItemDTO getByCategoryAndNumber(
      ServiceCategoryType categoryCode, Integer catalogNumber) {
    log.debug(
        "Getting price list item for category: {} and number: {}", categoryCode, catalogNumber);
    PriceListItem item =
        priceListItemRepository
            .findByCategoryCodeAndCatalogNumber(categoryCode, catalogNumber)
            .orElseThrow(
                () ->
                    new RuntimeException(
                        "Price list item not found for category: "
                            + categoryCode
                            + " and number: "
                            + catalogNumber));
    return priceListItemMapper.toDto(item);
  }

  /** Get all active categories */
  public List<ServiceCategoryType> getActiveCategories() {
    log.debug("Getting all active categories");
    return priceListItemRepository.findDistinctActiveCategories();
  }
}
