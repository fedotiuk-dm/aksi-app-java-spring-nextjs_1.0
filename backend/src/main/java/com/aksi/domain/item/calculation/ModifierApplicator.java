package com.aksi.domain.item.calculation;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.jexl3.JexlEngine;
import org.springframework.stereotype.Component;

import com.aksi.domain.item.constant.ItemConstants;
import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.enums.ItemColor;
import com.aksi.domain.item.enums.UrgencyType;
import com.aksi.domain.item.exception.FormulaCalculationException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Component for applying price modifiers */
@Slf4j
@Component
@RequiredArgsConstructor
public class ModifierApplicator {

  private final JexlEngine jexlEngine;

  /**
   * Apply all modifiers to a price
   *
   * @param basePrice The base price to modify
   * @param modifiers List of modifiers to apply
   * @param item The price list item (for context)
   * @param color The item color (for context)
   * @param quantity The quantity (for context)
   * @return Modified price
   */
  public BigDecimal applyModifiers(
      BigDecimal basePrice,
      List<PriceModifierEntity> modifiers,
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity) {

    // Call overloaded method without material
    return applyModifiers(basePrice, modifiers, item, color, quantity, null);
  }

  /**
   * Apply all modifiers to a price with material context
   *
   * @param basePrice The base price to modify
   * @param modifiers List of modifiers to apply
   * @param item The price list item (for context)
   * @param color The item color (for context)
   * @param quantity The quantity (for context)
   * @param material The material (for JEXL context)
   * @return Modified price
   */
  public BigDecimal applyModifiers(
      BigDecimal basePrice,
      List<PriceModifierEntity> modifiers,
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      String material) {

    // Call overloaded method without urgency
    return applyModifiers(basePrice, modifiers, item, color, quantity, material, null);
  }

  /**
   * Apply all modifiers to a price with full context
   *
   * @param basePrice The base price to modify
   * @param modifiers List of modifiers to apply
   * @param item The price list item (for context)
   * @param color The item color (for context)
   * @param quantity The quantity (for context)
   * @param material The material (for JEXL context)
   * @param urgencyType The urgency type (for JEXL context)
   * @return Modified price
   */
  public BigDecimal applyModifiers(
      BigDecimal basePrice,
      List<PriceModifierEntity> modifiers,
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      String material,
      UrgencyType urgencyType) {

    if (modifiers == null || modifiers.isEmpty()) {
      log.debug("No modifiers to apply");
      return basePrice;
    }

    // Sort modifiers by priority (ascending)
    List<PriceModifierEntity> sortedModifiers =
        modifiers.stream().sorted(Comparator.comparing(PriceModifierEntity::getPriority)).toList();

    log.debug("Applying {} modifiers sorted by priority", sortedModifiers.size());

    // According to OrderWizard logic: percentage modifiers should be added, not multiplied
    // Calculate total percentage increase first
    BigDecimal totalPercentageIncrease = BigDecimal.ZERO;
    BigDecimal totalFixedAmount = BigDecimal.ZERO;

    for (PriceModifierEntity modifier : sortedModifiers) {
      if (modifier.getJexlFormula() != null && !modifier.getJexlFormula().trim().isEmpty()) {
        // JEXL formulas are applied immediately with full context
        BigDecimal formulaResult =
            applyJexlFormula(basePrice, modifier, item, color, quantity, material, urgencyType);
        // JEXL formula returns the new price, so we calculate the difference
        BigDecimal difference = formulaResult.subtract(basePrice);
        totalFixedAmount = totalFixedAmount.add(difference);
        log.debug("JEXL formula {} added: {}", modifier.getName(), difference);
      } else if (modifier.getType() == com.aksi.domain.item.enums.ModifierType.PERCENTAGE) {
        // Accumulate percentage modifiers
        BigDecimal percentageValue = modifier.getValue();
        if (percentageValue != null) {
          totalPercentageIncrease = totalPercentageIncrease.add(percentageValue);
          log.debug(
              "Accumulated percentage modifier {}: +{}% (total: {}%)",
              modifier.getName(), percentageValue, totalPercentageIncrease);
        }
      } else if (modifier.getType() == com.aksi.domain.item.enums.ModifierType.FIXED_AMOUNT) {
        // Accumulate fixed amounts
        BigDecimal fixedValue = modifier.getValue();
        if (fixedValue != null) {
          totalFixedAmount = totalFixedAmount.add(fixedValue);
          log.debug("Accumulated fixed amount {}: +{}", modifier.getName(), fixedValue);
        }
      }
    }

    // Apply all accumulated changes
    BigDecimal finalPrice = basePrice;

    // Add percentage increase (calculated from base price)
    if (totalPercentageIncrease.compareTo(BigDecimal.ZERO) > 0) {
      BigDecimal percentageAmount =
          basePrice.multiply(
              totalPercentageIncrease.divide(ItemConstants.ONE_HUNDRED, 4, RoundingMode.HALF_UP));
      finalPrice = finalPrice.add(percentageAmount);
      log.debug(
          "Applied total percentage increase of {}%: +{}",
          totalPercentageIncrease, percentageAmount);
    }

    // Add fixed amounts
    if (totalFixedAmount.compareTo(BigDecimal.ZERO) != 0) {
      finalPrice = finalPrice.add(totalFixedAmount);
      log.debug("Applied total fixed amount: +{}", totalFixedAmount);
    }

    return finalPrice;
  }

