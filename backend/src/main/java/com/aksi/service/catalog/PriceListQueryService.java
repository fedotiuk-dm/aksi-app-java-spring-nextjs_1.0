package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.PriceListItemsResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.PriceListItemMapper;
import com.aksi.repository.PriceListItemRepository;
import com.aksi.repository.PriceListItemSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for price list read operations. All methods are read-only and optimized for
 * queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PriceListQueryService {

  private final PriceListItemRepository priceListItemRepository;
  private final PriceListItemMapper priceListItemMapper;

  /**
   * Get price list item by ID or throw exception.
   *
   * @param priceListItemId Price list item ID
   * @return Price list item entity
   * @throws NotFoundException if not found
   */
  public PriceListItemEntity getPriceListItemEntityById(UUID priceListItemId) {
    return priceListItemRepository
        .findById(priceListItemId)
        .orElseThrow(
            () -> new NotFoundException("PriceListItem not found with id: " + priceListItemId));
  }

  /**
   * Get price list item info by ID.
   *
   * @param priceListItemId Price list item ID
   * @return Price list item info
   */
  public PriceListItemInfo getPriceListItemById(UUID priceListItemId) {
    log.debug("Getting price list item by id: {}", priceListItemId);
    PriceListItemEntity item = getPriceListItemEntityById(priceListItemId);
    return priceListItemMapper.toPriceListItemInfo(item);
  }

  /**
   * List price list items with pagination.
   *
   * @param categoryCode Filter by category
   * @param active Filter by active status
   * @param offset Number of items to skip
   * @param limit Number of items to return
   * @return Price list items response
   */
  public PriceListItemsResponse listPriceListItems(
      ServiceCategoryType categoryCode, Boolean active, Integer offset, Integer limit) {

    // Same approach as CustomerController - OpenAPI validates parameters
    Pageable pageable =
        PageRequest.of(
            offset / limit,
            limit,
            Sort.by("categoryCode").ascending().and(Sort.by("catalogNumber").ascending()));

    // Build specification
    Specification<PriceListItemEntity> spec =
        PriceListItemSpecification.hasCategory(categoryCode)
            .and(PriceListItemSpecification.hasActive(active));

    // Execute query
    Page<PriceListItemEntity> page = priceListItemRepository.findAll(spec, pageable);

    // Map to response
    List<PriceListItemInfo> items =
        page.getContent().stream().map(priceListItemMapper::toPriceListItemInfo).toList();

    PriceListItemsResponse response = new PriceListItemsResponse();
    response.setPriceListItems(items);
    response.setTotalItems((int) page.getTotalElements());
    response.setHasMore(page.hasNext());

    return response;
  }

  /**
   * Get distinct active categories.
   *
   * @return List of active category types
   */
  public List<ServiceCategoryType> getDistinctActiveCategories() {
    log.debug("Getting distinct active categories");
    List<ServiceCategoryType> categories = priceListItemRepository.findDistinctActiveCategories();
    log.debug("Found {} distinct active categories", categories.size());
    return categories;
  }

  /**
   * Export all active price list items.
   *
   * @return List of all active items
   */
  public List<PriceListItemInfo> exportActivePriceList() {
    log.debug("Exporting all active price list items");

    List<PriceListItemInfo> items =
        priceListItemRepository.findAllActiveOrderedByCategoryAndNumber().stream()
            .map(priceListItemMapper::toPriceListItemInfo)
            .toList();

    log.info("Exported {} active price list items", items.size());
    return items;
  }
}
