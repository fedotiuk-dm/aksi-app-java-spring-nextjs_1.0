package com.aksi.validator;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.api.pricelist.dto.CreatePriceListItemRequest;
import com.aksi.api.pricelist.dto.ServiceCategoryType;
import com.aksi.api.pricelist.dto.UpdatePriceListItemRequest;
import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.exception.BadRequestException;
import com.aksi.repository.PriceListItemRepository;

import lombok.RequiredArgsConstructor;

/** Validation service for PriceListItem operations. Centralizes business validation logic. */
@Service
@RequiredArgsConstructor
public class PriceListItemValidationService {

  private final PriceListItemRepository priceListItemRepository;

  /**
   * Validates that a new price list item can be created. Checks for duplicate category/catalog
   * number combination.
   *
   * @param request Create request to validate
   * @throws BadRequestException if validation fails
   */
  public void validateCreate(CreatePriceListItemRequest request) {
    validateUniqueness(request.getCategoryCode(), request.getCatalogNumber(), null);
  }

  /**
   * Validates uniqueness of category code and catalog number combination.
   *
   * @param categoryCode Category code to check
   * @param catalogNumber Catalog number to check
   * @param excludeId ID to exclude from check (for updates)
   * @throws BadRequestException if combination already exists
   */
  public void validateUniqueness(
      ServiceCategoryType categoryCode, Integer catalogNumber, UUID excludeId) {
    boolean exists =
        priceListItemRepository
            .findByCategoryCodeAndCatalogNumber(categoryCode, catalogNumber)
            .filter(item -> !item.getId().equals(excludeId))
            .isPresent();

    if (exists) {
      throw new BadRequestException(
          String.format(
              "Price list item with category %s and catalog number %d already exists",
              categoryCode, catalogNumber));
    }
  }

  /**
   * Validates that price values are logical.
   *
   * @param basePrice Base price
   * @param expressPrice Express price (optional)
   * @throws BadRequestException if prices are invalid
   */
  public void validatePrices(Integer basePrice, Integer expressPrice) {
    if (basePrice != null && basePrice < 0) {
      throw new BadRequestException("Base price cannot be negative");
    }

    if (expressPrice != null && expressPrice < 0) {
      throw new BadRequestException("Express price cannot be negative");
    }

    if (expressPrice != null && basePrice != null && expressPrice < basePrice) {
      throw new BadRequestException("Express price cannot be less than base price");
    }
  }

  /**
   * Validates prices for update request. Handles null values by using existing prices from the
   * item.
   *
   * @param request Update request
   * @param existingItem Existing price list item
   * @throws BadRequestException if prices are invalid
   */
  public void validateUpdatePrices(
      UpdatePriceListItemRequest request, PriceListItemEntity existingItem) {
    // Only validate if prices are being updated
    if (request.getBasePrice() == null && request.getExpressPrice() == null) {
      return;
    }

    Integer basePrice =
        request.getBasePrice() != null ? request.getBasePrice() : existingItem.getBasePrice();
    Integer expressPrice =
        request.getExpressPrice() != null
            ? request.getExpressPrice()
            : existingItem.getExpressPrice();

    validatePrices(basePrice, expressPrice);
  }
}
