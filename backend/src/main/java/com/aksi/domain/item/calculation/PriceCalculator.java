package com.aksi.domain.item.calculation;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.entity.embeddable.PriceDetails;
import com.aksi.domain.item.enums.DiscountType;
import com.aksi.domain.item.enums.ItemColor;
import com.aksi.domain.item.enums.UrgencyType;
import com.aksi.domain.item.service.ServiceCategoryBusinessRules;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Main component for calculating item prices */
@Slf4j
@Component
@RequiredArgsConstructor
public class PriceCalculator {

  private final ModifierApplicator modifierApplicator;
  private final ServiceCategoryBusinessRules categoryBusinessRules;

  /**
   * Calculate the final price for an item
   *
   * @param item The price list item
   * @param color The item color
   * @param quantity The quantity
   * @param modifiers List of modifiers to apply
   * @return Calculated price
   */
  public BigDecimal calculatePrice(
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      List<PriceModifierEntity> modifiers) {

    // Call overloaded method with default urgency
    return calculatePrice(item, color, quantity, modifiers, null, null);
  }

  /**
   * Calculate the final price for an item with urgency and discount
   *
   * @param item The price list item
   * @param color The item color
   * @param quantity The quantity
   * @param modifiers List of modifiers to apply
   * @param urgencyType The urgency type (optional)
   * @param material The material (optional, for JEXL context)
   * @return Calculated price
   */
  public BigDecimal calculatePrice(
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      List<PriceModifierEntity> modifiers,
      UrgencyType urgencyType,
      String material) {

    log.debug(
        "Starting price calculation for item: {}, color: {}, quantity: {}, urgency: {}, material: {}",
        item.getName(),
        color,
        quantity,
        urgencyType,
        material);

    // Step 1: Get base price based on color
    BigDecimal basePrice = getBasePriceByColor(item.getPriceDetails(), color);
    log.debug("Base price for color {}: {}", color, basePrice);

    // Step 2: Multiply by quantity
    BigDecimal priceWithQuantity = basePrice.multiply(quantity);
    log.debug("Price after quantity multiplication: {}", priceWithQuantity);

    // Step 3: Apply modifiers (with material context and urgency)
    BigDecimal priceAfterModifiers =
        modifierApplicator.applyModifiers(
            priceWithQuantity, modifiers, item, color, quantity, material, urgencyType);

    // Step 4: Apply urgency multiplier (after modifiers, before discounts)
    BigDecimal priceAfterUrgency = priceAfterModifiers;
    if (urgencyType != null && urgencyType != UrgencyType.NORMAL) {
      priceAfterUrgency = priceAfterModifiers.multiply(urgencyType.getPriceMultiplier());
      log.debug(
          "Price after urgency {} (x{}): {}",
          urgencyType.getDisplayName(),
          urgencyType.getPriceMultiplier(),
          priceAfterUrgency);
    }

    // Step 5: Round to 2 decimal places
    BigDecimal finalPrice = priceAfterUrgency.setScale(2, RoundingMode.HALF_UP);
    log.debug("Final price after rounding: {}", finalPrice);

    // Step 6: Ensure minimum price
    if (finalPrice.compareTo(BigDecimal.ZERO) < 0) {
      log.warn("Calculated price is negative, setting to 0.01");
      finalPrice = new BigDecimal("0.01");
    }

    return finalPrice;
  }

