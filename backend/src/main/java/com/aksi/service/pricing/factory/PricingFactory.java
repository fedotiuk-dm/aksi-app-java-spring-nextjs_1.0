package com.aksi.service.pricing.factory;

import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.CalculationTotals;
import com.aksi.api.pricing.dto.DiscountDto;
import com.aksi.api.pricing.dto.DiscountType;
import com.aksi.api.pricing.dto.DiscountsResponse;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.ItemPriceCalculation;
import com.aksi.api.pricing.dto.ModifierType;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PriceModifierDto;
import com.aksi.api.pricing.dto.PriceModifiersResponse;
import com.aksi.api.pricing.dto.ServiceCategoryType;
import com.aksi.api.pricing.dto.UrgencyType;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.domain.pricing.DiscountEntity;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.exception.ConflictException;
import com.aksi.repository.DiscountRepository;
import com.aksi.repository.PriceModifierRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Factory for creating pricing-related DTOs and entities. Centralizes pricing object creation logic
 * and ensures consistency. Follows OrderFactory pattern for consistent architecture.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PricingFactory {

  private final PriceModifierRepository priceModifierRepository;
  private final DiscountRepository discountRepository;

  /** Create GlobalPriceModifiers DTO for price calculation requests. */
  public GlobalPriceModifiers createGlobalModifiers(
      UrgencyType urgencyType, DiscountType discountType, Integer discountPercentage) {

    GlobalPriceModifiers modifiers = new GlobalPriceModifiers();
    modifiers.setUrgencyType(urgencyType);
    modifiers.setDiscountType(discountType);
    modifiers.setDiscountPercentage(discountPercentage);
    return modifiers;
  }

  /** Create AppliedModifier DTO from entity and calculated amount. */
  public AppliedModifier createAppliedModifier(PriceModifierEntity modifier, int amount) {
    AppliedModifier applied = new AppliedModifier();
    applied.setCode(modifier.getCode());
    applied.setName(modifier.getName());
    applied.setType(modifier.getType());
    applied.setValue(modifier.getValue());
    applied.setAmount(amount);
    return applied;
  }

  /** Create urgency modifier for global application. */
  public AppliedModifier createUrgencyModifier(
      UrgencyType urgencyType, int amount, int percentage) {
    AppliedModifier urgencyModifier = new AppliedModifier();
    urgencyModifier.setCode(urgencyType.getValue());
    urgencyModifier.setName("Термінове виконання " + urgencyType.getValue());
    urgencyModifier.setType(ModifierType.PERCENTAGE);
    urgencyModifier.setValue(percentage);
    urgencyModifier.setAmount(amount);
    return urgencyModifier;
  }

  /** Create discount modifier for global application. */
  public AppliedModifier createDiscountModifier(
      DiscountType discountType, int amount, int percentage) {
    AppliedModifier discountModifier = new AppliedModifier();
    discountModifier.setCode(discountType.getValue());
    discountModifier.setName("Знижка " + discountType.getValue());
    discountModifier.setType(ModifierType.PERCENTAGE);
    discountModifier.setValue(percentage);
    discountModifier.setAmount(-amount); // Discount is negative
    return discountModifier;
  }

  /** Create ItemPriceCalculation DTO with all calculation details. */
  public ItemPriceCalculation createItemPriceCalculation(
      int baseAmount,
      List<AppliedModifier> appliedModifiers,
      int modifiersTotal,
      int subtotal,
      AppliedModifier urgencyModifier,
      AppliedModifier discountModifier,
      boolean discountEligible,
      int finalAmount) {

    ItemPriceCalculation calculation = new ItemPriceCalculation();
    calculation.setBaseAmount(baseAmount);
    calculation.setModifiers(appliedModifiers);
    calculation.setModifiersTotal(modifiersTotal);
    calculation.setSubtotal(subtotal);
    calculation.setUrgencyModifier(urgencyModifier);
    calculation.setDiscountModifier(discountModifier);
    calculation.setDiscountEligible(discountEligible);
    calculation.setFinalAmount(finalAmount);
    return calculation;
  }

  /** Create CalculatedItemPrice DTO for price calculation response. */
  public CalculatedItemPrice createCalculatedItemPrice(
      java.util.UUID priceListItemId,
      int basePrice,
      int quantity,
      ItemPriceCalculation calculation) {

    CalculatedItemPrice result = new CalculatedItemPrice();
    result.setPriceListItemId(priceListItemId);
    result.setBasePrice(basePrice);
    result.setQuantity(quantity);
    result.setCalculations(calculation);
    result.setTotal(calculation.getFinalAmount());
    return result;
  }

  /** Create CalculationTotals DTO for order-level totals. */
  public CalculationTotals createCalculationTotals(
      int itemsSubtotal,
      int urgencyAmount,
      int discountAmount,
      int discountApplicableAmount,
      int total) {

    CalculationTotals totals = new CalculationTotals();
    totals.setItemsSubtotal(itemsSubtotal);
    totals.setUrgencyAmount(urgencyAmount);
    totals.setDiscountAmount(discountAmount);
    totals.setDiscountApplicableAmount(discountApplicableAmount);
    totals.setTotal(total);
    return totals;
  }

  /**
   * Create complete CalculatedItemPrice with all fields populated from calculation results.
   * Combines item data, pricing data, and calculation results into final response.
   */
  public CalculatedItemPrice createCompleteCalculatedItemPrice(
      PriceCalculationItem item,
      PriceListItemInfo priceListItem,
      int basePrice,
      List<AppliedModifier> appliedModifiers,
      int modifiersTotal,
      int subtotal,
      AppliedModifier urgencyModifier,
      AppliedModifier discountModifier,
      boolean discountEligible,
      int finalAmount) {

    // Create calculation details
    ItemPriceCalculation calculation =
        createItemPriceCalculation(
            basePrice * item.getQuantity(),
            appliedModifiers,
            modifiersTotal,
            subtotal,
            urgencyModifier,
            discountModifier,
            discountEligible,
            finalAmount);

    // Create main result
    CalculatedItemPrice result =
        createCalculatedItemPrice(
            item.getPriceListItemId(), basePrice, item.getQuantity(), calculation);

    // Set additional fields from price list item
    result.setItemName(priceListItem.getName());
    result.setCategoryCode(
        ServiceCategoryType.fromValue(priceListItem.getCategoryCode().getValue()));

    return result;
  }

  /**
   * Create PriceCalculationResponse with calculated items and totals. Main response factory method
   * for price calculation API.
   */
  public PriceCalculationResponse createPriceCalculationResponse(
      List<CalculatedItemPrice> calculatedItems, CalculationTotals totals) {
    PriceCalculationResponse response = new PriceCalculationResponse();
    response.setItems(calculatedItems);
    response.setTotals(totals);
    return response;
  }

  /**
   * Create PriceModifiersResponse with modifiers and general modifiers. Response factory method for
   * price modifiers listing API.
   */
  public PriceModifiersResponse createPriceModifiersResponse(
      List<PriceModifierDto> allModifiers, List<PriceModifierDto> generalModifiers) {
    PriceModifiersResponse response = new PriceModifiersResponse();
    response.setModifiers(allModifiers);
    response.setGeneralModifiers(generalModifiers);
    return response;
  }

  /**
   * Create DiscountsResponse with discounts list. Response factory method for discounts listing
   * API.
   */
  public DiscountsResponse createDiscountsResponse(List<DiscountDto> discounts) {
    DiscountsResponse response = new DiscountsResponse();
    response.setDiscounts(discounts);
    return response;
  }

  // ===== ENTITY PERSISTENCE METHODS =====

  /**
   * Save price modifier entity with error handling. Throws ConflictException on data integrity
   * violations.
   */
  public PriceModifierEntity savePriceModifierEntity(PriceModifierEntity entity) {
    try {
      return priceModifierRepository.save(entity);
    } catch (org.springframework.dao.DataIntegrityViolationException e) {
      log.error("Failed to save price modifier due to data integrity violation", e);
      throw new ConflictException(
          "Failed to save price modifier: " + e.getMostSpecificCause().getMessage(), e);
    }
  }

  /**
   * Save discount entity with error handling. Throws ConflictException on data integrity
   * violations.
   */
  public DiscountEntity saveDiscountEntity(DiscountEntity entity) {
    try {
      return discountRepository.save(entity);
    } catch (org.springframework.dao.DataIntegrityViolationException e) {
      log.error("Failed to save discount due to data integrity violation", e);
      throw new ConflictException(
          "Failed to save discount: " + e.getMostSpecificCause().getMessage(), e);
    }
  }

  /** Delete price modifier entity. */
  public void deletePriceModifier(PriceModifierEntity entity) {
    priceModifierRepository.delete(entity);
  }

  /** Delete discount entity. */
  public void deleteDiscount(DiscountEntity entity) {
    discountRepository.delete(entity);
  }
}
