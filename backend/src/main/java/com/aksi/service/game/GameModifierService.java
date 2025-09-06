package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import com.aksi.api.game.dto.CreateGameModifierRequest;
import com.aksi.api.game.dto.GameModifierInfo;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.api.game.dto.GameModifiersResponse;
import com.aksi.api.game.dto.SortOrder;
import com.aksi.api.game.dto.UpdateGameModifierRequest;
import com.aksi.domain.game.GameModifierEntity;

/**
 * Service interface for GameModifier domain operations.
 * Handles CRUD operations for GameModifier DTOs.
 */
public interface GameModifierService {

  // Command operations (write)
  GameModifierInfo createGameModifier(CreateGameModifierRequest request);
  GameModifierInfo updateGameModifier(UUID modifierId, UpdateGameModifierRequest request);
  void deleteGameModifier(UUID modifierId);
  GameModifierInfo activateGameModifier(UUID modifierId);
  GameModifierInfo deactivateGameModifier(UUID modifierId);

  // Query operations (read)
  GameModifiersResponse getAllGameModifiers(
      String gameCode,
      GameModifierType type,
      String serviceTypeCode,
      Boolean active,
      String search,
      int page,
      int size,
      String sortBy,
      SortOrder sortOrder,
      GameModifierOperation operation);

  GameModifierInfo getGameModifierById(UUID modifierId);

  /**
   * Get active modifiers for calculation (returns Entity objects for internal calculations)
   *
   * @param gameId Game ID
   * @param serviceTypeId Service type ID
   * @param modifierCodes Specific modifier codes to apply (optional)
   * @return List of applicable modifiers as Entity objects
   */
  List<GameModifierEntity> getActiveModifiersForCalculation(
      UUID gameId, UUID serviceTypeId, List<String> modifierCodes);

  /**
   * Get modifiers by their codes for calculation
   *
   * @param modifierCodes List of modifier codes
   * @return List of modifier entities
   */
  List<GameModifierEntity> getModifiersByCodes(List<String> modifierCodes);

  /**
   * Validate modifier compatibility and prerequisites
   *
   * @param modifiers List of modifiers to validate
   * @throws BadRequestException if validation fails
   */
  void validateModifierCompatibility(List<GameModifierEntity> modifiers);
}
