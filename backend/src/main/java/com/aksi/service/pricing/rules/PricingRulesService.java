package com.aksi.service.pricing.rules;

import org.springframework.stereotype.Service;

import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.domain.pricing.PriceModifier;
import com.aksi.repository.PriceModifierRepository;
import com.aksi.service.pricing.calculation.PriceCalculationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for applying pricing rules and business logic */
@Service
@RequiredArgsConstructor
@Slf4j
public class PricingRulesService {

  private final PriceModifierRepository priceModifierRepository;
  private final PriceCalculationService priceCalculationService;

  /**
   * Determine base price based on item characteristics
   *
   * @param priceListItem Price list item with different price options
   * @param color Item color (optional)
   * @return Selected base price in kopiykas
   */
  public int determineBasePrice(PriceListItemInfo priceListItem, String color) {
    // Default to base price
    int basePrice = priceListItem.getBasePrice();

    if (color == null || color.isBlank()) {
      return basePrice;
    }

    String normalizedColor = color.toLowerCase().trim();

    // Check for black items (special pricing)
    if (isBlackColor(normalizedColor) && priceListItem.getPriceBlack() != null) {
      log.debug(
          "Using black price for item {}: {}",
          priceListItem.getId(),
          priceListItem.getPriceBlack());
      return priceListItem.getPriceBlack();
    }

    // Check for colored items (not white/natural)
    if (!isNaturalColor(normalizedColor) && priceListItem.getPriceColor() != null) {
      log.debug(
          "Using color price for item {}: {}",
          priceListItem.getId(),
          priceListItem.getPriceColor());
      return priceListItem.getPriceColor();
    }

    return basePrice;
  }

  /**
   * Check if discount is applicable to category
   *
   * @param discountCode Discount code
   * @param categoryCode Category code
   * @return true if discount can be applied
   */
  public boolean isDiscountApplicableToCategory(String discountCode, String categoryCode) {
    // First check global exclusions from PriceCalculationService
    if (!priceCalculationService.isDiscountApplicableToCategory(categoryCode)) {
      log.debug("Category {} is globally excluded from discounts", categoryCode);
      return false;
    }

    // For specific discount codes, we could check DB for additional restrictions
    // Currently all discounts follow the same global rules
    log.debug("Discount {} is applicable to category {}", discountCode, categoryCode);
    return true;
  }

  /**
   * Get modifier by code
   *
   * @param modifierCode Modifier code
   * @return Modifier entity or null
   */
  public PriceModifier getModifier(String modifierCode) {
    return priceModifierRepository
        .findByCode(modifierCode)
        .filter(PriceModifier::isActive)
        .orElse(null);
  }

  private boolean isBlackColor(String color) {
    return "black".equals(color) || "чорний".equals(color);
  }

  private boolean isNaturalColor(String color) {
    return "white".equals(color)
        || "natural".equals(color)
        || "білий".equals(color)
        || "натуральний".equals(color);
  }
}
