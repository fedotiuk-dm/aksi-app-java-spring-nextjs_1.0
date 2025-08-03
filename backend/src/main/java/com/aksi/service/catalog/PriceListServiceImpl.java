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

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.PriceListItemsResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.catalog.PriceListItem;
import com.aksi.domain.catalog.ServiceItem;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.catalog.PriceListItemMapper;
import com.aksi.repository.catalog.ItemRepository;
import com.aksi.repository.catalog.PriceListItemRepository;
import com.aksi.repository.catalog.ServiceItemRepository;

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
  private final ItemRepository itemRepository;
  private final ServiceItemRepository serviceItemRepository;

  private Page<PriceListItemInfo> listPriceListItems(
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
  @Transactional(readOnly = true)
  public PriceListItemsResponse listPriceListItems(
      ServiceCategoryType categoryCode, Boolean active, Integer offset, Integer limit) {
    int pageNumber = (offset != null && limit != null && limit > 0) ? offset / limit : 0;
    int pageSize = (limit != null && limit > 0) ? limit : 20;

    Page<PriceListItemInfo> page =
        listPriceListItems(
            categoryCode,
            active,
            PageRequest.of(pageNumber, pageSize, Sort.by("sortOrder").ascending()));

    PriceListItemsResponse response = new PriceListItemsResponse();
    response.setPriceListItems(page.getContent());
    response.setTotalCount((int) page.getTotalElements());
    return response;
  }

  // Admin functionality methods - kept for future use
  // These methods are essential for price management and synchronization
  
  /**
   * Synchronize prices from price list to service items
   * Used by admin to update all service item prices based on current price list
   */
  @Override
  @Transactional
  public int synchronizePrices() {
    log.info("Synchronizing prices from price list to service items");
    
    List<PriceListItem> priceListItems = priceListItemRepository.findAllActiveOrderedByCategoryAndNumber();
    int updatedCount = 0;
    
    for (PriceListItem priceListItem : priceListItems) {
      itemRepository.findByCatalogNumber(priceListItem.getCatalogNumber())
          .ifPresent(itemCatalog -> {
            Page<ServiceItem> serviceItems = serviceItemRepository
                .findByItemCatalogId(itemCatalog.getId(), Pageable.unpaged());
            
            serviceItems.forEach(serviceItem -> {
              if (updateServiceItemFromPriceList(serviceItem, priceListItem)) {
                serviceItemRepository.save(serviceItem);
                log.debug("Updated prices for service: {} and item: {}", 
                    serviceItem.getServiceCatalog().getCode(), 
                    itemCatalog.getCode());
              }
            });
          });
      updatedCount++;
    }
    
    log.info("Price synchronization completed. Processed {} price list items", updatedCount);
    return updatedCount;
  }
  
  private boolean updateServiceItemFromPriceList(ServiceItem serviceItem, PriceListItem priceListItem) {
    boolean updated = false;
    
    // Update base price
    if (!priceListItem.getBasePrice().equals(serviceItem.getBasePrice())) {
      serviceItem.setBasePrice(priceListItem.getBasePrice());
      updated = true;
    }
    
    // Update black price if exists
    if (priceListItem.getPriceBlack() != null && 
        !priceListItem.getPriceBlack().equals(serviceItem.getPriceBlack())) {
      serviceItem.setPriceBlack(priceListItem.getPriceBlack());
      updated = true;
    }
    
    // Update color price if exists
    if (priceListItem.getPriceColor() != null && 
        !priceListItem.getPriceColor().equals(serviceItem.getPriceColor())) {
      serviceItem.setPriceColor(priceListItem.getPriceColor());
      updated = true;
    }
    
    return updated;
  }

  /**
   * Get distinct active categories for filtering
   * Used in admin UI for category dropdown
   */
  @Override
  @Transactional(readOnly = true)
  public List<ServiceCategoryType> getDistinctActiveCategories() {
    log.debug("Getting distinct active categories from price list");
    
    List<ServiceCategoryType> categories = priceListItemRepository.findDistinctActiveCategories();
    log.debug("Found {} distinct active categories", categories.size());
    
    return categories;
  }

  /**
   * Export all active price list items
   * Used for generating reports or CSV exports
   */
  @Override
  @Transactional(readOnly = true)
  public List<PriceListItemInfo> exportActivePriceList() {
    log.debug("Exporting all active price list items");
    
    List<PriceListItem> items = priceListItemRepository.findAllActiveOrderedByCategoryAndNumber();
    
    List<PriceListItemInfo> dtos = items.stream()
        .map(priceListItemMapper::toPriceListItemInfo)
        .collect(Collectors.toList());
    
    log.info("Exported {} active price list items", dtos.size());
    return dtos;
  }

  /**
   * Get price list item by category and catalog number
   * Used for price lookups during order processing
   */
  @Override
  @Transactional(readOnly = true)
  public PriceListItemInfo getPriceListItemByCategoryAndCatalogNumber(
      ServiceCategoryType categoryCode, Integer catalogNumber) {
    log.debug("Getting price list item by category: {} and catalog number: {}", 
        categoryCode, catalogNumber);
    
    PriceListItem item = priceListItemRepository
        .findByCategoryCodeAndCatalogNumber(categoryCode, catalogNumber)
        .orElse(null);
    
    return item != null ? priceListItemMapper.toPriceListItemInfo(item) : null;
  }
  
  @Override
  @Transactional(readOnly = true)
  public PriceListItemInfo getPriceListItemByCatalogNumber(Integer catalogNumber) {
    log.debug("Getting price list item by catalog number: {}", catalogNumber);

    PriceListItem item = priceListItemRepository.findByCatalogNumber(catalogNumber).orElse(null);

    return item != null ? priceListItemMapper.toPriceListItemInfo(item) : null;
  }
}
