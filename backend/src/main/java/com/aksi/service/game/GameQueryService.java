package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.GameListResponse;
import com.aksi.domain.game.GameEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.GameMapper;
import com.aksi.repository.GameRepository;
import com.aksi.util.PaginationUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for game-related read operations. All methods are read-only and optimized for
 * queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class GameQueryService {

  private final GameRepository gameRepository;
  private final GameMapper gameMapper;

  /**
   * Get game by ID.
   *
   * @param gameId Game ID
   * @return Game information
   * @throws NotFoundException if game not found
   */
  public Game getGameById(UUID gameId) {
    log.debug("Getting game by id: {}", gameId);

    GameEntity gameEntity =
        gameRepository
            .findById(gameId)
            .orElseThrow(() -> new NotFoundException("Game not found: " + gameId));
    return gameMapper.toGameDto(gameEntity);
  }

  /**
   * Get game by code.
   *
   * @param code Game code
   * @return Game information
   * @throws NotFoundException if game not found
   */
  public Game getGameByCode(String code) {
    log.debug("Getting game by code: {}", code);

    GameEntity gameEntity =
        gameRepository
            .findByCode(code)
            .orElseThrow(() -> new NotFoundException("Game not found with code: " + code));
    return gameMapper.toGameDto(gameEntity);
  }

  /**
   * Find game entity by ID (for internal use by command services).
   *
   * @param gameId Game ID
   * @return Game entity
   * @throws NotFoundException if game not found
   */
  public GameEntity findGameEntityById(UUID gameId) {
    return gameRepository
        .findById(gameId)
        .orElseThrow(() -> new NotFoundException("Game not found: " + gameId));
  }

  /**
   * Find game entity by code (for internal use by command services).
   *
   * @param code Game code
   * @return Game entity
   * @throws NotFoundException if game not found
   */
  public GameEntity findGameEntityByCode(String code) {
    return gameRepository
        .findByCode(code)
        .orElseThrow(() -> new NotFoundException("Game not found with code: " + code));
  }

  /**
   * Check if game exists by ID.
   *
   * @param gameId Game ID
   * @return true if game exists
   */
  public boolean existsById(UUID gameId) {
    return gameRepository.existsById(gameId);
  }

  /**
   * Check if game exists by code.
   *
   * @param code Game code
   * @return true if game exists
   */
  public boolean existsByCode(String code) {
    return gameRepository.findByCode(code).isPresent();
  }

  /**
   * List games with pagination and filtering.
   *
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @param sortBy Sort field
   * @param sortOrder Sort direction
   * @param active Filter by active status
   * @param search Search by name or code
   * @return Games response with pagination
   */
  public GameListResponse listGames(
      Integer page, Integer size, String sortBy, String sortOrder, Boolean active, String search) {
    log.debug(
        "Listing games - page: {}, size: {}, sortBy: {}, sortOrder: {}, active: {}, search: '{}'",
        page,
        size,
        sortBy,
        sortOrder,
        active,
        search);

    // Create pageable and search
    Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortOrder);
    String searchTerm = search != null && !search.trim().isEmpty() ? search.trim() : null;

    Page<GameEntity> gamePage =
        gameRepository.findGamesWithSearchAndPagination(active, searchTerm, pageable);

    return buildGamesResponse(gamePage);
  }

  /**
   * Get all active games.
   *
   * @return List of active games
   */
  public List<Game> getAllActiveGames() {
    log.debug("Getting all active games");

    List<GameEntity> gameEntities = gameRepository.findByActiveTrueOrderBySortOrderAsc();
    return gameMapper.toGameDtoList(gameEntities);
  }

  /**
   * Build games response from page.
   *
   * @param gamePage Page of game entities
   * @return Games response
   */
  private GameListResponse buildGamesResponse(Page<GameEntity> gamePage) {
    List<Game> gameDtos = gameMapper.toGameDtoList(gamePage.getContent());

    return new GameListResponse(
        gameDtos,
        gamePage.getTotalElements(),
        gamePage.getTotalPages(),
        gamePage.getSize(),
        gamePage.getNumber(),
        gamePage.getNumberOfElements(),
        gamePage.isFirst(),
        gamePage.isLast(),
        gamePage.isEmpty());
  }
}
