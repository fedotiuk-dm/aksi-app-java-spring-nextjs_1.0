package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.domain.catalog.PriceListItem;
import com.aksi.domain.catalog.ServiceCategoryType;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.catalog.PriceListItemMapper;
import com.aksi.repository.catalog.PriceListItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of PriceListService */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PriceListServiceImpl implements PriceListService {

  private final PriceListItemRepository priceListItemRepository;
  private final PriceListItemMapper priceListItemMapper;

  @Override
  @Transactional(readOnly = true)
  public Page<PriceListItemInfo> listPriceListItems(
      ServiceCategoryType categoryCode, Boolean active, Pageable pageable) {
    log.debug("Listing price list items with categoryCode: {}, active: {}", categoryCode, active);

    Page<PriceListItem> page;

    if (categoryCode != null && active != null && active) {
      page = priceListItemRepository.findByCategoryCodeAndActiveTrue(categoryCode, pageable);
    } else if (active != null && active) {
      page = priceListItemRepository.findByActiveTrue(pageable);
    } else if (categoryCode != null) {
      page = priceListItemRepository.findByCategoryCode(categoryCode, pageable);
    } else {
      page = priceListItemRepository.findAll(pageable);
    }

    List<PriceListItemInfo> dtos =
        page.getContent().stream()
            .map(priceListItemMapper::toPriceListItemInfo)
            .collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, page.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public PriceListItemInfo getPriceListItemById(UUID priceListItemId) {
    log.debug("Getting price list item by id: {}", priceListItemId);

    PriceListItem item =
        priceListItemRepository
            .findById(priceListItemId)
            .orElseThrow(
                () -> new NotFoundException("PriceListItem not found with id: " + priceListItemId));

    return priceListItemMapper.toPriceListItemInfo(item);
  }

  @Override
  public int importFromCsv(String csvContent) {
    log.info("Importing price list from CSV");

    // This would be implemented with CSV parsing logic
    // For now, returning 0 as placeholder
    // The actual import is done via Liquibase migration

    log.warn("CSV import not implemented - use Liquibase migration instead");
    return 0;
  }

  @Override
  @Transactional(readOnly = true)
  public List<PriceListItemInfo> getPriceListItemsByCategory(ServiceCategoryType categoryCode) {
    log.debug("Getting price list items by category: {}", categoryCode);

    Page<PriceListItem> items =
        priceListItemRepository.findByCategoryCodeAndActiveTrue(categoryCode, Pageable.unpaged());

    return items.stream()
        .map(priceListItemMapper::toPriceListItemInfo)
        .collect(Collectors.toList());
  }

  @Override
  public int synchronizePrices() {
    log.info("Synchronizing prices from price list to service items");

    // This would be implemented to sync PriceListItem prices to ServiceItem
    // For now, returning 0 as placeholder

    log.warn("Price synchronization not implemented yet");
    return 0;
  }

  @Override
  @Transactional(readOnly = true)
  public PriceListItemInfo getPriceListItemByCatalogNumber(Integer catalogNumber) {
    log.debug("Getting price list item by catalog number: {}", catalogNumber);

    PriceListItem item = priceListItemRepository.findByCatalogNumber(catalogNumber).orElse(null);

    return item != null ? priceListItemMapper.toPriceListItemInfo(item) : null;
  }
}
