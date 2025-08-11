package com.aksi.service.pricing.util;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.SortOrder;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.domain.pricing.DiscountEntity;
import com.aksi.domain.pricing.PriceModifierEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * Utility service for pricing query operations. Centralizes common query logic and transformations.
 * Follows OrderQueryUtils pattern for consistent architecture.
 */
@Component
@Slf4j
public class PricingQueryUtils {

  // Default sorting
  private static final String DEFAULT_MODIFIER_SORT = "sortOrder";
  private static final String DEFAULT_DISCOUNT_SORT = "sortOrder";

  /** Sort price modifiers by specified field and order. */
  public List<PriceModifierEntity> sortPriceModifiers(
      List<PriceModifierEntity> modifiers, String sortBy, String sortOrder) {
    return sortEntities(
        modifiers,
        sortBy,
        sortOrder,
        DEFAULT_MODIFIER_SORT,
        this::createModifierComparator,
        "price modifiers");
  }

  /** Sort discounts by specified field and order. */
  public List<DiscountEntity> sortDiscounts(
      List<DiscountEntity> discounts, String sortBy, String sortOrder) {
    return sortEntities(
        discounts,
        sortBy,
        sortOrder,
        DEFAULT_DISCOUNT_SORT,
        this::createDiscountComparator,
        "discounts");
  }

  /**
   * Determine base price based on color characteristics. Based on business rules from OrderWizard
   * documentation: different pricing for black/colored items.
   */
  public int determineBasePrice(PriceListItemInfo priceListItem, String color) {
    int basePrice = priceListItem.getBasePrice();

    if (color == null || color.isBlank()) {
      return basePrice;
    }

    String normalizedColor = color.toLowerCase().trim();

    // Check for black items (special pricing)
    Integer blackPrice = priceListItem.getPriceBlack();
    if (checkBlackColor(normalizedColor) && blackPrice != null) {
      log.debug("Using black price for item {}: {}", priceListItem.getId(), blackPrice);
      return blackPrice;
    }

    // Check for any colored items (all colors except black)
    Integer colorPrice = priceListItem.getPriceColor();
    if (colorPrice != null) {
      log.debug("Using color price for item {}: {}", priceListItem.getId(), colorPrice);
      return colorPrice;
    }

    return basePrice;
  }

  /**
   * Calculate final amount after all modifiers, urgency, and discounts. Following OrderWizard
   * logic: base + modifiers + urgency - discounts.
   */
  public int calculateFinalAmount(
      int baseAmount, int modifiersTotal, int urgencyAmount, int discountAmount) {
    return baseAmount + modifiersTotal + urgencyAmount - discountAmount;
  }

  /**
   * Calculate order totals from list of calculated items. Aggregates all pricing calculations into
   * summary values for order-level reporting.
   */
  public OrderTotalsCalculation calculateOrderTotals(List<CalculatedItemPrice> calculatedItems) {
    log.debug("Calculating order totals for {} items", calculatedItems.size());

    int itemsSubtotal =
        calculatedItems.stream().mapToInt(item -> item.getCalculations().getSubtotal()).sum();

    int urgencyAmount =
        calculatedItems.stream()
            .mapToInt(
                item ->
                    Optional.ofNullable(item.getCalculations().getUrgencyModifier())
                        .map(com.aksi.api.pricing.dto.AppliedModifier::getAmount)
                        .orElse(0))
            .sum();

    int discountAmount =
        calculatedItems.stream()
            .mapToInt(
                item ->
                    Math.abs(
                        Optional.ofNullable(item.getCalculations().getDiscountModifier())
                            .map(com.aksi.api.pricing.dto.AppliedModifier::getAmount)
                            .orElse(0)))
            .sum();

    int discountApplicableAmount =
        calculatedItems.stream()
            .mapToInt(
                item ->
                    Boolean.TRUE.equals(item.getCalculations().getDiscountEligible())
                        ? item.getCalculations().getSubtotal()
                        : 0)
            .sum();

    int total = calculatedItems.stream().mapToInt(CalculatedItemPrice::getTotal).sum();

    log.debug(
        "Order totals calculated: subtotal={}, urgency={}, discount={}, applicable={}, total={}",
        itemsSubtotal,
        urgencyAmount,
        discountAmount,
        discountApplicableAmount,
        total);

    return new OrderTotalsCalculation(
        itemsSubtotal, urgencyAmount, discountAmount, discountApplicableAmount, total);
  }

