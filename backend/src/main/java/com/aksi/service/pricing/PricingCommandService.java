package com.aksi.service.pricing;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.pricing.dto.Discount;
import com.aksi.api.pricing.dto.PriceModifier;
import com.aksi.domain.pricing.DiscountEntity;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.mapper.PricingMapper;
import com.aksi.service.pricing.factory.PricingFactory;
import com.aksi.service.pricing.guard.PricingGuard;
import com.aksi.service.pricing.validator.PricingValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for pricing domain handling all WRITE operations. Follows OrderCommandService
 * pattern with structured steps in each method. Uses new component architecture with guard and
 * validator.
 */
@Service
@Transactional // All operations are write operations
@RequiredArgsConstructor
@Slf4j
public class PricingCommandService {

  // Core dependencies
  private final PricingMapper pricingMapper;

  // Specialized components following order service pattern
  private final PricingValidator validator;
  private final PricingGuard guard;
  private final PricingFactory factory;

  // ===== PRICE MODIFIER MANAGEMENT =====

  /**
   * Create new price modifier with validation. Structured approach: validation -> creation ->
   * persistence -> response
   */
  public PriceModifier createPriceModifier(PriceModifier priceModifierDto) {
    log.info("Creating new price modifier with code: {}", priceModifierDto.getCode());

    // Step 1: Validate input using centralized validator
    validator.validatePriceModifierForCreation(priceModifierDto);

    // Step 2: Check uniqueness using guard
    guard.ensurePriceModifierCodeUnique(priceModifierDto.getCode());

    // Step 3: Create entity from DTO
    PriceModifierEntity entity = pricingMapper.toPriceModifierEntity(priceModifierDto);

    // Step 4: Persist using factory with error handling
    PriceModifierEntity saved = factory.savePriceModifierEntity(entity);

    // Step 5: Return mapped DTO
    PriceModifier result = pricingMapper.toPriceModifier(saved);

    log.info("Successfully created price modifier: {} (ID: {})", result.getCode(), saved.getId());
    return result;
  }

  /**
   * Update existing price modifier. Structured approach: loading -> validation -> updating ->
   * persistence -> response
   */
  public PriceModifier updatePriceModifier(String code, PriceModifier priceModifierDto) {
    log.info("Updating price modifier with code: {}", code);

    // Step 1: Load existing entity using guard
    PriceModifierEntity existing = guard.loadPriceModifierByCode(code);

    // Step 2: Validate input using centralized validator
    validator.validatePriceModifierForUpdate(priceModifierDto);

    // Step 3: Update entity from DTO
    pricingMapper.updatePriceModifierFromDto(priceModifierDto, existing);

    // Step 4: Persist changes using factory
    PriceModifierEntity saved = factory.savePriceModifierEntity(existing);

    // Step 5: Return updated DTO
    PriceModifier result = pricingMapper.toPriceModifier(saved);

    log.info("Successfully updated price modifier: {} (ID: {})", result.getCode(), saved.getId());
    return result;
  }

  /**
   * Delete existing price modifier. Structured approach: loading -> validation -> deletion ->
   * logging
   */
  public void deletePriceModifier(String code) {
    log.info("Deleting price modifier with code: {}", code);

    // Step 1: Load existing entity using guard
    PriceModifierEntity existing = guard.loadPriceModifierByCode(code);

    // Step 2: Validate deletion using guard
    guard.ensurePriceModifierDeletionAllowed(existing);

    // Step 3: Perform deletion using factory
    factory.deletePriceModifier(existing);

    // Step 4: Log successful completion
    log.info("Successfully deleted price modifier: {} (ID: {})", code, existing.getId());
  }

  // ===== DISCOUNT MANAGEMENT =====

  /** Create new discount with validation. Structured approach following price modifier pattern */
  public Discount createDiscount(Discount discountDto) {
    log.info("Creating new discount with code: {}", discountDto.getCode());

    // Step 1: Validate input using centralized validator
    validator.validateDiscountForCreation(discountDto);

    // Step 2: Check uniqueness using guard
    guard.ensureDiscountCodeUnique(discountDto.getCode());

    // Step 3: Create entity from DTO
    DiscountEntity entity = pricingMapper.toDiscountEntity(discountDto);

    // Step 4: Persist entity using factory
    DiscountEntity saved = factory.saveDiscountEntity(entity);

    // Step 5: Return mapped DTO
    Discount result = pricingMapper.toDiscount(saved);

    log.info("Successfully created discount: {} (ID: {})", result.getCode(), saved.getId());
    return result;
  }

  /** Update existing discount. Structured approach following price modifier pattern */
  public Discount updateDiscount(String code, Discount discountDto) {
    log.info("Updating discount with code: {}", code);

    // Step 1: Load existing entity using guard
    DiscountEntity existing = guard.loadDiscountByCode(code);

    // Step 2: Validate input using centralized validator
    validator.validateDiscountForUpdate(discountDto);

    // Step 3: Update entity from DTO
    pricingMapper.updateDiscountFromDto(discountDto, existing);

    // Step 4: Persist changes using factory
    DiscountEntity saved = factory.saveDiscountEntity(existing);

    // Step 5: Return updated DTO
    Discount result = pricingMapper.toDiscount(saved);

    log.info("Successfully updated discount: {} (ID: {})", result.getCode(), saved.getId());
    return result;
  }

  /** Delete existing discount. Structured approach following price modifier pattern */
  public void deleteDiscount(String code) {
    log.info("Deleting discount with code: {}", code);

    // Step 1: Load existing entity using guard
    DiscountEntity existing = guard.loadDiscountByCode(code);

    // Step 2: Validate deletion using guard
    guard.ensureDiscountDeletionAllowed(existing);

    // Step 3: Perform deletion using factory
    factory.deleteDiscount(existing);

    // Step 4: Log successful completion
    log.info("Successfully deleted discount: {} (ID: {})", code, existing.getId());
  }
}
