package com.aksi.service.pricing;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.CalculationTotals;
import com.aksi.api.pricing.dto.DiscountDto;
import com.aksi.api.pricing.dto.DiscountsResponse;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PriceModifierDto;
import com.aksi.api.pricing.dto.PriceModifiersResponse;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.domain.pricing.DiscountEntity;
import com.aksi.domain.pricing.PriceModifierEntity;
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

    List<PriceModifierEntity> modifiers;

    if (categoryCode != null) {
      modifiers = priceModifierRepository.findActiveByCategoryCode(categoryCode);
    } else if (active == null || active) {
      modifiers = priceModifierRepository.findAllActiveOrderedBySortOrder();
    } else {
      modifiers = priceModifierRepository.findAll();
    }

    PriceModifiersResponse response = new PriceModifiersResponse();
    response.setModifiers(pricingMapper.toPriceModifierDtoList(modifiers));

    // Group by categories for convenience
    var generalModifiers =
        modifiers.stream()
            .filter(
                m -> m.getCategoryRestrictions() == null || m.getCategoryRestrictions().isEmpty())
            .toList();
    response.setGeneralModifiers(pricingMapper.toPriceModifierDtoList(generalModifiers));

    return response;
  }

  @Override
  @Transactional(readOnly = true)
  public DiscountsResponse listDiscounts(Boolean active) {
    log.debug("Listing discounts, active: {}", active);

    List<DiscountEntity> discountEntities;

    if (active == null || active) {
      discountEntities = discountRepository.findAllActiveOrderedBySortOrder();
    } else {
      discountEntities = discountRepository.findAll();
    }

    DiscountsResponse response = new DiscountsResponse();
    response.setDiscounts(pricingMapper.toDiscountDtoList(discountEntities));

    return response;
  }

  @Override
  @Transactional(readOnly = true)
  public List<String> getApplicableModifierCodes(String categoryCode) {
    return priceModifierRepository.findActiveByCategoryCode(categoryCode).stream()
        .map(PriceModifierEntity::getCode)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public boolean isDiscountApplicableToCategory(String discountCode, String categoryCode) {
    return pricingRulesService.isDiscountApplicableToCategory(discountCode, categoryCode);
  }

  // CRUD operations for Price Modifiers

  @Override
  @Transactional
  public PriceModifierDto createPriceModifier(PriceModifierDto priceModifierDto) {
    log.info("Creating new price modifier with code: {}", priceModifierDto.getCode());

    // Check if modifier with same code already exists
    if (priceModifierRepository.existsByCode(priceModifierDto.getCode())) {
      throw new IllegalArgumentException(
          "Price modifier with code '" + priceModifierDto.getCode() + "' already exists");
    }

    PriceModifierEntity entity = pricingMapper.toPriceModifierEntity(priceModifierDto);
    PriceModifierEntity saved = priceModifierRepository.save(entity);

    return pricingMapper.toPriceModifierDto(saved);
  }

  @Override
  @Transactional
  public PriceModifierDto updatePriceModifier(String code, PriceModifierDto priceModifierDto) {
    log.info("Updating price modifier with code: {}", code);

    PriceModifierEntity existing =
        priceModifierRepository
            .findByCode(code)
            .orElseThrow(() -> new NotFoundException("Price modifier not found: " + code));

    pricingMapper.updatePriceModifierFromDto(priceModifierDto, existing);
    PriceModifierEntity saved = priceModifierRepository.save(existing);

    return pricingMapper.toPriceModifierDto(saved);
  }

  @Override
  @Transactional
  public void deletePriceModifier(String code) {
    log.info("Deleting price modifier with code: {}", code);

    PriceModifierEntity existing =
        priceModifierRepository
            .findByCode(code)
            .orElseThrow(() -> new NotFoundException("Price modifier not found: " + code));

    priceModifierRepository.delete(existing);
  }

  // CRUD operations for Discounts

  @Override
  @Transactional
  public DiscountDto createDiscount(DiscountDto discountDto) {
    log.info("Creating new discount with code: {}", discountDto.getCode());

    // Check if discount with same code already exists
    if (discountRepository.existsByCode(discountDto.getCode())) {
      throw new IllegalArgumentException(
          "Discount with code '" + discountDto.getCode() + "' already exists");
    }

    DiscountEntity entity = pricingMapper.toDiscountEntity(discountDto);
    DiscountEntity saved = discountRepository.save(entity);

    return pricingMapper.toDiscountDto(saved);
  }

  @Override
  @Transactional
  public DiscountDto updateDiscount(String code, DiscountDto discountDto) {
    log.info("Updating discount with code: {}", code);

    DiscountEntity existing =
        discountRepository
            .findByCode(code)
            .orElseThrow(() -> new NotFoundException("Discount not found: " + code));

    pricingMapper.updateDiscountFromDto(discountDto, existing);
    DiscountEntity saved = discountRepository.save(existing);

    return pricingMapper.toDiscountDto(saved);
  }

  @Override
  @Transactional
  public void deleteDiscount(String code) {
    log.info("Deleting discount with code: {}", code);

    DiscountEntity existing =
        discountRepository
            .findByCode(code)
            .orElseThrow(() -> new NotFoundException("Discount not found: " + code));

    discountRepository.delete(existing);
  }
}
