package com.aksi.service.pricing;

import com.aksi.api.cart.dto.CartItemPricingInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;

/** Service for calculating cart prices */
public interface CartPricingService {

  /**
   * Get pricing for entire cart
   *
   * @param cartEntity Cart entity
   * @return Cart pricing info
   */
  CartPricingInfo getCartPricing(CartEntity cartEntity);

  /**
   * Get pricing for single cart item
   *
   * @param cartItem Cart item entity
   * @param urgencyType Urgency type from cart
   * @param discountType Discount type from cart
   * @param discountPercentage Discount percentage (for OTHER type)
   * @return Cart item pricing info
   */
  CartItemPricingInfo getItemPricing(
      CartItem cartItem, String urgencyType, String discountType, Integer discountPercentage);
}
