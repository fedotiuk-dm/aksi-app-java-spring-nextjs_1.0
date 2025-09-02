package com.aksi.service.game;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.exception.BadRequestException;
import com.aksi.repository.PriceModifierRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of ModifierService for managing price modifiers. */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ModifierServiceImpl implements ModifierService {

  private final PriceModifierRepository modifierRepository;

  @Override
  public List<PriceModifierEntity> getActiveModifiersForCalculation(
      UUID gameId, UUID serviceTypeId, List<String> modifierCodes) {

    log.debug(
        "Getting modifiers for game: {}, service: {}, codes: {}",
        gameId,
        serviceTypeId,
        modifierCodes);

    // If specific codes provided, get those modifiers
    if (!CollectionUtils.isEmpty(modifierCodes)) {
      List<PriceModifierEntity> requestedModifiers = getModifiersByCodes(modifierCodes);

      // Filter only active modifiers
      List<PriceModifierEntity> activeModifiers =
          requestedModifiers.stream()
              .filter(PriceModifierEntity::isActive)
              .collect(Collectors.toList());

      log.debug(
          "Found {} active modifiers out of {} requested",
          activeModifiers.size(),
          requestedModifiers.size());

      return activeModifiers;
    }

    // If no specific codes, get all active modifiers for the game
    // This is a simplified approach - in production, you might want more sophisticated logic
    return getActiveModifiersForGame(gameId);
  }

  @Override
  public List<PriceModifierEntity> getActiveModifiersForGame(UUID gameId) {
    // For now, return all active modifiers
    // In production, you might filter by game-specific categories
    List<PriceModifierEntity> modifiers = modifierRepository.findByActiveTrueOrderBySortOrderAsc();

    log.debug("Found {} active modifiers for game: {}", modifiers.size(), gameId);

    return modifiers;
  }

  @Override
  public List<PriceModifierEntity> getModifiersByCodes(List<String> modifierCodes) {
    if (CollectionUtils.isEmpty(modifierCodes)) {
      return List.of();
    }

    return modifierCodes.stream()
        .map(
            code ->
                modifierRepository
                    .findByCode(code)
                    .orElseThrow(() -> new BadRequestException("Modifier not found: " + code)))
        .collect(Collectors.toList());
  }

  @Override
  public void validateModifierCompatibility(List<PriceModifierEntity> modifiers) {
    if (CollectionUtils.isEmpty(modifiers)) {
      return;
    }

    log.debug("Validating compatibility of {} modifiers", modifiers.size());

    // Basic validation - check for duplicates
    long uniqueCount = modifiers.stream().map(PriceModifierEntity::getCode).distinct().count();

    if (uniqueCount != modifiers.size()) {
      throw new BadRequestException("Duplicate modifiers found in request");
    }

    // TODO: Add more sophisticated compatibility checks
    // - Check for mutually exclusive modifiers
    // - Validate category restrictions
    // - Check prerequisites

    log.debug("Modifier compatibility validation passed");
  }
}
