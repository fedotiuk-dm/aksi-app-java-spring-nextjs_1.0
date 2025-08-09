package com.aksi.service.pricing;

import org.springframework.stereotype.Service;

import com.aksi.api.cart.dto.CartItemPricingInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Thin facade implementation of CartPricingService following OrderServiceImpl pattern. Delegates
 * all operations to specialized services - no business logic here.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CartPricingServiceImpl implements CartPricingService {

  private final CartPricingQueryService queryService;

  @Override
  public CartPricingInfo calculateCartPricing(CartEntity cartEntity) {
    log.debug(
        "Delegating cart pricing calculation for cart with {} items", cartEntity.getItems().size());
    return queryService.calculateCartPricing(cartEntity);
  }

  @Override
  public CartItemPricingInfo calculateItemPricing(
      CartItem cartItem, String urgencyType, String discountType, Integer discountPercentage) {
    log.debug(
        "Delegating item pricing calculation for cart item: {}",
        cartItem.getPriceListItemEntity().getId());
    return queryService.calculateItemPricing(
        cartItem, urgencyType, discountType, discountPercentage);
  }

  @Override
  public boolean isDiscountApplicable(String categoryCode, String discountType) {
    log.debug(
        "Delegating discount applicability check for category: {}, discount: {}",
        categoryCode,
        discountType);
    return queryService.isDiscountApplicable(categoryCode, discountType);
  }
}
