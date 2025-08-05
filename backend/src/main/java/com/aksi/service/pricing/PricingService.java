package com.aksi.service.pricing;

import java.util.List;

import com.aksi.api.pricing.dto.DiscountsResponse;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PriceModifiersResponse;

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
  PriceModifiersResponse listPriceModifiers(String categoryCode, Boolean active);

  /**
   * List available discounts
   *
   * @param active Filter by active status
   * @return Discounts response
   */
  DiscountsResponse listDiscounts(Boolean active);

  /**
   * Get modifiers applicable to specific category
   *
   * @param categoryCode Category code
   * @return List of applicable modifiers
   */
  List<String> getApplicableModifierCodes(String categoryCode);

  /**
   * Check if discount is applicable to category
   *
   * @param discountCode Discount code
   * @param categoryCode Category code
   * @return true if discount is applicable
   */
  boolean isDiscountApplicableToCategory(String discountCode, String categoryCode);
}
