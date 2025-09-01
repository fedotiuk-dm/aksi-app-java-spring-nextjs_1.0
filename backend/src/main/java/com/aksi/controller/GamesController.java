package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.game.GamesApi;
import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.GameListResponse;
import com.aksi.api.game.dto.UpdateGameRequest;
import com.aksi.service.game.GameService;

import lombok.RequiredArgsConstructor;

/** REST controller for game operations */
@RestController
@RequiredArgsConstructor
public class GamesController implements GamesApi {

  private final GameService gameService;

  @Override
  public ResponseEntity<Game> createGame(CreateGameRequest createGameRequest) {
    Game result = gameService.createGame(createGameRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(result);
  }

  @Override
  public ResponseEntity<Void> deleteGame(UUID gameId) {
    gameService.deleteGame(gameId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Game> getGameById(UUID gameId) {
    Game result = gameService.getGameById(gameId);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<GameListResponse> listGames(
      Integer page, Integer size, @Nullable String search, @Nullable Boolean active) {

    GameListResponse result = gameService.listGames(page, size, null, "asc", active, search);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<Game> updateGame(UUID gameId, UpdateGameRequest updateGameRequest) {
    Game result = gameService.updateGame(gameId, updateGameRequest);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<Game> activateGame(UUID gameId) {
    Game result = gameService.setActive(gameId, true);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<Game> deactivateGame(UUID gameId) {
    Game result = gameService.setActive(gameId, false);
    return ResponseEntity.ok(result);
  }
}
