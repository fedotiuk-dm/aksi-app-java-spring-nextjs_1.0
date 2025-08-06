package com.aksi.service.pricing;

import com.aksi.api.cart.dto.CartItemPricingInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;

/** Service for calculating cart prices */
public interface CartPricingService {

  /**
   * Calculate pricing for entire cart
   *
   * @param cartEntityEntity Cart entity
   * @return Cart pricing info
   */
  CartPricingInfo calculateCartPricing(CartEntity cartEntityEntity);

  /**
   * Calculate pricing for single cart item
   *
   * @param cartItem Cart item entity
   * @param urgencyType Urgency type from cart
   * @param discountType Discount type from cart
   * @param discountPercentage Discount percentage (for OTHER type)
   * @return Cart item pricing info
   */
  CartItemPricingInfo calculateItemPricing(
      CartItem cartItem, String urgencyType, String discountType, Integer discountPercentage);

  /**
   * Check if discount is applicable for given category
   *
   * @param categoryCode Category code
   * @param discountType Discount type
   * @return true if discount can be applied
   */
  boolean isDiscountApplicable(String categoryCode, String discountType);
}
