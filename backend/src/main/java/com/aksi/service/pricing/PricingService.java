package com.aksi.service.pricing;

import com.aksi.api.pricing.dto.Discount;
import com.aksi.api.pricing.dto.DiscountsResponse;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PriceModifier;
import com.aksi.api.pricing.dto.PriceModifiersResponse;
import com.aksi.api.pricing.dto.ServiceCategoryType;

/** Service for price calculations and pricing rules management */
public interface PricingService {

  /**
   * Calculate prices for items with modifiers and global settings
   *
   * @param request Price calculation request
   * @return Detailed price calculation response
   */
  PriceCalculationResponse calculatePrice(PriceCalculationRequest request);

  /**
   * List available price modifiers
   *
   * @param categoryCode Filter by category code (optional)
   * @param active Filter by active status
   * @return Price modifiers response
   */
  PriceModifiersResponse listPriceModifiers(
      ServiceCategoryType categoryCode, Boolean active, String sortBy, String sortOrder);

  /**
   * List available discounts
   *
   * @param active Filter by active status
   * @return Discounts response
   */
  DiscountsResponse listDiscounts(Boolean active, String sortBy, String sortOrder);

  /**
   * Check if discount is applicable to category
   *
   * @param discountCode Discount code
   * @param categoryCode Category code
   * @return true if discount is applicable
   */
  boolean isDiscountApplicableToCategory(String discountCode, String categoryCode);

  // CRUD operations for Price Modifiers

  /**
   * Create a new price modifier
   *
   * @param priceModifierDto Price modifier data
   * @return Created price modifier
   */
  PriceModifier createPriceModifier(PriceModifier priceModifierDto);

  /**
   * Update an existing price modifier
   *
   * @param code Price modifier code
   * @param priceModifierDto Updated price modifier data
   * @return Updated price modifier
   */
  PriceModifier updatePriceModifier(String code, PriceModifier priceModifierDto);

  /**
   * Delete a price modifier
   *
   * @param code Price modifier code
   */
  void deletePriceModifier(String code);

  // CRUD operations for Discounts

  /**
   * Create a new discount
   *
   * @param discountDto Discount data
   * @return Created discount
   */
  Discount createDiscount(Discount discountDto);

  /**
   * Update an existing discount
   *
   * @param code Discount code
   * @param discountDto Updated discount data
   * @return Updated discount
   */
  Discount updateDiscount(String code, Discount discountDto);

  /**
   * Delete a discount
   *
   * @param code Discount code
   */
  void deleteDiscount(String code);
}