  /**
   * Apply a single modifier to a price
   *
   * @param price Current price
   * @param modifier The modifier to apply
   * @param item The price list item (for JEXL context)
   * @param color The item color (for JEXL context)
   * @param quantity The quantity (for JEXL context)
   * @return Modified price
   */
  public BigDecimal applySingleModifier(
      BigDecimal price,
      PriceModifierEntity modifier,
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity) {

    // Call overloaded method without material
    return applySingleModifier(price, modifier, item, color, quantity, null);
  }

  /**
   * Apply a single modifier to a price with material context
   *
   * @param price Current price
   * @param modifier The modifier to apply
   * @param item The price list item (for JEXL context)
   * @param color The item color (for JEXL context)
   * @param quantity The quantity (for JEXL context)
   * @param material The material (for JEXL context)
   * @return Modified price
   */
  public BigDecimal applySingleModifier(
      BigDecimal price,
      PriceModifierEntity modifier,
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      String material) {

    // Call overloaded method without urgency
    return applySingleModifier(price, modifier, item, color, quantity, material, null);
  }

  /**
   * Apply a single modifier to a price with full context
   *
   * @param price Current price
   * @param modifier The modifier to apply
   * @param item The price list item (for JEXL context)
   * @param color The item color (for JEXL context)
   * @param quantity The quantity (for JEXL context)
   * @param material The material (for JEXL context)
   * @param urgencyType The urgency type (for JEXL context)
   * @return Modified price
   */
  public BigDecimal applySingleModifier(
      BigDecimal price,
      PriceModifierEntity modifier,
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      String material,
      UrgencyType urgencyType) {

    log.debug(
        "Applying modifier: {} (type: {}, priority: {})",
        modifier.getName(),
        modifier.getType(),
        modifier.getPriority());

    BigDecimal modifiedPrice;

    // Check if modifier has JEXL formula
    if (modifier.getJexlFormula() != null && !modifier.getJexlFormula().trim().isEmpty()) {
      log.debug("Using JEXL formula: {}", modifier.getJexlFormula());
      modifiedPrice =
          applyJexlFormula(price, modifier, item, color, quantity, material, urgencyType);
    } else {
      // Use simple modifier type calculation
      modifiedPrice = applySimpleModifier(price, modifier);
    }

    log.debug("Price after modifier {}: {} -> {}", modifier.getName(), price, modifiedPrice);

    return modifiedPrice;
  }

  /**
   * Apply simple modifier based on type
   *
   * @param price Current price
   * @param modifier The modifier
   * @return Modified price
   */
  private BigDecimal applySimpleModifier(BigDecimal price, PriceModifierEntity modifier) {
    BigDecimal value = modifier.getValue();
    if (value == null) {
      log.warn("Modifier {} has null value, skipping", modifier.getName());
      return price;
    }

    return switch (modifier.getType()) {
      case PERCENTAGE -> {
        // Add percentage to price (e.g., 30% = price * 1.3)
        BigDecimal multiplier =
            BigDecimal.ONE.add(value.divide(ItemConstants.ONE_HUNDRED, 4, RoundingMode.HALF_UP));
        yield price.multiply(multiplier);
      }
      case FIXED_AMOUNT ->
          // Add fixed amount to price
          price.add(value);
    };
  }

