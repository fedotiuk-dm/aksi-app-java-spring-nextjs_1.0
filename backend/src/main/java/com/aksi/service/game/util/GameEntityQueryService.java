package com.aksi.service.game.util;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.game.BoosterEntity;
import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.BoosterRepository;
import com.aksi.repository.DifficultyLevelRepository;
import com.aksi.repository.GameRepository;
import com.aksi.repository.PriceConfigurationRepository;
import com.aksi.repository.ServiceTypeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for finding game-related entities with consistent error handling. Provides
 * centralized entity lookup operations for Command services following CQRS pattern.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class GameEntityQueryService {

  private final GameRepository gameRepository;
  private final DifficultyLevelRepository difficultyLevelRepository;
  private final ServiceTypeRepository serviceTypeRepository;
  private final PriceConfigurationRepository priceConfigurationRepository;
  private final BoosterRepository boosterRepository;

  /**
   * Find game by ID.
   *
   * @param gameId Game ID
   * @return Game entity
   * @throws NotFoundException if game not found
   */
  public GameEntity findGameById(UUID gameId) {
    return gameRepository
        .findById(gameId)
        .orElseThrow(() -> new NotFoundException("Game not found: " + gameId));
  }

  /**
   * Find game by code.
   *
   * @param gameCode Game code
   * @return Game entity
   * @throws NotFoundException if game not found
   */
  public GameEntity findGameByCode(String gameCode) {
    return gameRepository
        .findByCode(gameCode)
        .orElseThrow(() -> new NotFoundException("Game not found: " + gameCode));
  }

  /**
   * Find difficulty level by ID.
   *
   * @param difficultyLevelId Difficulty level ID
   * @return Difficulty level entity
   * @throws NotFoundException if difficulty level not found
   */
  public DifficultyLevelEntity findDifficultyLevelById(UUID difficultyLevelId) {
    return difficultyLevelRepository
        .findById(difficultyLevelId)
        .orElseThrow(
            () -> new NotFoundException("Difficulty level not found: " + difficultyLevelId));
  }

  /**
   * Find difficulty level by game ID and code.
   *
   * @param gameId Game ID
   * @param levelCode Difficulty level code
   * @return Difficulty level entity
   * @throws NotFoundException if difficulty level not found
   */
  public DifficultyLevelEntity findDifficultyLevelByGameIdAndCode(UUID gameId, String levelCode) {
    return difficultyLevelRepository
        .findByGameIdAndCode(gameId, levelCode)
        .orElseThrow(() -> new NotFoundException("Difficulty level not found: " + levelCode));
  }

  /**
   * Find service type by ID.
   *
   * @param serviceTypeId Service type ID
   * @return Service type entity
   * @throws NotFoundException if service type not found
   */
  public ServiceTypeEntity findServiceTypeById(UUID serviceTypeId) {
    return serviceTypeRepository
        .findById(serviceTypeId)
        .orElseThrow(() -> new NotFoundException("Service type not found: " + serviceTypeId));
  }

  /**
   * Find service type by game ID and code.
   *
   * @param gameId Game ID
   * @param serviceCode Service type code
   * @return Service type entity
   * @throws NotFoundException if service type not found
   */
  public ServiceTypeEntity findServiceTypeByGameIdAndCode(UUID gameId, String serviceCode) {
    return serviceTypeRepository
        .findByGameIdAndCode(gameId, serviceCode)
        .orElseThrow(() -> new NotFoundException("Service type not found: " + serviceCode));
  }

  /**
   * Find price configuration by ID.
   *
   * @param priceConfigurationId Price configuration ID
   * @return Price configuration entity
   * @throws NotFoundException if price configuration not found
   */
  public PriceConfigurationEntity findPriceConfigurationById(UUID priceConfigurationId) {
    return priceConfigurationRepository
        .findById(priceConfigurationId)
        .orElseThrow(
            () -> new NotFoundException("Price configuration not found: " + priceConfigurationId));
  }

  /**
   * Find price configuration by combination of game, difficulty level and service type.
   *
   * @param gameId Game ID
   * @param difficultyLevelId Difficulty level ID
   * @param serviceTypeId Service type ID
   * @return Price configuration entity
   * @throws NotFoundException if price configuration not found
   */
  public PriceConfigurationEntity findPriceConfigurationByCombination(
      UUID gameId, UUID difficultyLevelId, UUID serviceTypeId) {

    return priceConfigurationRepository
        .findByGameIdAndDifficultyLevelIdAndServiceTypeId(gameId, difficultyLevelId, serviceTypeId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Price configuration not found for game: "
                        + gameId
                        + ", level: "
                        + difficultyLevelId
                        + ", service: "
                        + serviceTypeId));
  }

  /**
   * Find booster by ID.
   *
   * @param boosterId Booster ID
   * @return Booster entity
   * @throws NotFoundException if booster not found
   */
  public BoosterEntity findBoosterById(UUID boosterId) {
    return boosterRepository
        .findById(boosterId)
        .orElseThrow(() -> new NotFoundException("Booster not found: " + boosterId));
  }
}
