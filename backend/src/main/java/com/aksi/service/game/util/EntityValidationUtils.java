package com.aksi.service.game.util;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.exception.ConflictException;
import com.aksi.repository.DifficultyLevelRepository;
import com.aksi.repository.GameRepository;
import com.aksi.repository.ServiceTypeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Utility class for common entity existence validations. Reduces code duplication across validation
 * services.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EntityValidationUtils {

  private final GameRepository gameRepository;
  private final DifficultyLevelRepository difficultyLevelRepository;
  private final ServiceTypeRepository serviceTypeRepository;

  /**
   * Validate that game exists.
   *
   * @param gameId Game ID
   * @throws ConflictException if game not found
   */
  public void validateGameExists(UUID gameId) {
    if (!gameRepository.existsById(gameId)) {
      log.error("Game not found with id: {}", gameId);
      throw new ConflictException("Game not found with id: " + gameId);
    }
  }

  /**
   * Validate that difficulty level exists.
   *
   * @param difficultyLevelId Difficulty level ID
   * @throws ConflictException if difficulty level not found
   */
  public void validateDifficultyLevelExists(UUID difficultyLevelId) {
    if (!difficultyLevelRepository.existsById(difficultyLevelId)) {
      log.error("Difficulty level not found with id: {}", difficultyLevelId);
      throw new ConflictException("Difficulty level not found with id: " + difficultyLevelId);
    }
  }

  /**
   * Validate that service type exists.
   *
   * @param serviceTypeId Service type ID
   * @throws ConflictException if service type not found
   */
  public void validateServiceTypeExists(UUID serviceTypeId) {
    if (!serviceTypeRepository.existsById(serviceTypeId)) {
      log.error("Service type not found with id: {}", serviceTypeId);
      throw new ConflictException("Service type not found with id: " + serviceTypeId);
    }
  }

  /**
   * Validate that all required entities exist.
   *
   * @param gameId Game ID
   * @param difficultyLevelId Difficulty level ID
   * @param serviceTypeId Service type ID
   * @throws ConflictException if any entity not found
   */
  public void validateEntitiesExist(UUID gameId, UUID difficultyLevelId, UUID serviceTypeId) {
    validateGameExists(gameId);
    validateDifficultyLevelExists(difficultyLevelId);
    validateServiceTypeExists(serviceTypeId);
  }
}