  /**
   * Calculate the final price with full order context including global discount
   *
   * @param item The price list item
   * @param color The item color
   * @param quantity The quantity
   * @param modifiers List of modifiers to apply
   * @param urgencyType The urgency type (optional)
   * @param material The material (optional)
   * @param discountType The global discount type (optional)
   * @param customDiscountValue Custom discount value for CUSTOM type (optional)
   * @return Calculated price with all adjustments
   */
  public BigDecimal calculatePriceWithDiscount(
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      List<PriceModifierEntity> modifiers,
      UrgencyType urgencyType,
      String material,
      DiscountType discountType,
      BigDecimal customDiscountValue) {

    // Calculate price before discount
    BigDecimal priceBeforeDiscount =
        calculatePrice(item, color, quantity, modifiers, urgencyType, material);

    // Check if discount can be applied to this category
    if (discountType == null || discountType == DiscountType.NONE) {
      return priceBeforeDiscount;
    }

    String categoryCode = item.getCategory().getCode();
    boolean discountAllowed = categoryBusinessRules.isDiscountApplicable(categoryCode);

    if (!discountAllowed) {
      log.debug("Discount not applicable for category: {}", categoryCode);
      return priceBeforeDiscount;
    }

    // Apply global discount
    BigDecimal discountMultiplier;
    if (discountType == DiscountType.CUSTOM && customDiscountValue != null) {
      discountMultiplier = discountType.getDiscountMultiplier(customDiscountValue);
    } else {
      discountMultiplier = discountType.getDiscountMultiplier();
    }

    BigDecimal finalPrice = priceBeforeDiscount.multiply(discountMultiplier);
    finalPrice = finalPrice.setScale(2, RoundingMode.HALF_UP);

    log.debug(
        "Applied {} discount: {} -> {}",
        discountType.getDisplayName(),
        priceBeforeDiscount,
        finalPrice);

    return finalPrice;
  }

  /**
   * Get base price based on item color
   *
   * @param priceDetails The price details
   * @param color The item color
   * @return Base price for the color
   */
  private BigDecimal getBasePriceByColor(PriceDetails priceDetails, ItemColor color) {
    if (priceDetails == null) {
      throw new IllegalArgumentException("Price details cannot be null");
    }

    BigDecimal basePrice = priceDetails.getBasePrice();
    if (basePrice == null) {
      throw new IllegalArgumentException("Base price cannot be null");
    }

    // Use price details logic
    return priceDetails.getPriceForColor(color);
  }

  /**
   * Generate calculation breakdown for transparency
   *
   * @param item The price list item
   * @param color The item color
   * @param quantity The quantity
   * @param modifiers List of modifiers
   * @return Detailed breakdown of the calculation
   */
  public CalculationBreakdown generateBreakdown(
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      List<PriceModifierEntity> modifiers) {

    // Call overloaded method without urgency and material
    return generateBreakdown(item, color, quantity, modifiers, null, null);
  }

  /**
   * Generate calculation breakdown for transparency with urgency and material
   *
   * @param item The price list item
   * @param color The item color
   * @param quantity The quantity
   * @param modifiers List of modifiers
   * @param urgencyType The urgency type (optional)
   * @param material The material (optional)
   * @return Detailed breakdown of the calculation
   */
  public CalculationBreakdown generateBreakdown(
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      List<PriceModifierEntity> modifiers,
      UrgencyType urgencyType,
      String material) {

    CalculationBreakdown breakdown = new CalculationBreakdown();

    // Base price
    BigDecimal basePrice = getBasePriceByColor(item.getPriceDetails(), color);
    breakdown.setBasePrice(basePrice);
    breakdown.setQuantity(quantity);
    breakdown.setPriceWithQuantity(basePrice.multiply(quantity));

    // Track modifier applications
    List<ModifierApplication> applications = new ArrayList<>();
    BigDecimal currentPrice = breakdown.getPriceWithQuantity();

    for (PriceModifierEntity modifier : modifiers) {
      BigDecimal oldPrice = currentPrice;
      currentPrice =
          modifierApplicator.applySingleModifier(
              currentPrice, modifier, item, color, quantity, material);

      ModifierApplication application = new ModifierApplication();
      application.setModifierName(modifier.getName());
      application.setModifierType(modifier.getType());
      application.setPriceBefore(oldPrice);
      application.setPriceAfter(currentPrice);
      application.setDifference(currentPrice.subtract(oldPrice));

      applications.add(application);
    }

    // Add urgency application if present
    if (urgencyType != null && urgencyType != UrgencyType.NORMAL) {
      BigDecimal oldPrice = currentPrice;
      currentPrice = currentPrice.multiply(urgencyType.getPriceMultiplier());

      ModifierApplication urgencyApplication = new ModifierApplication();
      urgencyApplication.setModifierName("Терміновість: " + urgencyType.getDisplayName());
      urgencyApplication.setModifierType(com.aksi.domain.item.enums.ModifierType.PERCENTAGE);
      urgencyApplication.setPriceBefore(oldPrice);
      urgencyApplication.setPriceAfter(currentPrice);
      urgencyApplication.setDifference(currentPrice.subtract(oldPrice));

      applications.add(urgencyApplication);
    }

    breakdown.setModifierApplications(applications);
    breakdown.setFinalPrice(currentPrice.setScale(2, RoundingMode.HALF_UP));

    return breakdown;
  }

