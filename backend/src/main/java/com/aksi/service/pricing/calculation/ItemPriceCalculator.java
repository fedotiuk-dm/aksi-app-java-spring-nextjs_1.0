package com.aksi.service.pricing.calculation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.ItemPriceCalculation;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.service.pricing.rules.PricingRulesService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Component for calculating individual item prices */
@Component
@RequiredArgsConstructor
@Slf4j
public class ItemPriceCalculator {

  private final PricingRulesService pricingRulesService;
  private final PriceCalculationService priceCalculationService;

  /**
   * Calculate price for a single item
   *
   * @param item Item to calculate
   * @param priceListItem Price list item info
   * @param globalModifiers Global modifiers (urgency, discount)
   * @return Calculated item price
   */
  public CalculatedItemPrice calculate(
      PriceCalculationItem item,
      PriceListItemInfo priceListItem,
      GlobalPriceModifiers globalModifiers) {

    log.debug("Calculating price for item: {}", priceListItem.getName());

    // Step 1: Determine base price based on characteristics
    int basePrice =
        pricingRulesService.determineBasePrice(
            priceListItem,
            item.getCharacteristics() != null ? item.getCharacteristics().getColor() : null);

    int baseAmount = basePrice * item.getQuantity();

    // Step 2: Apply item-specific modifiers
    List<AppliedModifier> appliedModifiers = new ArrayList<>();
    int modifiersTotal = 0;

    if (item.getModifierCodes() != null && !item.getModifierCodes().isEmpty()) {
      for (String modifierCode : item.getModifierCodes()) {
        AppliedModifier applied = applyModifier(modifierCode, baseAmount, item.getQuantity());
        if (applied != null) {
          appliedModifiers.add(applied);
          modifiersTotal += applied.getAmount();
        }
      }
    }

    int subtotal = baseAmount + modifiersTotal;

    // Step 3: Apply urgency modifier (if present)
    AppliedModifier urgencyModifier = null;
    int urgencyAmount = 0;

    if (globalModifiers != null && globalModifiers.getUrgencyType() != null) {
      urgencyAmount =
          priceCalculationService.calculateUrgencyAmount(
              subtotal, globalModifiers.getUrgencyType());

      if (urgencyAmount > 0) {
        urgencyModifier = createUrgencyModifier(globalModifiers.getUrgencyType(), urgencyAmount);
      }
    }

    // Step 4: Apply discount (if applicable to category)
    boolean discountEligible = false;
    AppliedModifier discountModifier = null;
    int discountAmount = 0;

    if (globalModifiers != null && globalModifiers.getDiscountType() != null) {
      String discountCode = globalModifiers.getDiscountType().getValue();
      String categoryCode = priceListItem.getCategoryCode().getValue();

      discountEligible =
          pricingRulesService.isDiscountApplicableToCategory(discountCode, categoryCode);

      if (discountEligible) {
        discountAmount =
            priceCalculationService.calculateDiscountAmount(
                subtotal + urgencyAmount,
                globalModifiers.getDiscountType(),
                globalModifiers.getDiscountPercentage());

        if (discountAmount > 0) {
          discountModifier =
              createDiscountModifier(
                  globalModifiers.getDiscountType(),
                  globalModifiers.getDiscountPercentage(),
                  discountAmount);
        }
      }
    }

    // Step 5: Calculate final amount
    int finalAmount = subtotal + urgencyAmount - discountAmount;

    // Build calculation details
    ItemPriceCalculation calculation = new ItemPriceCalculation();
    calculation.setBaseAmount(baseAmount);
    calculation.setModifiers(appliedModifiers);
    calculation.setModifiersTotal(modifiersTotal);
    calculation.setSubtotal(subtotal);
    calculation.setUrgencyModifier(urgencyModifier);
    calculation.setDiscountModifier(discountModifier);
    calculation.setDiscountEligible(discountEligible);
    calculation.setFinalAmount(finalAmount);

    // Build result
    CalculatedItemPrice result = new CalculatedItemPrice();
    result.setPriceListItemId(item.getPriceListItemId());
    result.setItemName(priceListItem.getName());
    result.setCategoryCode(priceListItem.getCategoryCode().getValue());
    result.setQuantity(item.getQuantity());
    result.setBasePrice(basePrice);
    result.setCalculations(calculation);
    result.setTotal(finalAmount);

    log.debug("Item price calculated: base={}, total={}", baseAmount, finalAmount);

    return result;
  }

  private AppliedModifier applyModifier(String modifierCode, int baseAmount, int quantity) {
    PriceModifierEntity modifier = pricingRulesService.getModifier(modifierCode);
    if (modifier == null) {
      log.warn("Modifier not found: {}", modifierCode);
      return null;
    }

    int amount = priceCalculationService.calculateModifierAmount(modifier, baseAmount, quantity);

    AppliedModifier applied = new AppliedModifier();
    applied.setCode(modifier.getCode());
    applied.setName(modifier.getName());
    applied.setType(AppliedModifier.TypeEnum.fromValue(modifier.getType().name()));
    applied.setValue(modifier.getValue());
    applied.setAmount(amount);

    return applied;
  }

  private AppliedModifier createUrgencyModifier(
      GlobalPriceModifiers.UrgencyTypeEnum urgencyType, int amount) {

    AppliedModifier modifier = new AppliedModifier();
    modifier.setCode(urgencyType.getValue());
    modifier.setName("Термінове виконання: " + urgencyType.getValue());
    modifier.setType(AppliedModifier.TypeEnum.PERCENTAGE);
    modifier.setValue(priceCalculationService.getUrgencyPercentage(urgencyType));
    modifier.setAmount(amount);

    return modifier;
  }

  private AppliedModifier createDiscountModifier(
      GlobalPriceModifiers.DiscountTypeEnum discountType, Integer customPercentage, int amount) {

    AppliedModifier modifier = new AppliedModifier();
    modifier.setCode(discountType.getValue());
    modifier.setName("Знижка: " + discountType.getValue());
    modifier.setType(AppliedModifier.TypeEnum.PERCENTAGE);
    modifier.setValue(
        priceCalculationService.getDiscountPercentage(discountType, customPercentage));
    modifier.setAmount(amount);

    return modifier;
  }
}
