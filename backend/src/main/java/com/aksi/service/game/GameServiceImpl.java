package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.GameListResponse;
import com.aksi.api.game.dto.UpdateGameRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of GameService providing all game-related operations. Delegates to command and
 * query services for specific operations.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class GameServiceImpl implements GameService {

  private final GameCommandService commandService;
  private final GameQueryService queryService;

  // Command operations (write)

  @Override
  public Game createGame(CreateGameRequest request) {
    return commandService.createGame(request);
  }

  @Override
  public Game updateGame(UUID gameId, UpdateGameRequest request) {
    return commandService.updateGame(gameId, request);
  }

  @Override
  public void deleteGame(UUID gameId) {
    commandService.deleteGame(gameId);
  }

  @Override
  public Game setActive(UUID gameId, boolean active) {
    return active ? commandService.activateGame(gameId) : commandService.deactivateGame(gameId);
  }

  // Query operations (read)

  @Override
  @Transactional(readOnly = true)
  public Game getGameById(UUID gameId) {
    return queryService.getGameById(gameId);
  }

  @Override
  @Transactional(readOnly = true)
  public Game getGameByCode(String code) {
    return queryService.getGameByCode(code);
  }

  @Override
  @Transactional(readOnly = true)
  public GameListResponse listGames(
      Integer page, Integer size, String sortBy, String sortOrder, Boolean active, String search) {
    return queryService.listGames(page, size, sortBy, sortOrder, active, search);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Game> getAllActiveGames() {
    return queryService.getAllActiveGames();
  }
}
