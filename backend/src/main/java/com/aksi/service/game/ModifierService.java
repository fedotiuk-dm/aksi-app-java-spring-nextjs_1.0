package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.exception.BadRequestException;

/** Service for managing and retrieving price modifiers for game service calculations. */
public interface ModifierService {

  /**
   * Get active modifiers for game service calculation.
   *
   * @param gameId Game ID
   * @param serviceTypeId Service type ID
   * @param modifierCodes Specific modifier codes to apply (optional)
   * @return List of applicable modifiers
   */
  List<PriceModifierEntity> getActiveModifiersForCalculation(
      UUID gameId, UUID serviceTypeId, List<String> modifierCodes);

  /**
   * Get all active modifiers for a game.
   *
   * @param gameId Game ID
   * @return List of active modifiers
   */
  List<PriceModifierEntity> getActiveModifiersForGame(UUID gameId);

  /**
   * Get modifiers by their codes.
   *
   * @param modifierCodes List of modifier codes
   * @return List of modifier entities
   */
  List<PriceModifierEntity> getModifiersByCodes(List<String> modifierCodes);

  /**
   * Validate modifier compatibility and prerequisites.
   *
   * @param modifiers List of modifiers to validate
   * @throws BadRequestException if validation fails
   */
  void validateModifierCompatibility(List<PriceModifierEntity> modifiers);
}