  /**
   * Apply JEXL formula to calculate price
   *
   * @param price Current price
   * @param modifier The modifier with JEXL formula
   * @param item The price list item
   * @param color The item color
   * @param quantity The quantity
   * @param material The material (optional)
   * @param urgencyType The urgency type (optional)
   * @return Modified price
   */
  private BigDecimal applyJexlFormula(
      BigDecimal price,
      PriceModifierEntity modifier,
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      String material,
      UrgencyType urgencyType) {

    try {
      // Create context for JEXL evaluation
      Map<String, Object> contextMap =
          createJexlContext(price, modifier, item, color, quantity, material, urgencyType);

      // Use JexlCalculator to evaluate formula
      JexlCalculator calculator = new JexlCalculator(jexlEngine, modifier.getJexlFormula());
      BigDecimal result = calculator.calculate(contextMap);

      if (result == null) {
        log.warn("JEXL formula returned null, using original price");
        return price;
      }

      return result;

    } catch (Exception e) {
      log.error(
          "Error applying JEXL formula for modifier {}: {}", modifier.getName(), e.getMessage());
      throw new FormulaCalculationException(
          "Failed to calculate price using formula for modifier: " + modifier.getName(), e);
    }
  }

  /**
   * Create context for JEXL evaluation
   *
   * @param currentPrice Current price
   * @param modifier The modifier
   * @param item The price list item
   * @param color The item color
   * @param quantity The quantity
   * @param material The material (optional)
   * @param urgencyType The urgency type (optional)
   * @return Context map for JEXL
   */
  private Map<String, Object> createJexlContext(
      BigDecimal currentPrice,
      PriceModifierEntity modifier,
      PriceListItemEntity item,
      ItemColor color,
      BigDecimal quantity,
      String material,
      UrgencyType urgencyType) {

    Map<String, Object> context = new HashMap<>();

    // Basic context
    context.put("price", currentPrice);
    context.put("basePrice", item.getPriceDetails().getBasePrice());
    context.put("quantity", quantity);
    context.put("color", color.name());
    context.put("modifierValue", modifier.getValue());

    // Item context
    context.put("itemName", item.getName());
    context.put("categoryCode", item.getCategory().getCode());
    context.put("unitOfMeasure", item.getUnitOfMeasure().name());

    // Color-specific prices
    context.put("blackPrice", item.getPriceDetails().getPriceBlack());
    context.put("colorPrice", item.getPriceDetails().getPriceColor());

    // Material context (if provided)
    if (material != null) {
      context.put("material", material);
    }

    // Urgency context (if provided)
    if (urgencyType != null) {
      context.put("urgency", urgencyType.name());
      context.put("urgencyMultiplier", urgencyType.getPriceMultiplier());
    }

    // Utility constants
    context.put("HUNDRED", ItemConstants.ONE_HUNDRED);

    // Extended context - now with actual implementation:
    // The following fields are now available for JEXL formulas:
    // - material: for material-specific pricing rules (e.g., "WOOL", "SILK", "LEATHER")
    // - urgency: for urgency-based pricing (NORMAL, URGENT_48H, URGENT_24H)
    // - urgencyMultiplier: the price multiplier for urgency
    // Additional fields will be added as the API extends:
    // - branchCode: for branch-specific pricing
    // - clientType: for VIP/regular client pricing

    log.debug("Created JEXL context with {} variables", context.size());

    return context;
  }

  /**
   * Validate if a modifier is applicable to a category
   *
   * @param modifier The modifier
   * @param categoryCode The category code
   * @return true if applicable
   */
  public boolean isModifierApplicable(PriceModifierEntity modifier, String categoryCode) {
    if (modifier.getApplicableCategories() == null
        || modifier.getApplicableCategories().isEmpty()) {
      // Modifier is applicable to all categories
      return true;
    }

    return modifier.getApplicableCategories().contains(categoryCode);
  }

  /**
   * Filter modifiers by category
   *
   * @param modifiers List of all modifiers
   * @param categoryCode The category code
   * @return Filtered list of applicable modifiers
   */
  public List<PriceModifierEntity> filterApplicableModifiers(
      List<PriceModifierEntity> modifiers, String categoryCode) {

    return modifiers.stream()
        .filter(m -> isModifierApplicable(m, categoryCode))
        .filter(PriceModifierEntity::getActive)
        .toList();
  }
}
