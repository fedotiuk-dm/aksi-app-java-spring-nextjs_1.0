package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.UpdateGameRequest;
import com.aksi.exception.BadRequestException;
import com.aksi.exception.ConflictException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for game-related business rules and constraints. Handles validation logic
 * separate from command/query services.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameValidationService {

  private final GameQueryService gameQueryService;

  /**
   * Validate create game request.
   *
   * @param request Create game request
   * @throws BadRequestException if validation fails
   */
  public void validateCreateGame(CreateGameRequest request) {
    log.debug("Validating create game request: {}", request.getName());

    // Validate required fields
    if (!StringUtils.hasText(request.getCode())) {
      throw new BadRequestException("Game code is required");
    }

    if (!StringUtils.hasText(request.getName())) {
      throw new BadRequestException("Game name is required");
    }

    if (!StringUtils.hasText(request.getCategory().name())) {
      throw new BadRequestException("Game category is required");
    }

    // Validate code format (uppercase letters, numbers, underscores)
    if (!request.getCode().matches("^[A-Z0-9_]+$")) {
      throw new BadRequestException(
          "Game code must contain only uppercase letters, numbers, and underscores");
    }

    // Validate code length
    if (request.getCode().length() < 2 || request.getCode().length() > 20) {
      throw new BadRequestException("Game code must be between 2 and 20 characters");
    }

    // Check if code already exists
    if (gameQueryService.existsByCode(request.getCode())) {
      throw new ConflictException("Game with code '" + request.getCode() + "' already exists");
    }

    // Validate name length
    if (request.getName().length() > 100) {
      throw new BadRequestException("Game name must not exceed 100 characters");
    }

    // Validate category length
    if (request.getCategory().name().length() > 50) {
      throw new BadRequestException("Game category must not exceed 50 characters");
    }

    // Validate description length if provided
    String description = request.getDescription();
    if (description != null && description.length() > 500) {
      throw new BadRequestException("Game description must not exceed 500 characters");
    }
  }

  /**
   * Validate update game request.
   *
   * @param gameId Game ID
   * @param request Update game request
   * @throws BadRequestException if validation fails
   */
  public void validateUpdateGame(UUID gameId, UpdateGameRequest request) {
    log.debug("Validating update game request for game: {}", gameId);

    // Validate game exists
    if (!gameQueryService.existsById(gameId)) {
      throw new BadRequestException("Game not found: " + gameId);
    }

    // Note: Game code cannot be updated via UpdateGameRequest
    // Code can only be set during creation and is immutable

    // Validate name if provided
    String name = request.getName();
    if (name != null) {
      if (!StringUtils.hasText(name)) {
        throw new BadRequestException("Game name cannot be empty");
      }

      if (name.length() > 100) {
        throw new BadRequestException("Game name must not exceed 100 characters");
      }
    }

    // Validate category if provided
    UpdateGameRequest.CategoryEnum category = request.getCategory();
    if (category != null) {
      String categoryName = category.name();
      if (!StringUtils.hasText(categoryName)) {
        throw new BadRequestException("Game category cannot be empty");
      }

      if (categoryName.length() > 50) {
        throw new BadRequestException("Game category must not exceed 50 characters");
      }
    }

    // Validate description if provided
    String description = request.getDescription();
    if (description != null && description.length() > 500) {
      throw new BadRequestException("Game description must not exceed 500 characters");
    }
  }

  /**
   * Validate game exists for deletion.
   *
   * @param gameId Game ID
   * @throws BadRequestException if validation fails
   */
  public void validateGameExistsForDeletion(UUID gameId) {
    log.debug("Validating game exists for deletion: {}", gameId);

    if (!gameQueryService.existsById(gameId)) {
      throw new BadRequestException("Game not found: " + gameId);
    }
  }

  /**
   * Validate game can be activated/deactivated.
   *
   * @param gameId Game ID
   * @param currentActive Current active status
   * @param targetActive Target active status
   * @throws BadRequestException if validation fails
   * @throws ConflictException if already in target state
   */
  public void validateGameActivation(UUID gameId, Boolean currentActive, Boolean targetActive) {
    log.debug(
        "Validating game activation for game: {} from {} to {}",
        gameId,
        currentActive,
        targetActive);

    if (!gameQueryService.existsById(gameId)) {
      throw new BadRequestException("Game not found: " + gameId);
    }

    if (currentActive != null && currentActive.equals(targetActive)) {
      String state = targetActive ? "active" : "inactive";
      throw new ConflictException("Game is already " + state);
    }
  }
}
