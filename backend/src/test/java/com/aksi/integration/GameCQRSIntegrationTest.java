package com.aksi.integration;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateGameModifierRequest;
import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.exception.NotFoundException;
import com.aksi.service.game.GameCommandService;
import com.aksi.service.game.GameModifierCommandService;
import com.aksi.service.game.GameModifierQueryService;
import com.aksi.service.game.GameQueryService;
import com.aksi.service.game.ServiceTypeCommandService;
import com.aksi.service.game.ServiceTypeQueryService;

/**
 * CQRS ІНТЕГРАЦІЙНІ ТЕСТИ ДЛЯ GAME ДОМЕНУ
 *
 * Тестує окремо Command та Query сервіси згідно з CQRS архітектурою:
 * - Command Services: створення, оновлення, видалення
 * - Query Services: читання даних
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class GameCQRSIntegrationTest {

    @Autowired
    private GameCommandService gameCommandService;

    @Autowired
    private GameQueryService gameQueryService;

    @Autowired
    private ServiceTypeCommandService serviceTypeCommandService;

    @Autowired
    private ServiceTypeQueryService serviceTypeQueryService;

    @Autowired
    private GameModifierCommandService gameModifierCommandService;

    @Autowired
    private GameModifierQueryService gameModifierQueryService;

    @Test
    @DisplayName("CQRS COMMAND: Створити гру через Command Service")
    void shouldCreateGameViaCommandService() {
        // Given
        var gameData = new CreateGameRequest();
        gameData.setCode("CQRS_GAME");
        gameData.setName("CQRS Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);

        // When
        var createdGame = gameCommandService.createGame(gameData);

        // Then
        assertNotNull(createdGame.getId());
        assertEquals("CQRS_GAME", createdGame.getCode());

        // Query Service повинен знайти створену гру
        var foundGame = gameQueryService.getGameById(createdGame.getId());
        assertNotNull(foundGame);
        assertEquals("CQRS_GAME", foundGame.getCode());
    }

    @Test
    @DisplayName("CQRS QUERY: Отримати гру через Query Service")
    void shouldGetGameViaQueryService() {
        // Given - Створити гру через Command Service
        var gameData = new CreateGameRequest();
        gameData.setCode("CQRS_QUERY_GAME");
        gameData.setName("CQRS Query Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var createdGame = gameCommandService.createGame(gameData);

        // When - Отримати через Query Service
        var foundGame = gameQueryService.getGameById(createdGame.getId());

        // Then
        assertNotNull(foundGame);
        assertEquals("CQRS_QUERY_GAME", foundGame.getCode());
    }

    @Test
    @DisplayName("CQRS COMMAND + QUERY: Повний цикл ServiceType")
    void shouldHandleServiceTypeFullCQRS() {
        // Given - Створити гру
        var gameData = new CreateGameRequest();
        gameData.setCode("CQRS_ST_GAME");
        gameData.setName("CQRS ServiceType Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameCommandService.createGame(gameData);

        // When - Створити ServiceType через Command Service
        var serviceTypeData = new CreateServiceTypeRequest();
        serviceTypeData.setCode("CQRS_SERVICE");
        serviceTypeData.setName("CQRS Test Service");
        serviceTypeData.setGameId(game.getId());
        var createdServiceType = serviceTypeCommandService.createServiceType(serviceTypeData);

        // Then - Query Service повинен знайти створений ServiceType
        var foundServiceType = serviceTypeQueryService.getServiceTypeById(createdServiceType.getId());
        assertNotNull(foundServiceType);
        assertEquals("CQRS_SERVICE", foundServiceType.getCode());
    }

    @Test
    @DisplayName("CQRS COMMAND + QUERY: Повний цикл GameModifier")
    void shouldHandleGameModifierFullCQRS() {
        // Given - Створити гру
        var gameData = new CreateGameRequest();
        gameData.setCode("CQRS_MOD_GAME");
        gameData.setName("CQRS Modifier Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var game = gameCommandService.createGame(gameData);

        // When - Створити Modifier через Command Service
        var modifierData = new CreateGameModifierRequest();
        modifierData.setCode("CQRS_MODIFIER");
        modifierData.setName("CQRS Test Modifier");
        modifierData.setType(GameModifierType.RANK);
        modifierData.setOperation(GameModifierOperation.ADD);
        modifierData.setValue(500);
        modifierData.setGameCode(game.getCode());
        var createdModifier = gameModifierCommandService.createGameModifier(modifierData);

        // Then - Query Service повинен знайти створений Modifier
        var foundModifier = gameModifierQueryService.getGameModifierById(createdModifier.getId());
        assertNotNull(foundModifier);
        assertEquals("CQRS_MODIFIER", foundModifier.getCode());
    }

    @Test
    @DisplayName("CQRS QUERY: NotFoundException для неіснуючої гри")
    void shouldThrowNotFoundForNonExistentGame() {
        // When & Then
        assertThrows(NotFoundException.class, () -> {
            gameQueryService.getGameById(UUID.randomUUID());
        });
    }

    @Test
    @DisplayName("CQRS INTEGRATION: Command створює, Query читає")
    void shouldDemonstrateCommandQuerySeparation() {
        // Given - Command Service створює гру
        var gameData = new CreateGameRequest();
        gameData.setCode("INTEGRATION_GAME");
        gameData.setName("Integration Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var commandResult = gameCommandService.createGame(gameData);

        // When - Query Service читає цю ж гру
        var queryResult = gameQueryService.getGameById(commandResult.getId());

        // Then - Результати повинні співпадати
        assertEquals(commandResult.getId(), queryResult.getId());
        assertEquals(commandResult.getCode(), queryResult.getCode());
        assertEquals(commandResult.getName(), queryResult.getName());
    }
}
