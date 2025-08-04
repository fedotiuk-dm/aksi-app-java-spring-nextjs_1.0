package com.aksi.service.pricing;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JexlContext;
import org.apache.commons.jexl3.JexlEngine;
import org.apache.commons.jexl3.JexlExpression;
import org.apache.commons.jexl3.MapContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.CalculationTotals;
import com.aksi.api.pricing.dto.Discount;
import com.aksi.api.pricing.dto.DiscountsResponse;
import com.aksi.api.pricing.dto.ItemPriceCalculation;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PriceModifier;
import com.aksi.api.pricing.dto.PriceModifiersResponse;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.PricingMapper;
import com.aksi.repository.pricing.DiscountRepository;
import com.aksi.repository.pricing.PriceModifierRepository;
import com.aksi.service.catalog.PriceListService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of PricingService with JEXL formula support */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PricingServiceImpl implements PricingService {

  private final PriceModifierRepository priceModifierRepository;
  private final DiscountRepository discountRepository;
  private final PriceListService priceListService;
  private final PricingMapper pricingMapper;

  private final JexlEngine jexlEngine = new JexlBuilder().create();

  @Override
  @Transactional(readOnly = true)
  public PriceCalculationResponse calculatePrice(PriceCalculationRequest request) {
    log.debug("Calculating price for {} items", request.getItems().size());

    List<CalculatedItemPrice> calculatedItems = new ArrayList<>();
    List<String> warnings = new ArrayList<>();

    // Calculate each item
    for (var item : request.getItems()) {
      try {
        CalculatedItemPrice calculatedItem = calculateItemPrice(item, request.getGlobalModifiers());
        calculatedItems.add(calculatedItem);
      } catch (Exception e) {
        log.warn("Error calculating price for item {}: {}", item.getPriceListItemId(), e.getMessage());
        warnings.add("Unable to calculate price for item: " + e.getMessage());
      }
    }

    // Calculate totals
    CalculationTotals totals = calculateTotals(calculatedItems, request.getGlobalModifiers());

    PriceCalculationResponse response = new PriceCalculationResponse();
    response.setItems(calculatedItems);
    response.setTotals(totals);
    response.setWarnings(warnings);

    return response;
  }

  @Override
  @Transactional(readOnly = true)
  public PriceModifiersResponse listPriceModifiers(String categoryCode, Boolean active) {
    log.debug("Listing price modifiers for category: {}, active: {}", categoryCode, active);

    List<com.aksi.domain.pricing.PriceModifier> modifiers;
    
    if (categoryCode != null) {
      modifiers = priceModifierRepository.findActiveByCategoryCode(categoryCode);
    } else if (active == null || active) {
      modifiers = priceModifierRepository.findAllActiveOrderedBySortOrder();
    } else {
      modifiers = priceModifierRepository.findAll();
    }

    PriceModifiersResponse response = new PriceModifiersResponse();
    response.setModifiers(modifiers.stream().map(pricingMapper::toPriceModifierDto).toList());

    // Group by categories for convenience
    response.setGeneralModifiers(
        modifiers.stream()
            .filter(m -> m.getCategoryRestrictions() == null || m.getCategoryRestrictions().isEmpty())
            .map(pricingMapper::toPriceModifierDto)
            .toList());

    return response;
  }

  @Override
  @Transactional(readOnly = true)
  public DiscountsResponse listDiscounts(Boolean active) {
    log.debug("Listing discounts, active: {}", active);

    List<com.aksi.domain.pricing.Discount> discounts;
    
    if (active == null || active) {
      discounts = discountRepository.findAllActiveOrderedBySortOrder();
    } else {
      discounts = discountRepository.findAll();
    }

    DiscountsResponse response = new DiscountsResponse();
    response.setDiscounts(discounts.stream().map(pricingMapper::toDiscountDto).toList());

    return response;
  }

  @Override
  @Transactional(readOnly = true)
  public List<String> getApplicableModifierCodes(String categoryCode) {
    return priceModifierRepository.findActiveByCategoryCode(categoryCode).stream()
        .map(com.aksi.domain.pricing.PriceModifier::getCode)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public boolean isDiscountApplicableToCategory(String discountCode, String categoryCode) {
    return discountRepository.findByCode(discountCode)
        .map(discount -> 
            discount.getExcludedCategories() == null || 
            !discount.getExcludedCategories().contains(categoryCode))
        .orElse(false);
  }

  private CalculatedItemPrice calculateItemPrice(
      com.aksi.api.pricing.dto.PriceCalculationItem item,
      com.aksi.api.pricing.dto.GlobalPriceModifiers globalModifiers) {

    // Get price list item
    PriceListItemInfo priceListItem = priceListService.getPriceListItemById(item.getPriceListItemId());
    if (priceListItem == null) {
      throw new NotFoundException("Price list item not found: " + item.getPriceListItemId());
    }

    int basePrice = determineBasePrice(priceListItem, item.getCharacteristics());
    int baseAmount = basePrice * item.getQuantity();

    // Apply item-specific modifiers
    List<AppliedModifier> appliedModifiers = new ArrayList<>();
    int modifiersTotal = 0;

    if (item.getModifierCodes() != null) {
      for (String modifierCode : item.getModifierCodes()) {
        AppliedModifier appliedModifier = applyModifier(modifierCode, baseAmount, item);
        if (appliedModifier != null) {
          appliedModifiers.add(appliedModifier);
          modifiersTotal += appliedModifier.getAmount();
        }
      }
    }

    int subtotal = baseAmount + modifiersTotal;

    // Apply urgency modifier
    AppliedModifier urgencyModifier = applyUrgencyModifier(subtotal, globalModifiers);
    int urgencyAmount = urgencyModifier != null ? urgencyModifier.getAmount() : 0;

    // Apply discount (if applicable)
    boolean discountEligible = isDiscountApplicableToCategory(
        globalModifiers != null && globalModifiers.getDiscountType() != null 
            ? globalModifiers.getDiscountType().getValue() 
            : "NONE", 
        priceListItem.getCategoryCode().getValue());
    
    AppliedModifier discountModifier = null;
    int discountAmount = 0;
    
    if (discountEligible && globalModifiers != null) {
      discountModifier = applyDiscountModifier(subtotal + urgencyAmount, globalModifiers);
      discountAmount = discountModifier != null ? discountModifier.getAmount() : 0;
    }

    int finalAmount = subtotal + urgencyAmount - discountAmount;

    // Build response
    ItemPriceCalculation calculation = new ItemPriceCalculation();
    calculation.setBaseAmount(baseAmount);
    calculation.setModifiers(appliedModifiers);
    calculation.setModifiersTotal(modifiersTotal);
    calculation.setSubtotal(subtotal);
    calculation.setUrgencyModifier(urgencyModifier);
    calculation.setDiscountModifier(discountModifier);
    calculation.setDiscountEligible(discountEligible);
    calculation.setFinalAmount(finalAmount);

    CalculatedItemPrice result = new CalculatedItemPrice();
    result.setPriceListItemId(item.getPriceListItemId());
    result.setItemName(priceListItem.getName());
    result.setCategoryCode(priceListItem.getCategoryCode().getValue());
    result.setQuantity(item.getQuantity());
    result.setBasePrice(basePrice);
    result.setCalculations(calculation);
    result.setTotal(finalAmount);

    return result;
  }

  private int determineBasePrice(PriceListItemInfo priceListItem, 
      com.aksi.api.pricing.dto.ItemCharacteristics characteristics) {
    
    // Check if color affects pricing (for dyeing services)
    if (characteristics != null && characteristics.getColor() != null) {
      String color = characteristics.getColor().toLowerCase();
      if ("black".equals(color) && priceListItem.getPriceBlack() != null) {
        return priceListItem.getPriceBlack();
      } else if (!"white".equals(color) && !"natural".equals(color) && 
                 priceListItem.getPriceColor() != null) {
        return priceListItem.getPriceColor();
      }
    }
    
    return priceListItem.getBasePrice();
  }

  private AppliedModifier applyModifier(String modifierCode, int baseAmount, 
      com.aksi.api.pricing.dto.PriceCalculationItem item) {
    
    return priceModifierRepository.findByCode(modifierCode)
        .map(modifier -> {
          int amount = calculateModifierAmount(modifier, baseAmount, item);
          
          AppliedModifier applied = new AppliedModifier();
          applied.setCode(modifier.getCode());
          applied.setName(modifier.getName());
          applied.setType(AppliedModifier.TypeEnum.fromValue(modifier.getType().name()));
          applied.setValue(modifier.getValue());
          applied.setAmount(amount);
          
          return applied;
        })
        .orElse(null);
  }

  private int calculateModifierAmount(com.aksi.domain.pricing.PriceModifier modifier, 
      int baseAmount, com.aksi.api.pricing.dto.PriceCalculationItem item) {
    
    switch (modifier.getType()) {
      case PERCENTAGE:
        // Value is in basis points (1550 = 15.5%)
        return (baseAmount * modifier.getValue()) / 10000;
      
      case FIXED:
        // Value is in kopiykas
        return modifier.getValue() * item.getQuantity();
      
      case FORMULA:
        // Use JEXL formula
        return calculateJexlFormula(modifier.getJexlFormula(), baseAmount, item);
      
      default:
        log.warn("Unknown modifier type: {}", modifier.getType());
        return 0;
    }
  }

  private int calculateJexlFormula(String formula, int baseAmount, 
      com.aksi.api.pricing.dto.PriceCalculationItem item) {
    
    if (formula == null || formula.trim().isEmpty()) {
      return 0;
    }
    
    try {
      JexlExpression expression = jexlEngine.createExpression(formula);
      JexlContext context = new MapContext();
      
      // Provide context variables
      context.set("baseAmount", baseAmount);
      context.set("quantity", item.getQuantity());
      
      if (item.getCharacteristics() != null) {
        context.set("material", item.getCharacteristics().getMaterial());
        context.set("color", item.getCharacteristics().getColor());
        context.set("wearLevel", item.getCharacteristics().getWearLevel());
      }
      
      Object result = expression.evaluate(context);
      return result instanceof Number ? ((Number) result).intValue() : 0;
      
    } catch (Exception e) {
      log.error("Error evaluating JEXL formula '{}': {}", formula, e.getMessage());
      return 0;
    }
  }

  private AppliedModifier applyUrgencyModifier(int amount, 
      com.aksi.api.pricing.dto.GlobalPriceModifiers globalModifiers) {
    
    if (globalModifiers == null || globalModifiers.getUrgencyType() == null) {
      return null;
    }
    
    int percentage = switch (globalModifiers.getUrgencyType()) {
      case EXPRESS_48H -> 50;  // +50%
      case EXPRESS_24H -> 100; // +100%
      default -> 0;
    };
    
    if (percentage == 0) {
      return null;
    }
    
    int urgencyAmount = (amount * percentage) / 100;
    
    AppliedModifier modifier = new AppliedModifier();
    modifier.setCode(globalModifiers.getUrgencyType().getValue());
    modifier.setName("Urgency: " + globalModifiers.getUrgencyType().getValue());
    modifier.setType(AppliedModifier.TypeEnum.PERCENTAGE);
    modifier.setValue(percentage);
    modifier.setAmount(urgencyAmount);
    
    return modifier;
  }

  private AppliedModifier applyDiscountModifier(int amount, 
      com.aksi.api.pricing.dto.GlobalPriceModifiers globalModifiers) {
    
    if (globalModifiers == null || globalModifiers.getDiscountType() == null) {
      return null;
    }
    
    int percentage = switch (globalModifiers.getDiscountType()) {
      case EVERCARD -> 10;
      case SOCIAL_MEDIA -> 5;
      case MILITARY -> 10;
      case OTHER -> globalModifiers.getDiscountPercentage() != null ? globalModifiers.getDiscountPercentage() : 0;
      default -> 0;
    };
    
    if (percentage == 0) {
      return null;
    }
    
    int discountAmount = (amount * percentage) / 100;
    
    AppliedModifier modifier = new AppliedModifier();
    modifier.setCode(globalModifiers.getDiscountType().getValue());
    modifier.setName("Discount: " + globalModifiers.getDiscountType().getValue());
    modifier.setType(AppliedModifier.TypeEnum.PERCENTAGE);
    modifier.setValue(percentage);
    modifier.setAmount(discountAmount);
    
    return modifier;
  }

  private CalculationTotals calculateTotals(List<CalculatedItemPrice> items, 
      com.aksi.api.pricing.dto.GlobalPriceModifiers globalModifiers) {
    
    int itemsSubtotal = items.stream()
        .mapToInt(item -> item.getCalculations().getSubtotal())
        .sum();
    
    int urgencyAmount = items.stream()
        .mapToInt(item -> item.getCalculations().getUrgencyModifier() != null 
            ? item.getCalculations().getUrgencyModifier().getAmount() : 0)
        .sum();
    
    int discountAmount = items.stream()
        .mapToInt(item -> item.getCalculations().getDiscountModifier() != null 
            ? item.getCalculations().getDiscountModifier().getAmount() : 0)
        .sum();
    
    int discountApplicableAmount = items.stream()
        .mapToInt(item -> item.getCalculations().getDiscountEligible() 
            ? item.getCalculations().getSubtotal() : 0)
        .sum();
    
    int total = items.stream().mapToInt(CalculatedItemPrice::getTotal).sum();
    
    CalculationTotals totals = new CalculationTotals();
    totals.setItemsSubtotal(itemsSubtotal);
    totals.setUrgencyAmount(urgencyAmount);
    totals.setDiscountAmount(discountAmount);
    totals.setDiscountApplicableAmount(discountApplicableAmount);
    totals.setTotal(total);
    
    // Set percentages from global modifiers
    if (globalModifiers != null) {
      if (globalModifiers.getUrgencyType() != null) {
        int urgencyPercentage = switch (globalModifiers.getUrgencyType()) {
          case EXPRESS_48H -> 50;
          case EXPRESS_24H -> 100;
          default -> 0;
        };
        totals.setUrgencyPercentage(urgencyPercentage);
      }
      
      if (globalModifiers.getDiscountType() != null) {
        int discountPercentage = switch (globalModifiers.getDiscountType()) {
          case EVERCARD -> 10;
          case SOCIAL_MEDIA -> 5;
          case MILITARY -> 10;
          case OTHER -> globalModifiers.getDiscountPercentage() != null ? globalModifiers.getDiscountPercentage() : 0;
          default -> 0;
        };
        totals.setDiscountPercentage(discountPercentage);
      }
    }
    
    return totals;
  }
}