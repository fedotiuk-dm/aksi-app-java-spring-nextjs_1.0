package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.UpdateGameRequest;
import com.aksi.domain.game.GameEntity;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.GameMapper;
import com.aksi.repository.GameRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for game-related write operations. Handles all game modifications and state
 * changes.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class GameCommandService {

  private final GameRepository gameRepository;
  private final GameMapper gameMapper;
  private final GameValidationService validationService;

  /**
   * Create new game.
   *
   * @param request Create game request
   * @return Created game information
   */
  public Game createGame(CreateGameRequest request) {
    log.info("Creating new game: {}", request.getName());

    // Validate request
    validationService.validateCreateGame(request);

    // Create and save entity
    GameEntity gameEntity = gameMapper.toGameEntity(request);
    GameEntity saved = gameRepository.save(gameEntity);

    log.info("Created game with ID: {}", saved.getId());
    return gameMapper.toGameDto(saved);
  }

  /**
   * Update existing game.
   *
   * @param gameId Game ID
   * @param request Update game request
   * @return Updated game information
   * @throws NotFoundException if game not found
   */
  public Game updateGame(UUID gameId, UpdateGameRequest request) {
    log.info("Updating game: {}", gameId);

    // Validate update request
    validationService.validateUpdateGame(gameId, request);

    // Find existing game
    GameEntity gameEntity =
        gameRepository
            .findById(gameId)
            .orElseThrow(
                () -> new com.aksi.exception.NotFoundException("Game not found: " + gameId));

    // Update entity using MapStruct
    gameMapper.updateGameFromDto(request, gameEntity);

    GameEntity updated = gameRepository.save(gameEntity);
    log.info("Updated game: {}", gameId);

    return gameMapper.toGameDto(updated);
  }

  /**
   * Delete game.
   *
   * @param gameId Game ID
   * @throws NotFoundException if game not found
   * @throws ConflictException if game has dependent entities
   */
  public void deleteGame(UUID gameId) {
    log.info("Deleting game: {}", gameId);

    // Validate game exists for deletion
    validationService.validateGameExistsForDeletion(gameId);

    GameEntity gameEntity =
        gameRepository
            .findById(gameId)
            .orElseThrow(() -> new NotFoundException("Game not found: " + gameId));

    // Check for dependent entities (difficulty levels, service types, etc.)
    if (!gameEntity.getDifficultyLevels().isEmpty()) {
      throw new ConflictException("Cannot delete game with existing difficulty levels");
    }
    if (!gameEntity.getPriceConfigurations().isEmpty()) {
      throw new ConflictException("Cannot delete game with existing price configurations");
    }

    gameRepository.deleteById(gameId);
    log.info("Deleted game: {}", gameId);
  }

  /**
   * Activate a game.
   *
   * @param gameId Game ID
   * @return Updated game information
   * @throws NotFoundException if game not found
   * @throws ConflictException if game is already active
   */
  public Game activateGame(UUID gameId) {
    log.info("Activating game: {}", gameId);

    GameEntity gameEntity =
        gameRepository
            .findById(gameId)
            .orElseThrow(() -> new NotFoundException("Game not found: " + gameId));

    // Validate activation
    validationService.validateGameActivation(gameId, gameEntity.getActive(), true);

    gameEntity.setActive(true);
    GameEntity updated = gameRepository.save(gameEntity);

    log.info("Activated game: {}", gameId);
    return gameMapper.toGameDto(updated);
  }

  /**
   * Deactivate a game.
   *
   * @param gameId Game ID
   * @return Updated game information
   * @throws NotFoundException if game not found
   * @throws ConflictException if game is already inactive
   */
  public Game deactivateGame(UUID gameId) {
    log.info("Deactivating game: {}", gameId);

    GameEntity gameEntity =
        gameRepository
            .findById(gameId)
            .orElseThrow(() -> new NotFoundException("Game not found: " + gameId));

    // Validate deactivation
    validationService.validateGameActivation(gameId, gameEntity.getActive(), false);

    gameEntity.setActive(false);
    GameEntity updated = gameRepository.save(gameEntity);

    log.info("Deactivated game: {}", gameId);
    return gameMapper.toGameDto(updated);
  }
}
