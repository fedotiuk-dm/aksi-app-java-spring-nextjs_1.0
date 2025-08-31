package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.aksi.api.game.dto.CreateDifficultyLevelRequest;
import com.aksi.api.game.dto.UpdateDifficultyLevelRequest;
import com.aksi.exception.BadRequestException;
import com.aksi.exception.ConflictException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for difficulty level-related business rules and constraints. Handles
 * validation logic separate from command/query services.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DifficultyLevelValidationService {

  private final GameQueryService gameQueryService;
  private final DifficultyLevelQueryService difficultyLevelQueryService;

  /**
   * Validate create difficulty level request.
   *
   * @param request Create difficulty level request
   * @throws BadRequestException if validation fails
   */
  public void validateCreateDifficultyLevel(CreateDifficultyLevelRequest request) {
    log.debug("Validating create difficulty level request: {}", request.getName());

    // Validate required fields
    if (!StringUtils.hasText(request.getCode())) {
      throw new BadRequestException("Difficulty level code is required");
    }

    if (!StringUtils.hasText(request.getName())) {
      throw new BadRequestException("Difficulty level name is required");
    }

    if (request.getGameId() == null) {
      throw new BadRequestException("Game ID is required");
    }

    if (request.getLevelValue() == null) {
      throw new BadRequestException("Level value is required");
    }

    // Store values in local variables for null safety
    String code = request.getCode();
    String name = request.getName();
    UUID gameId = request.getGameId();
    Integer levelValue = request.getLevelValue();

    // Validate game exists
    if (!gameQueryService.existsById(gameId)) {
      throw new BadRequestException("Game not found: " + gameId);
    }

    // Validate code format (uppercase letters, numbers, underscores)
    if (!code.matches("^[A-Z0-9_]+$")) {
      throw new BadRequestException(
          "Difficulty level code must contain only uppercase letters, numbers, and underscores");
    }

    // Validate code length
    if (code.length() < 2 || code.length() > 20) {
      throw new BadRequestException("Difficulty level code must be between 2 and 20 characters");
    }

    // Validate name length
    if (name.length() > 100) {
      throw new BadRequestException("Difficulty level name must not exceed 100 characters");
    }

    // Validate level value range
    if (levelValue < 1 || levelValue > 100) {
      throw new BadRequestException("Level value must be between 1 and 100");
    }

    // Check if code already exists for this game
    if (difficultyLevelQueryService.existsByGameIdAndCode(request.getGameId(), request.getCode())) {
      throw new ConflictException(
          "Difficulty level with code '" + request.getCode() + "' already exists for this game");
    }
  }

  /**
   * Validate update difficulty level request.
   *
   * @param difficultyLevelId Difficulty level ID
   * @param request Update difficulty level request
   * @throws BadRequestException if validation fails
   */
  public void validateUpdateDifficultyLevel(
      UUID difficultyLevelId, UpdateDifficultyLevelRequest request) {
    log.debug(
        "Validating update difficulty level request for difficulty level: {}", difficultyLevelId);

    // Validate difficulty level exists
    if (!difficultyLevelQueryService.existsById(difficultyLevelId)) {
      throw new BadRequestException("Difficulty level not found: " + difficultyLevelId);
    }

    // Note: Difficulty level code cannot be updated via UpdateDifficultyLevelRequest
    // Code can only be set during creation and is immutable

    // Validate name if provided
    if (request.getName() != null) {
      if (!StringUtils.hasText(request.getName())) {
        throw new BadRequestException("Difficulty level name cannot be empty");
      }

      // Additional null check for static analysis
      String name = request.getName();
      if (name != null && name.length() > 100) {
        throw new BadRequestException("Difficulty level name must not exceed 100 characters");
      }
    }

    // Validate level value if provided
    if (request.getLevelValue() != null) {
      // Additional null check for static analysis
      Integer levelValue = request.getLevelValue();
      if (levelValue != null && (levelValue < 1 || levelValue > 100)) {
        throw new BadRequestException("Level value must be between 1 and 100");
      }
    }
  }

  /**
   * Validate difficulty level exists for deletion.
   *
   * @param difficultyLevelId Difficulty level ID
   * @throws BadRequestException if validation fails
   */
  public void validateDifficultyLevelExistsForDeletion(UUID difficultyLevelId) {
    log.debug("Validating difficulty level exists for deletion: {}", difficultyLevelId);

    if (!difficultyLevelQueryService.existsById(difficultyLevelId)) {
      throw new BadRequestException("Difficulty level not found: " + difficultyLevelId);
    }
  }

  /**
   * Validate difficulty level activation/deactivation.
   *
   * @param difficultyLevelId Difficulty level ID
   * @param currentActive Current active status
   * @param targetActive Target active status
   * @throws BadRequestException if validation fails
   * @throws ConflictException if already in target state
   */
  public void validateDifficultyLevelActivation(
      UUID difficultyLevelId, Boolean currentActive, Boolean targetActive) {
    log.debug(
        "Validating difficulty level activation for difficulty level: {} from {} to {}",
        difficultyLevelId,
        currentActive,
        targetActive);

    if (!difficultyLevelQueryService.existsById(difficultyLevelId)) {
      throw new BadRequestException("Difficulty level not found: " + difficultyLevelId);
    }

    if (currentActive != null && currentActive.equals(targetActive)) {
      String state = targetActive ? "active" : "inactive";
      throw new ConflictException("Difficulty level is already " + state);
    }
  }
}
