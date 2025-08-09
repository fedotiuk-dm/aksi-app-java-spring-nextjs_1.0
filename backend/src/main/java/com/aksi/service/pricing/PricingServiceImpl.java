package com.aksi.service.pricing;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.pricing.dto.DiscountDto;
import com.aksi.api.pricing.dto.DiscountsResponse;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.PriceModifierDto;
import com.aksi.api.pricing.dto.PriceModifiersResponse;
import com.aksi.api.pricing.dto.ServiceCategoryType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Thin facade implementation of PricingService following Clean Architecture principles. Delegates
 * all operations to specialized Query and Command services.
 *
 * <p>This implementation follows the same pattern as OrderServiceImpl: - No business logic - only
 * delegation - Clear separation of read/write operations (CQRS) - Consistent transaction boundaries
 * - Proper logging and error handling
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PricingServiceImpl implements PricingService {

  private final PricingQueryService queryService;
  private final PricingCommandService commandService;

  // ===== PRICING CALCULATIONS (READ) =====

  @Override
  public PriceCalculationResponse calculatePrice(PriceCalculationRequest request) {
    log.debug("Delegating price calculation for {} items", request.getItems().size());
    return queryService.calculatePrice(request);
  }

  // ===== LISTING OPERATIONS (READ) =====

  @Override
  public PriceModifiersResponse listPriceModifiers(
      ServiceCategoryType categoryCode, Boolean active, String sortBy, String sortOrder) {
    log.debug(
        "Delegating price modifiers listing for category: {}, active: {}", categoryCode, active);
    return queryService.listPriceModifiers(categoryCode, active, sortBy, sortOrder);
  }

  @Override
  public DiscountsResponse listDiscounts(Boolean active, String sortBy, String sortOrder) {
    log.debug("Delegating discounts listing, active: {}", active);
    return queryService.listDiscounts(active, sortBy, sortOrder);
  }

  @Override
  public List<String> getApplicableModifierCodes(String categoryCode) {
    return queryService.getApplicableModifierCodes(categoryCode);
  }

  @Override
  public boolean isDiscountApplicableToCategory(String discountCode, String categoryCode) {
    return queryService.isDiscountApplicableToCategory(discountCode, categoryCode);
  }

  // ===== PRICE MODIFIER MANAGEMENT (WRITE) =====

  @Override
  @Transactional
  public PriceModifierDto createPriceModifier(PriceModifierDto priceModifierDto) {
    log.info("Delegating creation of price modifier with code: {}", priceModifierDto.getCode());
    return commandService.createPriceModifier(priceModifierDto);
  }

  @Override
  @Transactional
  public PriceModifierDto updatePriceModifier(String code, PriceModifierDto priceModifierDto) {
    log.info("Delegating update of price modifier with code: {}", code);
    return commandService.updatePriceModifier(code, priceModifierDto);
  }

  @Override
  @Transactional
  public void deletePriceModifier(String code) {
    log.info("Delegating deletion of price modifier with code: {}", code);
    commandService.deletePriceModifier(code);
  }

  // ===== DISCOUNT MANAGEMENT (WRITE) =====

  @Override
  @Transactional
  public DiscountDto createDiscount(DiscountDto discountDto) {
    log.info("Delegating creation of discount with code: {}", discountDto.getCode());
    return commandService.createDiscount(discountDto);
  }

  @Override
  @Transactional
  public DiscountDto updateDiscount(String code, DiscountDto discountDto) {
    log.info("Delegating update of discount with code: {}", code);
    return commandService.updateDiscount(code, discountDto);
  }

  @Override
  @Transactional
  public void deleteDiscount(String code) {
    log.info("Delegating deletion of discount with code: {}", code);
    commandService.deleteDiscount(code);
  }
}
