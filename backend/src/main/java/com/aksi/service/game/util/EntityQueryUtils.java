package com.aksi.service.game.util;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.DifficultyLevelRepository;
import com.aksi.repository.GameRepository;
import com.aksi.repository.ServiceTypeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Utility class for querying game entities with consistent error handling. Provides centralized
 * entity lookup operations for all game services.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EntityQueryUtils {

  private final GameRepository gameRepository;
  private final DifficultyLevelRepository difficultyLevelRepository;
  private final ServiceTypeRepository serviceTypeRepository;

  /**
   * Find game entity by ID with consistent error handling.
   *
   * @param gameId Game ID
   * @return Game entity
   * @throws NotFoundException if game not found
   */
  public GameEntity findGameEntity(UUID gameId) {
    return gameRepository
        .findById(gameId)
        .orElseThrow(() -> new NotFoundException("Game not found: " + gameId));
  }

  /**
   * Find difficulty level entity by ID with consistent error handling.
   *
   * @param difficultyLevelId Difficulty level ID
   * @return Difficulty level entity
   * @throws NotFoundException if difficulty level not found
   */
  public DifficultyLevelEntity findDifficultyLevelEntity(UUID difficultyLevelId) {
    return difficultyLevelRepository
        .findById(difficultyLevelId)
        .orElseThrow(
            () -> new NotFoundException("Difficulty level not found: " + difficultyLevelId));
  }

  /**
   * Find service type entity by ID with consistent error handling.
   *
   * @param serviceTypeId Service type ID
   * @return Service type entity
   * @throws NotFoundException if service type not found
   */
  public ServiceTypeEntity findServiceTypeEntity(UUID serviceTypeId) {
    return serviceTypeRepository
        .findById(serviceTypeId)
        .orElseThrow(() -> new NotFoundException("Service type not found: " + serviceTypeId));
  }
}
