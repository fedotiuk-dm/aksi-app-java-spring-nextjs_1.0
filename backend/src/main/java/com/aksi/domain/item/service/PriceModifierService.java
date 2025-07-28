package com.aksi.domain.item.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.item.dto.PriceModifierListResponse;
import com.aksi.api.item.dto.PriceModifierResponse;
import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.exception.PriceModifierNotFoundException;
import com.aksi.domain.item.mapper.PriceModifierMapper;
import com.aksi.domain.item.repository.PriceModifierRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for managing price modifiers. */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PriceModifierService {

  private final PriceModifierRepository priceModifierRepository;
  private final PriceModifierMapper priceModifierMapper;
  private final ServiceCategoryService serviceCategoryService;

  /** Initialize service and log configuration. */
  @jakarta.annotation.PostConstruct
  public void init() {
    log.info("PriceModifierService initialized with {} dependencies", 3);
  }

  /**
   * Get all price modifiers.
   *
   * @param categoryCode filter by category code (optional)
   * @param activeOnly whether to include only active modifiers
   * @return list of price modifiers
   */
  public PriceModifierListResponse getModifiers(String categoryCode, Boolean activeOnly) {
    log.debug(
        "Getting price modifiers, categoryCode: {}, activeOnly: {}", categoryCode, activeOnly);

    List<PriceModifierEntity> modifiers;

    if (categoryCode != null) {
      // Use the dedicated method to avoid code duplication
      modifiers = getModifiersForCategory(categoryCode, Boolean.TRUE.equals(activeOnly));
    } else {
      // Get all modifiers using shared method
      if (Boolean.TRUE.equals(activeOnly)) {
        modifiers = getActiveModifiersSorted();
      } else {
        modifiers = getAllModifiersSorted();
      }
    }

    // Use mapper to create response
    PriceModifierListResponse response = priceModifierMapper.toListResponse(modifiers);

    log.debug("Found {} price modifiers", response.getTotal());
    return response;
  }

  /**
   * Get price modifier by code.
   *
   * @param code modifier code
   * @return price modifier
   */
  public PriceModifierResponse getModifierByCode(String code) {
    log.debug("Getting price modifier by code: {}", code);

    PriceModifierEntity modifier =
        priceModifierRepository
            .findByCode(code)
            .orElseThrow(() -> new PriceModifierNotFoundException(code));

    PriceModifierResponse response = priceModifierMapper.toResponse(modifier);

    log.debug("Found price modifier: {}", modifier.getName());
    return response;
  }

  /**
   * Get price modifier entity by code. For internal use by other services.
   *
   * @param code modifier code
   * @return price modifier entity
   */
  public PriceModifierEntity getModifierEntityByCode(String code) {
    return priceModifierRepository
        .findByCode(code)
        .orElseThrow(() -> new PriceModifierNotFoundException(code));
  }

  /**
   * Get price modifiers applicable to category.
   *
   * @param categoryCode category code
   * @param activeOnly whether to include only active modifiers
   * @return list of price modifier entities
   */
  public List<PriceModifierEntity> getModifiersForCategory(
      String categoryCode, boolean activeOnly) {
    // Verify category exists
    serviceCategoryService.getCategoryEntityByCode(categoryCode);

    if (activeOnly) {
      return priceModifierRepository.findByCategoryAndActiveTrue(categoryCode);
    } else {
      // Get all modifiers and filter by category code using shared method
      return getAllModifiersSorted().stream()
          .filter(m -> m.isApplicableToCategory(categoryCode))
          .collect(Collectors.toList());
    }
  }

  /**
   * Check if modifier is applicable to category.
   *
   * @param modifierCode modifier code
   * @param categoryCode category code
   * @return true if applicable
   */
  public boolean isModifierApplicableToCategory(String modifierCode, String categoryCode) {
    PriceModifierEntity modifier = getModifierEntityByCode(modifierCode);
    // Verify category exists
    serviceCategoryService.getCategoryEntityByCode(categoryCode);

    // Check if category code is in the set of applicable category codes
    return modifier.isApplicableToCategory(categoryCode);
  }



  /**
   * Get all active modifiers sorted by priority and name.
   *
   * @return list of active modifiers
   */
  private List<PriceModifierEntity> getActiveModifiersSorted() {
    return priceModifierRepository.findByActiveTrue(Sort.by("priority", "name"));
  }

  /**
   * Get all modifiers sorted by priority and name.
   *
   * @return list of all modifiers
   */
  private List<PriceModifierEntity> getAllModifiersSorted() {
    return priceModifierRepository.findAll(Sort.by("priority", "name"));
  }

}
