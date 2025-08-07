package com.aksi.service.catalog;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.CreatePriceListItemRequest;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.UpdatePriceListItemRequest;
import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.PriceListItemMapper;
import com.aksi.repository.PriceListItemRepository;
import com.aksi.validator.PriceListItemValidationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for price list write operations. Handles creation, modification, and deletion of
 * price list items.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PriceListCommandService {

  private final PriceListItemRepository priceListItemRepository;
  private final PriceListItemMapper priceListItemMapper;
  private final PriceListItemValidationService validationService;
  private final PriceListQueryService queryService;

  /**
   * Create new price list item.
   *
   * @param request Create request
   * @return Created price list item info
   */
  public PriceListItemInfo createPriceListItem(CreatePriceListItemRequest request) {
    log.info(
        "Creating new price list item: {} - {}",
        request.getCategoryCode(),
        request.getCatalogNumber());

    // Validate business rules
    validationService.validateCreate(request);
    validationService.validatePrices(request.getBasePrice(), request.getExpressPrice());

    // Map to entity
    PriceListItemEntity item = priceListItemMapper.toEntity(request);

    // Apply business defaults
    applySortOrderDefault(item);

    // Save and return
    PriceListItemEntity saved = priceListItemRepository.save(item);
    log.info("Created price list item with ID: {}", saved.getId());

    return priceListItemMapper.toPriceListItemInfo(saved);
  }

  /**
   * Update existing price list item.
   *
   * @param priceListItemId Item ID
   * @param request Update request
   * @return Updated price list item info
   */
  public PriceListItemInfo updatePriceListItem(
      UUID priceListItemId, UpdatePriceListItemRequest request) {
    log.info("Updating price list item: {}", priceListItemId);

    // Get existing item
    PriceListItemEntity item = queryService.getPriceListItemEntityById(priceListItemId);

    // Validate prices if provided
    validationService.validateUpdatePrices(request, item);

    // Update entity (only non-null values)
    priceListItemMapper.updateEntityFromRequest(request, item);

    // Save and return
    PriceListItemEntity updated = priceListItemRepository.save(item);
    log.info("Updated price list item: {}", priceListItemId);

    return priceListItemMapper.toPriceListItemInfo(updated);
  }

  /**
   * Delete price list item.
   *
   * @param priceListItemId Item ID to delete
   * @throws NotFoundException if item not found
   */
  public void deletePriceListItem(UUID priceListItemId) {
    log.info("Deleting price list item: {}", priceListItemId);

    if (!priceListItemRepository.existsById(priceListItemId)) {
      throw new NotFoundException("Price list item not found: " + priceListItemId);
    }

    priceListItemRepository.deleteById(priceListItemId);
    log.info("Deleted price list item: {}", priceListItemId);
  }

  /**
   * Synchronize prices (placeholder for future implementation).
   *
   * @return Number of synchronized items (always 0)
   */
  public int synchronizePrices() {
    log.info("Price synchronization is no longer needed with simplified catalog structure");
    // With the simplified catalog, prices are managed directly in PriceListItem
    return 0;
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
