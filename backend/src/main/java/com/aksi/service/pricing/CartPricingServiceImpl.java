package com.aksi.service.pricing;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.api.cart.dto.CartItemPricingInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.api.cart.dto.ModifierDetail;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.ItemCharacteristics;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemModifierEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of cart pricing calculations using PricingService */
@Slf4j
@Service
@RequiredArgsConstructor
public class CartPricingServiceImpl implements CartPricingService {

  private final PricingService pricingService;

  @Override
  public CartPricingInfo calculateCartPricing(CartEntity cartEntityEntity) {
    // Convert cart to PriceCalculationRequest
    PriceCalculationRequest request = buildPriceCalculationRequest(cartEntityEntity);

    // Use PricingService to calculate
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Convert response to CartPricingInfo
    CartPricingInfo pricing = new CartPricingInfo();
    pricing.setItemsSubtotal(response.getTotals().getItemsSubtotal());
    pricing.setUrgencyAmount(response.getTotals().getUrgencyAmount());
    pricing.setDiscountAmount(response.getTotals().getDiscountAmount());
    pricing.setDiscountApplicableAmount(response.getTotals().getDiscountApplicableAmount());
    pricing.setTotal(response.getTotals().getTotal());

    return pricing;
  }

  @Override
  public CartItemPricingInfo calculateItemPricing(
      CartItem cartItem, String urgencyType, String discountType, Integer discountPercentage) {

    // Build single item request
    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(List.of(buildPriceCalculationItem(cartItem)));
    request.setGlobalModifiers(buildGlobalModifiers(urgencyType, discountType, discountPercentage));

    // Calculate using PricingService
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    if (response.getItems().isEmpty()) {
      throw new IllegalStateException("Failed to calculate price for cart item");
    }

    var calculatedItem = response.getItems().getFirst();
    var calculations = calculatedItem.getCalculations();

    // Convert to CartItemPricingInfo
    CartItemPricingInfo pricing = new CartItemPricingInfo();
    pricing.setBasePrice(calculatedItem.getBasePrice());
    pricing.setSubtotal(calculations.getSubtotal());
    pricing.setUrgencyAmount(
        calculations.getUrgencyModifier() != null
            ? calculations.getUrgencyModifier().getAmount()
            : 0);
    pricing.setDiscountAmount(
        calculations.getDiscountModifier() != null
            ? calculations.getDiscountModifier().getAmount()
            : 0);
    pricing.setTotal(calculations.getFinalAmount());

    // Convert modifiers
    List<ModifierDetail> modifierDetails =
        calculations.getModifiers().stream()
            .map(
                am -> {
                  ModifierDetail detail = new ModifierDetail();
                  detail.setCode(am.getCode());
                  detail.setName(am.getName());
                  detail.setAmount(am.getAmount());
                  return detail;
                })
            .collect(Collectors.toList());

    pricing.setModifierDetails(modifierDetails);
    pricing.setModifiersTotalAmount(calculations.getModifiersTotal());

    return pricing;
  }

  @Override
  public boolean isDiscountApplicable(String categoryCode, String discountType) {
    return pricingService.isDiscountApplicableToCategory(discountType, categoryCode);
  }

  private PriceCalculationRequest buildPriceCalculationRequest(CartEntity cartEntityEntity) {
    PriceCalculationRequest request = new PriceCalculationRequest();

    // Convert cart items to price calculation items
    List<PriceCalculationItem> items =
        cartEntityEntity.getItems().stream()
            .map(this::buildPriceCalculationItem)
            .collect(Collectors.toList());

    request.setItems(items);
    request.setGlobalModifiers(
        buildGlobalModifiers(
            cartEntityEntity.getUrgencyType(),
            cartEntityEntity.getDiscountType(),
            cartEntityEntity.getDiscountPercentage()));

    return request;
  }

  private PriceCalculationItem buildPriceCalculationItem(CartItem cartItem) {
    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(cartItem.getPriceListItemEntityEntity().getId());
    item.setQuantity(cartItem.getQuantity());

    // Convert characteristics
    if (cartItem.getCharacteristics() != null) {
      ItemCharacteristics characteristics = new ItemCharacteristics();
      characteristics.setMaterial(cartItem.getCharacteristics().getMaterial());
      characteristics.setColor(cartItem.getCharacteristics().getColor());
      // Note: filler field is not available in pricing ItemCharacteristics
      if (cartItem.getCharacteristics().getWearLevel() != null) {
        characteristics.setWearLevel(
            ItemCharacteristics.WearLevelEnum.fromValue(
                cartItem.getCharacteristics().getWearLevel()));
      }
      item.setCharacteristics(characteristics);
    }

    // Extract modifier codes
    List<String> modifierCodes =
        cartItem.getModifiers().stream()
            .map(CartItemModifierEntity::getCode)
            .collect(Collectors.toList());
    item.setModifierCodes(modifierCodes);

    return item;
  }

  private GlobalPriceModifiers buildGlobalModifiers(
      String urgencyType, String discountType, Integer discountPercentage) {
    GlobalPriceModifiers modifiers = new GlobalPriceModifiers();

    if (urgencyType != null) {
      try {
        modifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.fromValue(urgencyType));
      } catch (IllegalArgumentException e) {
        log.warn("Unknown urgency type: {}", urgencyType);
      }
    }

    if (discountType != null) {
      try {
        modifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.fromValue(discountType));
        modifiers.setDiscountPercentage(discountPercentage);
      } catch (IllegalArgumentException e) {
        log.warn("Unknown discount type: {}", discountType);
      }
    }

    return modifiers;
  }
}
