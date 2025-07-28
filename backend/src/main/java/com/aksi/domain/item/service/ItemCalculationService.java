package com.aksi.domain.item.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.item.dto.AppliedModifierResponse;
import com.aksi.api.item.dto.CalculationDetailsResponse;
import com.aksi.api.item.dto.CalculationStepResponse;
import com.aksi.api.item.dto.ItemCalculationRequest;
import com.aksi.api.item.dto.ItemCalculationResponse;
import com.aksi.domain.item.calculation.ModifierApplicator;
import com.aksi.domain.item.calculation.PriceCalculator;
import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.enums.ItemColor;
import com.aksi.domain.item.enums.UrgencyType;
import com.aksi.domain.item.mapper.ItemCalculationMapper;
import com.aksi.domain.item.validation.ItemValidationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for calculating item prices with modifiers. */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ItemCalculationService {

  private final PriceListItemService priceListItemService;
  private final PriceModifierService priceModifierService;
  private final ItemValidationService validationService;
  private final ItemCalculationMapper calculationMapper;
  private final PriceCalculator priceCalculator;
  private final ModifierApplicator modifierApplicator;

  /**
   * Calculate item price with all applicable modifiers.
   *
   * @param request calculation request
   * @return calculation response with detailed breakdown
   */
  public ItemCalculationResponse calculateItemPrice(ItemCalculationRequest request) {
    log.debug("Calculating item price for request: {}", request);

    // Validate request
    validationService.validateCalculationRequest(request);

    // Get price list item
    PriceListItemEntity priceListItem =
        priceListItemService.getPriceListItemEntityById(request.getPriceListItemId());

    // Convert API color to domain color
    ItemColor domainColor = mapApiColorToDomainColor(request.getColor());
    BigDecimal quantity = BigDecimal.valueOf(request.getQuantity());

    // Get modifiers if provided
    List<PriceModifierEntity> modifiers = new ArrayList<>();
    if (request.getModifierCodes() != null && !request.getModifierCodes().isEmpty()) {
      // Get all requested modifiers
      List<PriceModifierEntity> requestedModifiers =
          request.getModifierCodes().stream()
              .map(
                  code -> {
                    try {
                      return priceModifierService.getModifierEntityByCode(code);
                    } catch (Exception e) {
                      log.warn("Modifier {} not found: {}", code, e.getMessage());
                      return null;
                    }
                  })
              .filter(java.util.Objects::nonNull)
              .collect(Collectors.toList());

      // Use modifierApplicator to filter only applicable modifiers for the category
      String categoryCode = priceListItem.getCategory().getCode();
      modifiers = modifierApplicator.filterApplicableModifiers(requestedModifiers, categoryCode);

      // Create final reference for lambda
      final List<PriceModifierEntity> applicableModifiers = modifiers;

      // Log warnings for non-applicable modifiers using validation method
      requestedModifiers.stream()
          .filter(m -> !applicableModifiers.contains(m))
          .forEach(
              m -> {
                boolean isApplicable =
                    priceModifierService.isModifierApplicableToCategory(m.getCode(), categoryCode);
                log.warn(
                    "Modifier {} is not applicable to category {} (validation: {})",
                    m.getCode(),
                    categoryCode,
                    isApplicable);
              });
    }

    // Make modifiers final for lambda usage
    final List<PriceModifierEntity> finalModifiers = modifiers;

    // Convert API urgency to domain urgency if provided
    UrgencyType domainUrgency = null;
    if (request.getUrgencyType() != null) {
      domainUrgency = UrgencyType.fromApiUrgency(request.getUrgencyType());
    }

    // Get material from request
    String material = request.getMaterial();

    // Use PriceCalculator for the main calculation with all parameters
    BigDecimal finalPrice =
        priceCalculator.calculatePrice(
            priceListItem, domainColor, quantity, modifiers, domainUrgency, material);

    // Generate breakdown for response
    PriceCalculator.CalculationBreakdown breakdown =
        priceCalculator.generateBreakdown(
            priceListItem, domainColor, quantity, modifiers, domainUrgency, material);

    // Convert modifiers to applied modifiers for response
    List<AppliedModifierResponse> appliedModifiers =
        breakdown.getModifierApplications().stream()
            .map(
                app -> {
                  PriceModifierEntity modifier =
                      finalModifiers.stream()
                          .filter(m -> m.getName().equals(app.getModifierName()))
                          .findFirst()
                          .orElse(null);
                  if (modifier != null) {
                    return calculationMapper.toAppliedModifier(
                        modifier, app.getDifference(), app.getPriceAfter());
                  }
                  return null;
                })
            .filter(java.util.Objects::nonNull)
            .collect(Collectors.toList());

    // Create calculation details
    // Always include details for transparency as per business requirements
    CalculationDetailsResponse calculationDetails =
        createCalculationDetails(breakdown, priceListItem, domainColor, quantity, modifiers);

    // Build response using mapper
    ItemCalculationResponse response =
        calculationMapper.toCalculationResponse(
            null, // itemId (not provided in request)
            priceListItem, // entity
            quantity, // quantity
            calculationMapper.mapDomainColorToApiColor(
                domainColor), // convert domain color to API color
            breakdown.getBasePrice(), // basePrice
            breakdown.getPriceWithQuantity(), // colorPrice (price with quantity)
            finalPrice, // finalPrice
            appliedModifiers, // appliedModifiers
            calculationDetails); // calculationDetails

    log.debug("Calculated final price: {} for item: {}", finalPrice, priceListItem.getName());
    return response;
  }

  /**
   * Calculate prices for multiple items with error handling and performance optimization.
   *
   * @param requests list of calculation requests
   * @return list of calculation responses
   * @throws IllegalArgumentException if requests is null or empty
   */
  public List<ItemCalculationResponse> calculateMultipleItems(
      List<ItemCalculationRequest> requests) {
    if (requests == null || requests.isEmpty()) {
      log.warn("No items provided for bulk calculation");
      return new ArrayList<>();
    }

    log.debug("Calculating prices for {} items", requests.size());

    // Log total items in price list for context
    long totalItems = getTotalItemsCount();
    log.debug(
        "Processing batch of {} items out of {} total items in price list",
        requests.size(),
        totalItems);

    // Warn if too many items
    if (requests.size() > 100) {
      log.warn(
          "Large batch calculation requested: {} items. Consider pagination.", requests.size());
    }

    List<ItemCalculationResponse> responses = new ArrayList<>(requests.size());
    int successCount = 0;
    int errorCount = 0;

    for (int i = 0; i < requests.size(); i++) {
      ItemCalculationRequest request = requests.get(i);
      try {
        ItemCalculationResponse response = calculateItemPrice(request);
        responses.add(response);
        successCount++;
      } catch (Exception e) {
        log.error("Failed to calculate price for item at index {}: {}", i, e.getMessage());
        errorCount++;

        // Create error response to maintain list order
        ItemCalculationResponse errorResponse = new ItemCalculationResponse();
        errorResponse.setPriceListItemId(request.getPriceListItemId());
        errorResponse.setQuantity(request.getQuantity());
        errorResponse.setColor(request.getColor());
        errorResponse.setFinalPrice(0.0); // Set to zero on error
        errorResponse.setBasePrice(0.0);
        errorResponse.setColorPrice(0.0);
        responses.add(errorResponse);
      }
    }

    log.info(
        "Bulk calculation completed: {} successful, {} failed out of {} total items",
        successCount,
        errorCount,
        requests.size());

    return responses;
  }

  /**
   * Validate and filter modifiers for a specific item and category. This method ensures only
   * applicable modifiers are used in calculations.
   *
   * @param modifierCodes list of modifier codes to validate
   * @param categoryCode category code to check against
   * @return list of valid and applicable modifiers
   */
  public List<PriceModifierEntity> validateModifiersForCategory(
      List<String> modifierCodes, String categoryCode) {
    if (modifierCodes == null || modifierCodes.isEmpty()) {
      return new ArrayList<>();
    }

    log.debug("Validating {} modifiers for category {}", modifierCodes.size(), categoryCode);

    // Get active items in category for validation context
    List<PriceListItemEntity> activeItems = getActiveItemsInCategory(categoryCode);
    List<PriceListItemEntity> allItems = getAllItemsInCategory(categoryCode);
    log.debug(
        "Found {} active items out of {} total items in category {} for modifier validation",
        activeItems.size(),
        allItems.size(),
        categoryCode);

    // Get all requested modifiers
    List<PriceModifierEntity> allModifiers =
        modifierCodes.stream()
            .map(
                code -> {
                  try {
                    return priceModifierService.getModifierEntityByCode(code);
                  } catch (Exception e) {
                    log.warn("Modifier {} not found during validation: {}", code, e.getMessage());
                    return null;
                  }
                })
            .filter(java.util.Objects::nonNull)
            .collect(Collectors.toList());

    // Use modifierApplicator to filter applicable modifiers
    List<PriceModifierEntity> applicableModifiers =
        modifierApplicator.filterApplicableModifiers(allModifiers, categoryCode);

    log.debug(
        "Validated modifiers: {} out of {} are applicable",
        applicableModifiers.size(),
        modifierCodes.size());

    return applicableModifiers;
  }

  /** Map API color enum to domain color enum */
  private ItemColor mapApiColorToDomainColor(com.aksi.api.item.dto.ItemColor apiColor) {
    // Map by name since enums should have same values
    return ItemColor.valueOf(apiColor.name());
  }

  /** Create calculation details response with step-by-step breakdown */
  private CalculationDetailsResponse createCalculationDetails(
      PriceCalculator.CalculationBreakdown breakdown,
      PriceListItemEntity priceListItem,
      ItemColor color,
      BigDecimal quantity,
      List<PriceModifierEntity> modifiers) {

    CalculationDetailsResponse details = new CalculationDetailsResponse();
    List<CalculationStepResponse> steps = new ArrayList<>();

    // Step 1: Base price
    CalculationStepResponse step1 = new CalculationStepResponse();
    step1.setStep(1);
    step1.setDescription(
        "Базова ціна (" + priceListItem.getName() + ", колір: " + color.getDisplayName() + ")");
    step1.setOperation("base");
    step1.setValue(breakdown.getBasePrice().doubleValue());
    step1.setPriceAfter(breakdown.getBasePrice().doubleValue());
    steps.add(step1);

    // Step 2: Quantity multiplication
    if (quantity.compareTo(BigDecimal.ONE) != 0) {
      CalculationStepResponse step2 = new CalculationStepResponse();
      step2.setStep(2);
      step2.setDescription("Множення на кількість (" + quantity + ")");
      step2.setOperation("multiply");
      step2.setValue(quantity.doubleValue());
      step2.setPriceAfter(breakdown.getPriceWithQuantity().doubleValue());
      steps.add(step2);
    }

    // Step 3+: Modifiers
    int stepNum = quantity.compareTo(BigDecimal.ONE) != 0 ? 3 : 2;
    for (PriceCalculator.ModifierApplication app : breakdown.getModifierApplications()) {
      CalculationStepResponse modStep = new CalculationStepResponse();
      modStep.setStep(stepNum++);
      modStep.setDescription("Модифікатор: " + app.getModifierName());
      modStep.setOperation(app.getModifierType().name().toLowerCase());
      modStep.setValue(app.getDifference().doubleValue());
      modStep.setPriceAfter(app.getPriceAfter().doubleValue());
      steps.add(modStep);
    }

    details.setSteps(steps);

    // Create formula string with detailed information
    StringBuilder formula = new StringBuilder();
    formula
        .append("Розрахунок для: ")
        .append(priceListItem.getName())
        .append(" (")
        .append(priceListItem.getCategory().getName())
        .append(")\n");
    formula.append("Одиниця виміру: ").append(priceListItem.getUnitOfMeasure().name()).append("\n");
    formula.append("Формула: ");
    formula.append(breakdown.getBasePrice()).append(" (базова ціна)");

    if (quantity.compareTo(BigDecimal.ONE) != 0) {
      formula.append(" * ").append(quantity).append(" (кількість)");
    }

    // Add modifiers to formula
    for (PriceModifierEntity modifier : modifiers) {
      if (modifier.getType() == com.aksi.domain.item.enums.ModifierType.PERCENTAGE) {
        BigDecimal percentValue =
            modifier.getValue().divide(new BigDecimal("100"), 4, java.math.RoundingMode.HALF_UP);
        formula.append(" * (1 + ").append(percentValue).append(")");
        formula.append(" [").append(modifier.getName()).append("]");
      } else {
        formula.append(" + ").append(modifier.getValue());
        formula.append(" [").append(modifier.getName()).append("]");
      }
    }

    formula.append(" = ").append(breakdown.getFinalPrice());
    details.setFormula(formula.toString());

    return details;
  }

  /**
   * Get all active items in a specific category. This method is used for category-based
   * calculations and suggestions.
   *
   * @param categoryCode category code
   * @return list of active price list items
   */
  public List<PriceListItemEntity> getActiveItemsInCategory(String categoryCode) {
    log.debug("Getting active items for category: {}", categoryCode);
    return priceListItemService.getItemsByCategoryCode(categoryCode, true);
  }

  /**
   * Get all items in a specific category (active and inactive). This method is used for
   * administrative purposes and bulk operations.
   *
   * @param categoryCode category code
   * @return list of all price list items in category
   */
  public List<PriceListItemEntity> getAllItemsInCategory(String categoryCode) {
    log.debug("Getting all items for category: {}", categoryCode);
    return priceListItemService.getItemsByCategoryCode(categoryCode, false);
  }

  /**
   * Get total count of items in price list. This method is used for validation, statistics and
   * performance monitoring.
   *
   * @return total count of price list items
   */
  public long getTotalItemsCount() {
    long count = priceListItemService.getTotalItemCount();
    log.debug("Total items in price list: {}", count);
    return count;
  }
}
