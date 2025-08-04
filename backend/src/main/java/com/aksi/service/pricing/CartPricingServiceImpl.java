package com.aksi.service.pricing;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.api.cart.dto.CartItemPricingInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.api.cart.dto.ModifierDetail;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.domain.cart.Cart;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemModifier;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of cart pricing calculations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CartPricingServiceImpl implements CartPricingService {

  // Categories that don't allow discounts
  private static final List<ServiceCategoryType> NON_DISCOUNTABLE_CATEGORIES = List.of(
      ServiceCategoryType.LAUNDRY,
      ServiceCategoryType.IRONING,
      ServiceCategoryType.DYEING_TEXTILE
  );

  @Override
  public CartPricingInfo calculateCartPricing(Cart cart) {
    CartPricingInfo pricing = new CartPricingInfo();
    
    int itemsSubtotal = 0;
    int urgencyAmount = 0;
    int discountAmount = 0;
    int discountApplicableAmount = 0;
    
    for (CartItem item : cart.getItems()) {
      CartItemPricingInfo itemPricing = calculateItemPricing(
          item, cart.getUrgencyType(), cart.getDiscountType(), cart.getDiscountPercentage());
      
      itemsSubtotal += itemPricing.getSubtotal();
      urgencyAmount += itemPricing.getUrgencyAmount();
      discountAmount += itemPricing.getDiscountAmount();
      
      // Track amount eligible for discount
      if (isDiscountApplicable(item.getPriceListItem().getCategoryCode().name(), cart.getDiscountType())) {
        discountApplicableAmount += itemPricing.getSubtotal();
      }
    }
    
    pricing.setItemsSubtotal(itemsSubtotal);
    pricing.setUrgencyAmount(urgencyAmount);
    pricing.setDiscountAmount(discountAmount);
    pricing.setDiscountApplicableAmount(discountApplicableAmount);
    pricing.setTotal(itemsSubtotal + urgencyAmount - discountAmount);
    
    return pricing;
  }

  @Override
  public CartItemPricingInfo calculateItemPricing(
      CartItem cartItem, String urgencyType, String discountType, Integer discountPercentage) {
    
    CartItemPricingInfo pricing = new CartItemPricingInfo();
    
    // Base price calculation
    int basePrice = getItemBasePrice(cartItem);
    pricing.setBasePrice(basePrice);
    
    // Apply modifiers
    List<ModifierDetail> modifierDetails = new ArrayList<>();
    int modifiersTotalAmount = 0;
    
    for (CartItemModifier modifier : cartItem.getModifiers()) {
      int modifierAmount = calculateModifierAmount(basePrice, modifier);
      modifiersTotalAmount += modifierAmount;
      
      ModifierDetail detail = new ModifierDetail();
      detail.setCode(modifier.getCode());
      detail.setName(modifier.getName());
      detail.setAmount(modifierAmount);
      modifierDetails.add(detail);
    }
    
    pricing.setModifierDetails(modifierDetails);
    pricing.setModifiersTotalAmount(modifiersTotalAmount);
    
    // Calculate subtotal
    int subtotal = basePrice + modifiersTotalAmount;
    pricing.setSubtotal(subtotal);
    
    // Apply urgency
    int urgencyAmount = calculateUrgencyAmount(subtotal, urgencyType);
    pricing.setUrgencyAmount(urgencyAmount);
    
    // Apply discount (only if applicable to category)
    int discountAmount = 0;
    if (isDiscountApplicable(cartItem.getPriceListItem().getCategoryCode().name(), discountType)) {
      discountAmount = calculateDiscountAmount(subtotal + urgencyAmount, discountType, discountPercentage);
    }
    pricing.setDiscountAmount(discountAmount);
    
    // Calculate total
    int total = subtotal + urgencyAmount - discountAmount;
    pricing.setTotal(total);
    
    return pricing;
  }

  @Override
  public boolean isDiscountApplicable(String categoryCode, String discountType) {
    if (discountType == null || "NONE".equals(discountType)) {
      return false;
    }
    
    try {
      ServiceCategoryType category = ServiceCategoryType.valueOf(categoryCode);
      return !NON_DISCOUNTABLE_CATEGORIES.contains(category);
    } catch (IllegalArgumentException e) {
      log.warn("Unknown category code: {}", categoryCode);
      return true; // Allow discount for unknown categories
    }
  }

  private int getItemBasePrice(CartItem cartItem) {
    int quantity = cartItem.getQuantity();
    Integer pricePerUnit = cartItem.getPriceListItem().getBasePrice();
    
    // Check for color-specific pricing
    if (cartItem.getCharacteristics() != null && cartItem.getCharacteristics().getColor() != null) {
      String color = cartItem.getCharacteristics().getColor().toLowerCase();
      if (color.contains("чорн") || color.contains("black")) {
        if (cartItem.getPriceListItem().getPriceBlack() != null) {
          pricePerUnit = cartItem.getPriceListItem().getPriceBlack();
        }
      } else if (cartItem.getPriceListItem().getPriceColor() != null) {
        pricePerUnit = cartItem.getPriceListItem().getPriceColor();
      }
    }
    
    return pricePerUnit * quantity;
  }

  private int calculateModifierAmount(int basePrice, CartItemModifier modifier) {
    if ("PERCENTAGE".equals(modifier.getType())) {
      return (basePrice * modifier.getValue()) / 100;
    } else if ("FIXED".equals(modifier.getType())) {
      return modifier.getValue();
    }
    return 0;
  }

  private int calculateUrgencyAmount(int subtotal, String urgencyType) {
    return switch (urgencyType) {
      case "EXPRESS_48H" -> (subtotal * 50) / 100;
      case "EXPRESS_24H" -> (subtotal * 100) / 100;
      default -> 0;
    };
  }

  private int calculateDiscountAmount(int amount, String discountType, Integer discountPercentage) {
    int percentage = switch (discountType) {
      case "EVERCARD" -> 10;
      case "SOCIAL_MEDIA" -> 5;
      case "MILITARY" -> 10;
      case "OTHER" -> discountPercentage != null ? discountPercentage : 0;
      default -> 0;
    };
    
    return (amount * percentage) / 100;
  }
}