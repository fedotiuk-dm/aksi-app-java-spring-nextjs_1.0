package com.aksi.service.pricing;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.CalculationTotals;
import com.aksi.api.pricing.dto.DiscountsResponse;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PriceModifiersResponse;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.PricingMapper;
import com.aksi.repository.DiscountRepository;
import com.aksi.repository.PriceModifierRepository;
import com.aksi.service.catalog.PriceListService;
import com.aksi.service.pricing.calculation.ItemPriceCalculator;
import com.aksi.service.pricing.calculation.TotalsCalculator;
import com.aksi.service.pricing.rules.PricingRulesService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of PricingService with structured calculation logic */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PricingServiceImpl implements PricingService {

  private final PriceModifierRepository priceModifierRepository;
  private final DiscountRepository discountRepository;
  private final PriceListService priceListService;
  private final PricingMapper pricingMapper;

  private final ItemPriceCalculator itemPriceCalculator;
  private final PricingRulesService pricingRulesService;
  private final TotalsCalculator totalsCalculator;

  @Override
  @Transactional(readOnly = true)
  public PriceCalculationResponse calculatePrice(PriceCalculationRequest request) {
    log.debug("Calculating price for {} items", request.getItems().size());

    List<CalculatedItemPrice> calculatedItems = new ArrayList<>();
    List<String> warnings = new ArrayList<>();

    // Calculate each item
    for (var item : request.getItems()) {
      try {
        PriceListItemInfo priceListItem =
            priceListService.getPriceListItemById(item.getPriceListItemId());
        if (priceListItem == null) {
          throw new NotFoundException("Price list item not found: " + item.getPriceListItemId());
        }

        CalculatedItemPrice calculatedItem =
            itemPriceCalculator.calculate(item, priceListItem, request.getGlobalModifiers());
        calculatedItems.add(calculatedItem);
      } catch (Exception e) {
        log.warn(
            "Error calculating price for item {}: {}", item.getPriceListItemId(), e.getMessage());
        warnings.add("Unable to calculate price for item: " + e.getMessage());
      }
    }

    // Calculate totals
    CalculationTotals totals =
        totalsCalculator.calculate(calculatedItems, request.getGlobalModifiers());

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
            .filter(
                m -> m.getCategoryRestrictions() == null || m.getCategoryRestrictions().isEmpty())
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
    return pricingRulesService.isDiscountApplicableToCategory(discountCode, categoryCode);
  }
}
