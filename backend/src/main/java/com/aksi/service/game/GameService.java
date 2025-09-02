package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.GameListResponse;
import com.aksi.api.game.dto.UpdateGameRequest;

/**
 * Game service interface providing all game-related operations. Combines command and query
 * operations for game management.
 */
public interface GameService {

  // Command operations (write)

  /**
   * Create new game.
   *
   * @param request Create game request
   * @return Created game information
   */
  Game createGame(CreateGameRequest request);

  /**
   * Update existing game.
   *
   * @param gameId Game ID
   * @param request Update game request
   * @return Updated game information
   */
  Game updateGame(UUID gameId, UpdateGameRequest request);

  /**
   * Delete game.
   *
   * @param gameId Game ID
   */
  void deleteGame(UUID gameId);

  /**
   * Set game active status.
   *
   * @param gameId Game ID
   * @param active Active status
   * @return Updated game information
   */
  Game setActive(UUID gameId, boolean active);

  // Query operations (read)

  /**
   * Get game by ID.
   *
   * @param gameId Game ID
   * @return Game information
   */
  Game getGameById(UUID gameId);

  /**
   * Get game by code.
   *
   * @param code Game code
   * @return Game information
   */
  Game getGameByCode(String code);

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
  GameListResponse listGames(
      Integer page, Integer size, String sortBy, String sortOrder, Boolean active, String search);

  /**
   * Get all active games.
   *
   * @return List of active games
   */
  List<Game> getAllActiveGames();
}
