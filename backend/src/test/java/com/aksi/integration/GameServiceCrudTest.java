package com.aksi.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.UpdateGameRequest;
import com.aksi.exception.NotFoundException;
import com.aksi.service.game.GameService;

/**
 * ІНТЕГРАЦІЙНІ ТЕСТИ ДЛЯ GameService
 *
 * Тестує CRUD операції через сервісний шар
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class GameServiceCrudTest {

    @Autowired
    private GameService gameService;

    @Test
    @DisplayName("SERVICE CREATE: Створити гру через сервіс")
    void shouldCreateGameViaService() {
        // Given
        var gameData = new CreateGameRequest();
        gameData.setCode("SERVICE_GAME");
        gameData.setName("Service Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);

        // When
        var createdGame = gameService.createGame(gameData);

        // Then
        assertNotNull(createdGame.getId());
        assertEquals("SERVICE_GAME", createdGame.getCode());
        assertEquals("Service Test Game", createdGame.getName());
        assertEquals(Game.CategoryEnum.BATTLE_ROYALE, createdGame.getCategory());
    }

    @Test
    @DisplayName("SERVICE READ: Отримати гру через сервіс")
    void shouldGetGameViaService() {
        // Given
        var gameData = new CreateGameRequest();
        gameData.setCode("GET_GAME");
        gameData.setName("Get Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var createdGame = gameService.createGame(gameData);

        // When
        var foundGame = gameService.getGameById(createdGame.getId());

        // Then
        assertNotNull(foundGame);
        assertEquals("GET_GAME", foundGame.getCode());
        assertEquals("Get Test Game", foundGame.getName());
    }

    @Test
    @DisplayName("SERVICE UPDATE: Оновити гру через сервіс")
    void shouldUpdateGameViaService() {
        // Given
        var gameData = new CreateGameRequest();
        gameData.setCode("UPDATE_GAME");
        gameData.setName("Update Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var createdGame = gameService.createGame(gameData);

        // When
        var updateData = new com.aksi.api.game.dto.UpdateGameRequest();
        updateData.setName("Updated Game Name");
        updateData.setCategory(UpdateGameRequest.CategoryEnum.MMORPG);
        var updatedGame = gameService.updateGame(createdGame.getId(), updateData);

        // Then
        assertEquals("Updated Game Name", updatedGame.getName());
        assertEquals(Game.CategoryEnum.MMORPG, updatedGame.getCategory());
    }

    @Test
    @DisplayName("SERVICE DELETE: Видалити гру через сервіс")
    void shouldDeleteGameViaService() {
        // Given
        var gameData = new CreateGameRequest();
        gameData.setCode("DELETE_GAME");
        gameData.setName("Delete Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var createdGame = gameService.createGame(gameData);

        // When
        gameService.deleteGame(createdGame.getId());

        // Then - Verify game is deleted by expecting NotFoundException
        assertThrows(NotFoundException.class, () -> {
            gameService.getGameById(createdGame.getId());
        });
    }

    @Test
    @DisplayName("SERVICE LIST: Отримати список ігор через сервіс")
    void shouldListGamesViaService() {
        // Given
        var game1 = new CreateGameRequest();
        game1.setCode("LIST_GAME_1");
        game1.setName("List Game 1");
        game1.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        gameService.createGame(game1);

        var game2 = new CreateGameRequest();
        game2.setCode("LIST_GAME_2");
        game2.setName("List Game 2");
        game2.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        gameService.createGame(game2);

        // When
        var games = gameService.listGames(0, 10, null, null, null, null);

        // Then
        assertFalse(games.getData().isEmpty());
        assertTrue(games.getData().size() >= 2);
    }
}
