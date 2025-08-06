package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.CreatePriceListItemRequest;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.PriceListItemsResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.api.service.dto.UpdatePriceListItemRequest;
import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.PriceListItemMapper;
import com.aksi.repository.PriceListItemRepository;
import com.aksi.repository.PriceListItemSpecification;
import com.aksi.validator.PriceListItemValidationService;

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
  private final PriceListItemValidationService validationService;
  private final CategoryManagementService categoryManagementService;

  private Page<PriceListItemInfo> listPriceListItems(
      ServiceCategoryType categoryCode, Boolean active, Pageable pageable) {
    log.debug("Listing price list items with categoryCode: {}, active: {}", categoryCode, active);

    // Build specification dynamically based on parameters
    Specification<PriceListItemEntity> spec =
        PriceListItemSpecification.hasCategory(categoryCode)
            .and(PriceListItemSpecification.isActive(active));

    // Execute query with specification
    Page<PriceListItemEntity> page = priceListItemRepository.findAll(spec, pageable);

    // Map to DTOs
    List<PriceListItemInfo> dtos =
        page.getContent().stream().map(this::mapToPriceListItemInfo).toList();

    return new PageImpl<>(dtos, pageable, page.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public PriceListItemInfo getPriceListItemById(UUID priceListItemId) {
    log.debug("Getting price list item by id: {}", priceListItemId);

    PriceListItemEntity item =
        priceListItemRepository
            .findById(priceListItemId)
            .orElseThrow(
                () -> new NotFoundException("PriceListItem not found with id: " + priceListItemId));

    return mapToPriceListItemInfo(item);
  }

  @Override
  @Transactional(readOnly = true)
  public PriceListItemsResponse listPriceListItems(
      ServiceCategoryType categoryCode, Boolean active, Integer offset, Integer limit) {
    // Improve pagination parameter handling
    int safeOffset = offset != null && offset >= 0 ? offset : 0;
    int safeLimit = limit != null && limit > 0 ? Math.min(limit, 100) : 20; // Max 100 items
    int pageNumber = safeOffset / safeLimit;

    Page<PriceListItemInfo> page =
        listPriceListItems(
            categoryCode,
            active,
            PageRequest.of(
                pageNumber,
                safeLimit,
                Sort.by("categoryCode").ascending().and(Sort.by("catalogNumber").ascending())));

    PriceListItemsResponse response = new PriceListItemsResponse();
    response.setPriceListItems(page.getContent());
    response.setTotalItems((int) page.getTotalElements());
    response.setHasMore(page.hasNext());
    return response;
  }

  // Admin functionality methods - kept for future use
  // These methods are essential for price management and synchronization

  /** Synchronize prices - deprecated method, no longer needed with simplified catalog */
  @Override
  @Transactional
  public int synchronizePrices() {
    log.info("Price synchronization is no longer needed with simplified catalog structure");
    // With the simplified catalog, prices are managed directly in PriceListItem
    // No synchronization needed
    return 0;
  }

  /** Get distinct active categories for filtering Used in admin UI for category dropdown */
  @Override
  @Transactional(readOnly = true)
  public List<ServiceCategoryType> getDistinctActiveCategories() {
    log.debug("Getting distinct active categories from price list");

    List<ServiceCategoryType> categories = priceListItemRepository.findDistinctActiveCategories();
    log.debug("Found {} distinct active categories", categories.size());

    return categories;
  }

  /** Export all active price list items Used for generating reports or CSV exports */
  @Override
  @Transactional(readOnly = true)
  public List<PriceListItemInfo> exportActivePriceList() {
    log.debug("Exporting all active price list items");

    List<PriceListItemEntity> items =
        priceListItemRepository.findAllActiveOrderedByCategoryAndNumber();

    List<PriceListItemInfo> dtos = items.stream().map(this::mapToPriceListItemInfo).toList();

    log.info("Exported {} active price list items", dtos.size());
    return dtos;
  }

  /**
   * Get price list item by category and catalog number Used for price lookups during order
   * processing
   */
  @Override
  @Transactional(readOnly = true)
  public PriceListItemInfo getPriceListItemByCategoryAndCatalogNumber(
      ServiceCategoryType categoryCode, Integer catalogNumber) {
    log.debug(
        "Getting price list item by category: {} and catalog number: {}",
        categoryCode,
        catalogNumber);

    PriceListItemEntity item =
        priceListItemRepository
            .findByCategoryCodeAndCatalogNumber(categoryCode, catalogNumber)
            .orElse(null);

    return item != null ? mapToPriceListItemInfo(item) : null;
  }

  @Override
  @Transactional(readOnly = true)
  public PriceListItemInfo getPriceListItemByCatalogNumber(Integer catalogNumber) {
    log.debug("Getting price list item by catalog number: {}", catalogNumber);

    PriceListItemEntity item =
        priceListItemRepository.findByCatalogNumber(catalogNumber).orElse(null);

    return item != null ? mapToPriceListItemInfo(item) : null;
  }

  @Override
  @Transactional
  public PriceListItemInfo createPriceListItem(CreatePriceListItemRequest request) {
    log.info(
        "Creating new price list item: {} - {}",
        request.getCategoryCode(),
        request.getCatalogNumber());

    // Validate business rules
    validationService.validateCreate(request);
    validationService.validatePrices(request.getBasePrice(), request.getExpressPrice());

    // Map to entity using MapStruct
    PriceListItemEntity item = priceListItemMapper.toEntity(request);

    // Apply business defaults
    applySortOrderDefault(item);

    // Save and return
    PriceListItemEntity saved = priceListItemRepository.save(item);
    log.info("Created price list item with ID: {}", saved.getId());

    return priceListItemMapper.toPriceListItemInfo(saved);
  }

  @Override
  @Transactional
  public PriceListItemInfo updatePriceListItem(
      UUID priceListItemId, UpdatePriceListItemRequest request) {
    log.info("Updating price list item: {}", priceListItemId);

    PriceListItemEntity item =
        priceListItemRepository
            .findById(priceListItemId)
            .orElseThrow(
                () -> new NotFoundException("Price list item not found: " + priceListItemId));

    // Validate prices using improved validation
    validationService.validateUpdatePrices(request, item);

    // Update entity using MapStruct (only non-null values)
    priceListItemMapper.updateEntityFromRequest(request, item);

    PriceListItemEntity updated = priceListItemRepository.save(item);
    log.info("Updated price list item: {}", priceListItemId);

    return priceListItemMapper.toPriceListItemInfo(updated);
  }

  @Override
  @Transactional
  public void deletePriceListItem(UUID priceListItemId) {
    log.info("Deleting price list item: {}", priceListItemId);

    if (!priceListItemRepository.existsById(priceListItemId)) {
      throw new NotFoundException("Price list item not found: " + priceListItemId);
    }

    priceListItemRepository.deleteById(priceListItemId);
    log.info("Deleted price list item: {}", priceListItemId);
  }

  // Category management methods

  @Override
  @Transactional(readOnly = true)
  public List<CategoryManagementService.CategoryInfo> getAllCategoriesInfo() {
    return categoryManagementService.getAllCategories();
  }

  @Override
  @Transactional
  public int deactivateCategory(ServiceCategoryType categoryCode) {
    return categoryManagementService.deactivateCategory(categoryCode);
  }

  @Override
  @Transactional
  public int activateCategory(ServiceCategoryType categoryCode) {
    return categoryManagementService.activateCategory(categoryCode);
  }

  // Helper method for mapping - can be removed if not used elsewhere
  private PriceListItemInfo mapToPriceListItemInfo(PriceListItemEntity item) {
    return priceListItemMapper.toPriceListItemInfo(item);
  }

  /**
   * Apply business default values to price list item. Sets sortOrder to catalogNumber if it's 0
   * (default).
   *
   * @param item Price list item to apply defaults to
   */
  private void applySortOrderDefault(PriceListItemEntity item) {
    if (item.getSortOrder() != null && item.getSortOrder() == 0) {
      item.setSortOrder(item.getCatalogNumber());
    }
  }
}
