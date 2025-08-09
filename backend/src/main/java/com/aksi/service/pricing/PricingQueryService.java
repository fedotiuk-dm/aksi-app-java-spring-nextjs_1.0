package com.aksi.service.pricing;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.pricing.dto.DiscountsResponse;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PriceModifiersResponse;
import com.aksi.api.pricing.dto.ServiceCategoryType;
import com.aksi.mapper.PricingMapper;
import com.aksi.repository.PriceModifierRepository;
import com.aksi.service.pricing.factory.PricingFactory;
import com.aksi.service.pricing.guard.PricingGuard;
import com.aksi.service.pricing.util.PricingQueryUtils;
import com.aksi.service.pricing.validator.PricingValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for pricing domain handling all READ operations. Follows OrderQueryService pattern
 * with structured steps in each method. Uses new component architecture with factory, guard,
 * validator, and utils.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PricingQueryService {

  // Core dependencies
  private final PriceModifierRepository priceModifierRepository;
  private final PricingMapper pricingMapper;

  // Specialized components following order service pattern
  private final PricingCalculator pricingCalculator;
  private final PricingValidator validator;
  private final PricingGuard guard;
  private final PricingFactory factory;
  private final PricingQueryUtils utils;

  /**
   * Calculate price for items with applied modifiers and discounts. Structured approach with
   * validation and orchestrated calculation.
   */
  public PriceCalculationResponse calculatePrice(PriceCalculationRequest request) {
    log.debug("Calculating price for {} items", request.getItems().size());

    // Step 1: Validate request
    validator.validatePriceCalculationRequest(request);

    // Step 2: Orchestrate calculation using specialized calculator
    var calculatedItems =
        request.getItems().stream()
            .map(
                item -> {
                  var priceListItem = guard.loadPriceListItem(item.getPriceListItemId());
                  return pricingCalculator.calculateItemPrice(
                      item, priceListItem, request.getGlobalModifiers());
                })
            .toList();

    // Step 3: Calculate order totals using utils
    var totalsCalculation = utils.calculateOrderTotals(calculatedItems);
    var totals =
        factory.createCalculationTotals(
            totalsCalculation.itemsSubtotal(),
            totalsCalculation.urgencyAmount(),
            totalsCalculation.discountAmount(),
            totalsCalculation.discountApplicableAmount(),
            totalsCalculation.total());

    // Step 4: Build response using factory
    var response = factory.createPriceCalculationResponse(calculatedItems, totals);

    log.debug(
        "Price calculation completed with {} items, total: {}",
        calculatedItems.size(),
        totalsCalculation.total());

    return response;
  }

  /** List price modifiers with optional filtering and sorting. */
  public PriceModifiersResponse listPriceModifiers(
      ServiceCategoryType categoryCode, Boolean active, String sortBy, String sortOrder) {

    log.debug(
        "Listing price modifiers for category: {}, active: {}, sortBy: {}, sortOrder: {}",
        categoryCode,
        active,
        sortBy,
        sortOrder);

    // Step 1: Load entities using guard
    var modifiers = guard.loadPriceModifierEntities(categoryCode, active);

    // Step 2: Sort entities using utils
    var sortedModifiers = utils.sortPriceModifiers(modifiers, sortBy, sortOrder);

    // Step 3: Map entities to DTOs
    var allModifiers = pricingMapper.toPriceModifierDtoList(sortedModifiers);

    // Step 4: Extract general modifiers and create response using factory
    var generalModifiers =
        sortedModifiers.stream()
            .filter(
                m -> m.getCategoryRestrictions() == null || m.getCategoryRestrictions().isEmpty())
            .toList();
    var generalModifierDtos = pricingMapper.toPriceModifierDtoList(generalModifiers);

    var response = factory.createPriceModifiersResponse(allModifiers, generalModifierDtos);

    log.debug(
        "Retrieved {} sorted price modifiers ({} general)",
        response.getModifiers().size(),
        response.getGeneralModifiers().size());

    return response;
  }

  /** List discounts with optional filtering and sorting. */
  public DiscountsResponse listDiscounts(Boolean active, String sortBy, String sortOrder) {
    log.debug(
        "Listing discounts, active: {}, sortBy: {}, sortOrder: {}", active, sortBy, sortOrder);

    // Step 1: Load entities using guard
    var discountEntities = guard.loadDiscountEntities(active);

    // Step 2: Sort entities using utils
    var sortedDiscounts = utils.sortDiscounts(discountEntities, sortBy, sortOrder);

    // Step 3: Build response using factory
    var discountDtos = pricingMapper.toDiscountDtoList(sortedDiscounts);
    var response = factory.createDiscountsResponse(discountDtos);

    log.debug("Retrieved {} sorted discounts", response.getDiscounts().size());

    return response;
  }

  /** Get applicable modifier codes for specific category. */
  public List<String> getApplicableModifierCodes(String categoryCode) {
    log.debug("Getting applicable modifier codes for category: {}", categoryCode);

    var codes =
        priceModifierRepository.findActiveByCategoryCode(categoryCode).stream()
            .map(com.aksi.domain.pricing.PriceModifierEntity::getCode)
            .toList();

    log.debug("Found {} applicable modifier codes", codes.size());
    return codes;
  }

  /**
   * Check if discount is applicable to specific category. Based on business rules: discounts do not
   * apply to washing, ironing, and dyeing services.
   */
  public boolean isDiscountApplicableToCategory(String discountCode, String categoryCode) {
    log.debug("Checking discount applicability: {} for category: {}", discountCode, categoryCode);

    // Business rule: discounts do not apply to washing, ironing, and dyeing categories
    boolean applicable = !isDiscountExcludedCategory(categoryCode);

    log.debug(
        "Discount {} is {} applicable to category {}",
        discountCode,
        applicable ? "" : "NOT",
        categoryCode);

    return applicable;
  }

  // ===== PRIVATE HELPER METHODS =====

  /**
   * Check if category is excluded from discount application. Based on architecture documentation:
   * discounts do not apply to washing, ironing, and dyeing.
   */
  private boolean isDiscountExcludedCategory(String categoryCode) {
    if (categoryCode == null || categoryCode.isBlank()) {
      return false;
    }

    String normalizedCode = categoryCode.toLowerCase().trim();

    // Categories excluded from discounts based on business rules
    return normalizedCode.equals("pranna_bilyzny")
        || // Прання білизни
        normalizedCode.equals("prasuvannya")
        || // Прасування
        normalizedCode.equals("farbuvannya_tekstylyu"); // Фарбування текстилю
  }
}