  /** Result of order totals calculation. */
  public record OrderTotalsCalculation(
      int itemsSubtotal,
      int urgencyAmount,
      int discountAmount,
      int discountApplicableAmount,
      int total) {}

  // ===== PRIVATE HELPER METHODS =====

  /** Generic method for sorting entities with common logic. */
  private <T> List<T> sortEntities(
      List<T> entities,
      String sortBy,
      String sortOrder,
      String defaultSort,
      Function<String, Comparator<T>> comparatorFactory,
      String entityType) {

    if (entities.isEmpty()) {
      return entities;
    }

    String effectiveSortBy = sortBy != null ? sortBy : defaultSort;
    SortOrder effectiveOrder = parseSortOrder(sortOrder);

    log.debug(
        "Sorting {} {} by {} {}", entities.size(), entityType, effectiveSortBy, effectiveOrder);

    Comparator<T> comparator = comparatorFactory.apply(effectiveSortBy);

    if (effectiveOrder == SortOrder.DESC) {
      comparator = comparator.reversed();
    }

    return entities.stream().sorted(comparator).toList();
  }

  private boolean checkBlackColor(String color) {
    return "black".equals(color) || "чорний".equals(color);
  }

  private SortOrder parseSortOrder(String sortOrder) {
    if (sortOrder == null || sortOrder.trim().isEmpty()) {
      return SortOrder.ASC; // Default
    }

    try {
      return SortOrder.fromValue(sortOrder.trim().toUpperCase());
    } catch (IllegalArgumentException e) {
      log.warn("Invalid sort order '{}', using ASC as default", sortOrder);
      return SortOrder.ASC;
    }
  }

  private Comparator<PriceModifierEntity> createModifierComparator(String sortBy) {
    return switch (sortBy.toLowerCase()) {
      case "name" ->
          Comparator.comparing(
              PriceModifierEntity::getName, Comparator.nullsLast(String::compareToIgnoreCase));
      case "code" ->
          Comparator.comparing(
              PriceModifierEntity::getCode, Comparator.nullsLast(String::compareToIgnoreCase));
      case "value" ->
          Comparator.comparing(
              PriceModifierEntity::getValue, Comparator.nullsLast(Integer::compareTo));
      case "sortorder", "sort_order" ->
          createSortOrderComparator(PriceModifierEntity::getSortOrder);
      case "active" -> Comparator.comparing(PriceModifierEntity::isActive);
      default -> {
        logUnknownSortField(sortBy);
        yield createSortOrderComparator(PriceModifierEntity::getSortOrder);
      }
    };
  }

  private Comparator<DiscountEntity> createDiscountComparator(String sortBy) {
    return switch (sortBy.toLowerCase()) {
      case "name" ->
          Comparator.comparing(
              DiscountEntity::getName, Comparator.nullsLast(String::compareToIgnoreCase));
      case "code" ->
          Comparator.comparing(
              DiscountEntity::getCode, Comparator.nullsLast(String::compareToIgnoreCase));
      case "percentage" ->
          Comparator.comparing(
              DiscountEntity::getPercentage, Comparator.nullsLast(Integer::compareTo));
      case "sortorder", "sort_order" -> createSortOrderComparator(DiscountEntity::getSortOrder);
      case "active" -> Comparator.comparing(DiscountEntity::isActive);
      default -> {
        logUnknownSortField(sortBy);
        yield createSortOrderComparator(DiscountEntity::getSortOrder);
      }
    };
  }

  private <T> Comparator<T> createSortOrderComparator(Function<T, Integer> sortOrderExtractor) {
    return Comparator.comparing(sortOrderExtractor, Comparator.nullsLast(Integer::compareTo));
  }

  private void logUnknownSortField(String sortBy) {
    log.debug("Unknown sort field '{}', using sortOrder", sortBy);
  }
}