  /**
   * Calculate price preview for a single modifier without material/urgency context. Useful for
   * showing individual modifier effects in UI.
   *
   * @param basePrice the base price
   * @param modifier the modifier to apply
   * @param item the price list item
   * @param color the item color
   * @param quantity the quantity
   * @return price after applying the modifier
   */
  public BigDecimal calculateModifierPreview(
      BigDecimal basePrice,
      PriceModifierEntity modifier,
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity) {

    log.debug("Calculating modifier preview for: {}", modifier.getName());

    // Use the 5-parameter version of applySingleModifier for simple preview
    BigDecimal result =
        modifierApplicator.applySingleModifier(basePrice, modifier, item, color, quantity);

    log.debug("Preview result: {} -> {}", basePrice, result);
    return result;
  }

  /** Calculation breakdown for transparency */
  public static class CalculationBreakdown {
    private BigDecimal basePrice;
    private BigDecimal quantity;
    private BigDecimal priceWithQuantity;
    private List<ModifierApplication> modifierApplications;
    private BigDecimal finalPrice;

    // Getters and setters
    public BigDecimal getBasePrice() {
      return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
      this.basePrice = basePrice;
    }

    public BigDecimal getQuantity() {
      return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
      this.quantity = quantity;
    }

    public BigDecimal getPriceWithQuantity() {
      return priceWithQuantity;
    }

    public void setPriceWithQuantity(BigDecimal priceWithQuantity) {
      this.priceWithQuantity = priceWithQuantity;
    }

    public List<ModifierApplication> getModifierApplications() {
      return modifierApplications;
    }

    public void setModifierApplications(List<ModifierApplication> modifierApplications) {
      this.modifierApplications = modifierApplications;
    }

    public BigDecimal getFinalPrice() {
      return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
      this.finalPrice = finalPrice;
    }
  }

  /** Details of a single modifier application */
  public static class ModifierApplication {
    private String modifierName;
    private com.aksi.domain.item.enums.ModifierType modifierType;
    private BigDecimal priceBefore;
    private BigDecimal priceAfter;
    private BigDecimal difference;

    // Getters and setters
    public String getModifierName() {
      return modifierName;
    }

    public void setModifierName(String modifierName) {
      this.modifierName = modifierName;
    }

    public com.aksi.domain.item.enums.ModifierType getModifierType() {
      return modifierType;
    }

    public void setModifierType(com.aksi.domain.item.enums.ModifierType modifierType) {
      this.modifierType = modifierType;
    }

    public BigDecimal getPriceBefore() {
      return priceBefore;
    }

    public void setPriceBefore(BigDecimal priceBefore) {
      this.priceBefore = priceBefore;
    }

    public BigDecimal getPriceAfter() {
      return priceAfter;
    }

    public void setPriceAfter(BigDecimal priceAfter) {
      this.priceAfter = priceAfter;
    }

    public BigDecimal getDifference() {
      return difference;
    }

    public void setDifference(BigDecimal difference) {
      this.difference = difference;
    }
  }
}
