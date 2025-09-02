package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.GameListResponse;
import com.aksi.api.game.dto.UpdateGameRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of GameService that delegates to command and query services.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameServiceImpl implements GameService {

    private final GameCommandService gameCommandService;
    private final GameQueryService gameQueryService;

    @Override
    public Game createGame(CreateGameRequest request) {
        return gameCommandService.createGame(request);
    }

    @Override
    public Game getGameById(UUID gameId) {
        return gameQueryService.getGameById(gameId);
    }

    @Override
    public Game getGameByCode(String gameCode) {
        return gameQueryService.getGameByCode(gameCode);
    }

    @Override
    public Game updateGame(UUID gameId, UpdateGameRequest request) {
        return gameCommandService.updateGame(gameId, request);
    }

    @Override
    public void deleteGame(UUID gameId) {
        gameCommandService.deleteGame(gameId);
    }

    @Override
    public GameListResponse listGames(int page, int size, String sortBy, String sortOrder, Boolean active, String search) {
        return gameQueryService.listGames(page, size, sortBy, sortOrder, active, search);
    }

    @Override
    public List<Game> getAllActiveGames() {
        return gameQueryService.getAllActiveGames();
    }

    @Override
    public Game setActive(UUID gameId, boolean active) {
        return gameCommandService.setActive(gameId, active);
    }
}
