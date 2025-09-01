package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateDifficultyLevelRequest;
import com.aksi.api.game.dto.DifficultyLevel;
import com.aksi.api.game.dto.UpdateDifficultyLevelRequest;
import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.DifficultyLevelMapper;
import com.aksi.repository.DifficultyLevelRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for difficulty level-related write operations. Handles all difficulty level
 * modifications and state changes.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DifficultyLevelCommandService {

  private final DifficultyLevelRepository difficultyLevelRepository;
  private final DifficultyLevelMapper difficultyLevelMapper;
  private final GameQueryService gameQueryService;
  private final DifficultyLevelValidationService validationService;

  /**
   * Create new difficulty level.
   *
   * @param request Create difficulty level request
   * @return Created difficulty level information
   */
  public DifficultyLevel createDifficultyLevel(CreateDifficultyLevelRequest request) {
    log.info(
        "Creating new difficulty level: {} for game: {}", request.getName(), request.getGameId());

    // Validate request
    validationService.validateCreateDifficultyLevel(request);

    // Find game entity
    GameEntity gameEntity = gameQueryService.findGameEntityById(request.getGameId());

    // Create and save entity
    DifficultyLevelEntity difficultyLevelEntity =
        difficultyLevelMapper.toDifficultyLevelEntity(request);
    difficultyLevelEntity.setGame(gameEntity);

    DifficultyLevelEntity saved = difficultyLevelRepository.save(difficultyLevelEntity);

    log.info("Created difficulty level with ID: {}", saved.getId());
    return difficultyLevelMapper.toDifficultyLevelDto(saved);
  }

  /**
   * Update existing difficulty level.
   *
   * @param difficultyLevelId Difficulty level ID
   * @param request Update difficulty level request
   * @return Updated difficulty level information
   * @throws NotFoundException if difficulty level not found
   */
  public DifficultyLevel updateDifficultyLevel(
      UUID difficultyLevelId, UpdateDifficultyLevelRequest request) {
    log.info("Updating difficulty level: {}", difficultyLevelId);

    // Find existing difficulty level
    DifficultyLevelEntity difficultyLevelEntity =
        difficultyLevelRepository
            .findById(difficultyLevelId)
            .orElseThrow(
                () -> new NotFoundException("Difficulty level not found: " + difficultyLevelId));

    // Validate update request
    validationService.validateUpdateDifficultyLevel(difficultyLevelId, request);

    // Update entity using MapStruct
    difficultyLevelMapper.updateDifficultyLevelFromDto(request, difficultyLevelEntity);

    DifficultyLevelEntity updated = difficultyLevelRepository.save(difficultyLevelEntity);
    log.info("Updated difficulty level: {}", difficultyLevelId);

    return difficultyLevelMapper.toDifficultyLevelDto(updated);
  }

  /**
   * Delete difficulty level.
   *
   * @param difficultyLevelId Difficulty level ID
   * @throws NotFoundException if difficulty level not found
   * @throws ConflictException if difficulty level has dependent entities
   */
  public void deleteDifficultyLevel(UUID difficultyLevelId) {
    log.info("Deleting difficulty level: {}", difficultyLevelId);

    // Validate difficulty level exists for deletion
    validationService.validateDifficultyLevelExistsForDeletion(difficultyLevelId);

    DifficultyLevelEntity difficultyLevelEntity =
        difficultyLevelRepository
            .findById(difficultyLevelId)
            .orElseThrow(
                () -> new NotFoundException("Difficulty level not found: " + difficultyLevelId));

    // Check for dependent entities (price configurations)
    if (!difficultyLevelEntity.getPriceConfigurations().isEmpty()) {
      throw new ConflictException(
          "Cannot delete difficulty level with existing price configurations");
    }

    difficultyLevelRepository.deleteById(difficultyLevelId);
    log.info("Deleted difficulty level: {}", difficultyLevelId);
  }

  /**
   * Activate a difficulty level.
   *
   * @param difficultyLevelId Difficulty level ID
   * @return Updated difficulty level information
   * @throws NotFoundException if difficulty level not found
   * @throws ConflictException if difficulty level is already active
   */
  public DifficultyLevel activateDifficultyLevel(UUID difficultyLevelId) {
    log.info("Activating difficulty level: {}", difficultyLevelId);

    DifficultyLevelEntity difficultyLevelEntity =
        difficultyLevelRepository
            .findById(difficultyLevelId)
            .orElseThrow(
                () -> new NotFoundException("Difficulty level not found: " + difficultyLevelId));

    // Validate activation
    validationService.validateDifficultyLevelActivation(
        difficultyLevelId, difficultyLevelEntity.getActive(), true);

    difficultyLevelEntity.setActive(true);
    DifficultyLevelEntity updated = difficultyLevelRepository.save(difficultyLevelEntity);

    log.info("Activated difficulty level: {}", difficultyLevelId);
    return difficultyLevelMapper.toDifficultyLevelDto(updated);
  }

  /**
   * Deactivate a difficulty level.
   *
   * @param difficultyLevelId Difficulty level ID
   * @return Updated difficulty level information
   * @throws NotFoundException if difficulty level not found
   * @throws ConflictException if difficulty level is already inactive
   */
  public DifficultyLevel deactivateDifficultyLevel(UUID difficultyLevelId) {
    log.info("Deactivating difficulty level: {}", difficultyLevelId);

    DifficultyLevelEntity difficultyLevelEntity =
        difficultyLevelRepository
            .findById(difficultyLevelId)
            .orElseThrow(
                () -> new NotFoundException("Difficulty level not found: " + difficultyLevelId));

    // Validate deactivation
    validationService.validateDifficultyLevelActivation(
        difficultyLevelId, difficultyLevelEntity.getActive(), false);

    difficultyLevelEntity.setActive(false);
    DifficultyLevelEntity updated = difficultyLevelRepository.save(difficultyLevelEntity);

    log.info("Deactivated difficulty level: {}", difficultyLevelId);
    return difficultyLevelMapper.toDifficultyLevelDto(updated);
  }
}
