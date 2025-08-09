package com.aksi.service.pricing.guard;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.api.pricing.dto.ServiceCategoryType;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.domain.pricing.DiscountEntity;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.DiscountRepository;
import com.aksi.repository.PriceModifierRepository;
import com.aksi.service.catalog.PriceListService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guard service for pricing domain validations and entity loading. Centralizes all pricing-related
 * guards and entity retrieval. Follows OrderGuard pattern for consistent architecture.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PricingGuard {

  private final PriceModifierRepository priceModifierRepository;
  private final DiscountRepository discountRepository;
  private final PriceListService priceListService;

  /**
   * Load multiple active price modifiers by codes. Filters out inactive or non-existent modifiers.
   */
  public List<PriceModifierEntity> loadActiveModifiers(List<String> codes) {
    return codes.stream()
        .map(
            code ->
                priceModifierRepository
                    .findByCode(code)
                    .filter(PriceModifierEntity::isActive)
                    .orElse(null))
        .filter(Objects::nonNull)
        .toList();
  }

  /** Load and validate price list item by ID. Throws NotFoundException if item doesn't exist. */
  public PriceListItemInfo loadPriceListItem(UUID priceListItemId) {
    PriceListItemInfo item = priceListService.getPriceListItemById(priceListItemId);

    if (item == null) {
      throw new NotFoundException("Price list item not found: " + priceListItemId);
    }

    return item;
  }

  /**
   * Validate quantity is positive and reasonable. Throws IllegalArgumentException for invalid
   * quantities.
   */
  public void ensureQuantityValid(int quantity) {
    if (quantity <= 0) {
      throw new IllegalArgumentException("Quantity must be positive: " + quantity);
    }

    if (quantity > 1000) { // Reasonable upper limit
      throw new IllegalArgumentException("Quantity too large: " + quantity);
    }
  }

  /**
   * Validate that price list item has necessary pricing data. Throws IllegalArgumentException if
   * base price is not set.
   */
  public void ensurePriceListItemValid(PriceListItemInfo priceListItem) {
    if (priceListItem.getBasePrice() == null || priceListItem.getBasePrice() <= 0) {
      throw new IllegalArgumentException(
          String.format("Price list item '%s' has invalid base price", priceListItem.getId()));
    }
  }

  // ===== ENTITY UNIQUENESS GUARDS =====

  /** Ensure price modifier code is unique. Throws ConflictException if code already exists. */
  public void ensurePriceModifierCodeUnique(String code) {
    if (priceModifierRepository.existsByCode(code)) {
      throw new ConflictException("Price modifier with code '" + code + "' already exists");
    }
  }

  /** Ensure discount code is unique. Throws ConflictException if code already exists. */
  public void ensureDiscountCodeUnique(String code) {
    if (discountRepository.existsByCode(code)) {
      throw new ConflictException("Discount with code '" + code + "' already exists");
    }
  }

  /** Load price modifier by code or throw NotFoundException. */
  public PriceModifierEntity loadPriceModifierByCode(String code) {
    return priceModifierRepository
        .findByCode(code)
        .orElseThrow(() -> new NotFoundException("Price modifier not found: " + code));
  }

  /** Load discount by code or throw NotFoundException. */
  public DiscountEntity loadDiscountByCode(String code) {
    return discountRepository
        .findByCode(code)
        .orElseThrow(() -> new NotFoundException("Discount not found: " + code));
  }

  /** Validate that price modifier deletion is allowed. */
  public void ensurePriceModifierDeletionAllowed(PriceModifierEntity modifier) {
    log.debug("Validating deletion for price modifier: {}", modifier.getCode());
    // Check if modifier is being used in active orders, calculations, etc.
    // For now, allow all deletions - can add business rules later
  }

  /** Validate that discount deletion is allowed. */
  public void ensureDiscountDeletionAllowed(DiscountEntity discount) {
    log.debug("Validating deletion for discount: {}", discount.getCode());
    // Check if discount is being used in active orders, calculations, etc.
    // For now, allow all deletions - can add business rules later
  }

  // ===== ENTITY LOADING WITH FILTERS =====

  /**
   * Load price modifier entities with proper filtering for query operations. Centralizes entity
   * loading logic from PricingQueryService.
   */
  public List<PriceModifierEntity> loadPriceModifierEntities(
      ServiceCategoryType categoryCode, Boolean active) {
    if (categoryCode != null) {
      return priceModifierRepository.findActiveByCategoryCode(categoryCode.getValue());
    } else if (active == null || active) {
      return priceModifierRepository.findAllActiveOrderedBySortOrder();
    } else {
      return priceModifierRepository.findAll();
    }
  }

  /**
   * Load discount entities with proper filtering for query operations. Centralizes entity loading
   * logic from PricingQueryService.
   */
  public List<DiscountEntity> loadDiscountEntities(Boolean active) {
    if (active == null || active) {
      return discountRepository.findAllActiveOrderedBySortOrder();
    } else {
      return discountRepository.findAll();
    }
  }
}
