package com.aksi.service.order;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.service.catalog.PriceListService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for calculating prices during order creation.
 * Demonstrates usage of PriceListService lookup methods.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderPriceCalculator {

  private final PriceListService priceListService;

  /**
   * Calculate price for an item based on catalog number
   * This method demonstrates usage of getPriceListItemByCatalogNumber
   */
  public Double calculateItemPrice(Integer catalogNumber, Integer quantity) {
    log.debug("Calculating price for catalog number: {}, quantity: {}", catalogNumber, quantity);
    
    PriceListItemInfo priceItem = priceListService.getPriceListItemByCatalogNumber(catalogNumber);
    if (priceItem == null) {
      log.warn("No price found for catalog number: {}", catalogNumber);
      return null;
    }
    
    Double basePrice = priceItem.getBasePrice();
    return basePrice * quantity;
  }

  /**
   * Calculate price for specific category and catalog number
   * This method demonstrates usage of getPriceListItemByCategoryAndCatalogNumber
   */
  public Double calculateCategoryItemPrice(ServiceCategoryType category, Integer catalogNumber, Integer quantity) {
    log.debug("Calculating price for category: {}, catalog number: {}, quantity: {}", 
        category, catalogNumber, quantity);
    
    PriceListItemInfo priceItem = priceListService.getPriceListItemByCategoryAndCatalogNumber(category, catalogNumber);
    if (priceItem == null) {
      log.warn("No price found for category: {} and catalog number: {}", category, catalogNumber);
      return null;
    }
    
    Double basePrice = priceItem.getBasePrice();
    return basePrice * quantity;
  }

  /**
   * Example method showing how price calculation would work in order creation
   */
  public void calculateOrderItemPrice(UUID orderId, UUID itemId, Integer quantity, boolean isColorItem) {
    // This is example of how these lookup methods would be used
    // In real implementation, this would:
    // 1. Look up item by ID to get catalog number
    // 2. Use getPriceListItemByCatalogNumber to get current price
    // 3. Apply color pricing if needed
    // 4. Calculate total with quantity
    log.info("Price calculation example for order: {}, item: {}", orderId, itemId);
  }
}