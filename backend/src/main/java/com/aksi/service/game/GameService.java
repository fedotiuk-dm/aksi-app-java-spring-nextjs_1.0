package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.GameListResponse;
import com.aksi.api.game.dto.UpdateGameRequest;

/**
 * Service interface for Game domain operations.
 * Handles CRUD operations for Game DTOs.
 */
public interface GameService {

    // Command operations (write)
    Game createGame(CreateGameRequest request);
    Game updateGame(UUID gameId, UpdateGameRequest request);
    void deleteGame(UUID gameId);
    Game setActive(UUID gameId, boolean active);

    // Query operations (read)
    Game getGameById(UUID gameId);
    Game getGameByCode(String gameCode);
    GameListResponse listGames(int page, int size, String sortBy, String sortOrder, Boolean active, String search);
    List<Game> getAllActiveGames();
}
