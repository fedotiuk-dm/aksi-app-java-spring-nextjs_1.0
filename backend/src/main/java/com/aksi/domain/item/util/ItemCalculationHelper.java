package com.aksi.domain.item.util;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.service.ItemCalculationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Helper class for item calculations and modifier validation. Provides utility methods for working
 * with price calculations.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ItemCalculationHelper {

  private final ItemCalculationService itemCalculationService;

  /**
   * Validate modifiers for a category and return only applicable ones. This is useful before
   * performing calculations to ensure only valid modifiers are used.
   *
   * @param modifierCodes list of modifier codes
   * @param categoryCode category to validate against
   * @return applicable modifier codes
   */
  public List<String> getApplicableModifierCodes(List<String> modifierCodes, String categoryCode) {
    if (modifierCodes == null || modifierCodes.isEmpty()) {
      return List.of();
    }

    log.debug(
        "Checking applicability of {} modifiers for category {}",
        modifierCodes.size(),
        categoryCode);

    // Use the calculation service to validate modifiers
    List<PriceModifierEntity> validModifiers =
        itemCalculationService.validateModifiersForCategory(modifierCodes, categoryCode);

    // Extract codes from valid modifiers
    List<String> applicableCodes =
        validModifiers.stream().map(PriceModifierEntity::getCode).collect(Collectors.toList());

    // Log any modifiers that were filtered out
    List<String> rejectedCodes =
        modifierCodes.stream()
            .filter(code -> !applicableCodes.contains(code))
            .collect(Collectors.toList());

    if (!rejectedCodes.isEmpty()) {
      log.info(
          "Rejected {} modifiers for category {}: {}",
          rejectedCodes.size(),
          categoryCode,
          rejectedCodes);
    }

    return applicableCodes;
  }

  /**
   * Check if all requested modifiers are applicable to a category.
   *
   * @param modifierCodes list of modifier codes
   * @param categoryCode category to validate against
   * @return true if all modifiers are applicable
   */
  public boolean areAllModifiersApplicable(List<String> modifierCodes, String categoryCode) {
    if (modifierCodes == null || modifierCodes.isEmpty()) {
      return true;
    }

    List<PriceModifierEntity> validModifiers =
        itemCalculationService.validateModifiersForCategory(modifierCodes, categoryCode);

    return validModifiers.size() == modifierCodes.size();
  }

  /**
   * Get modifier validation summary for logging or debugging.
   *
   * @param modifierCodes list of modifier codes
   * @param categoryCode category to validate against
   * @return validation summary string
   */
  public String getModifierValidationSummary(List<String> modifierCodes, String categoryCode) {
    if (modifierCodes == null || modifierCodes.isEmpty()) {
      return "No modifiers to validate";
    }

    List<PriceModifierEntity> validModifiers =
        itemCalculationService.validateModifiersForCategory(modifierCodes, categoryCode);

    int totalRequested = modifierCodes.size();
    int totalValid = validModifiers.size();
    int totalRejected = totalRequested - totalValid;

    return String.format(
        "Modifier validation for category %s: %d requested, %d valid, %d rejected",
        categoryCode, totalRequested, totalValid, totalRejected);
  }
}
