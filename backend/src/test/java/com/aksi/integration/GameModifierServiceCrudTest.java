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

import com.aksi.api.game.dto.CreateGameModifierRequest;
import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.api.game.dto.SortOrder;
import com.aksi.api.game.dto.UpdateGameModifierRequest;
import com.aksi.exception.NotFoundException;
import com.aksi.service.game.GameModifierService;
import com.aksi.service.game.GameService;

/**
 * ІНТЕГРАЦІЙНІ ТЕСТИ ДЛЯ GameModifierService
 *
 * Тестує CRUD операції через сервісний шар
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class GameModifierServiceCrudTest {

    @Autowired
    private GameModifierService gameModifierService;

    @Autowired
    private GameService gameService;


    @Test
    @DisplayName("SERVICE CREATE: Створити модифікатор гри через сервіс")
    void shouldCreateGameModifierViaService() {
        // Given - Create game first
        var gameData = new CreateGameRequest();
        gameData.setCode("GM_GAME");
        gameData.setName("GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameService.createGame(gameData);

        var modifierData = new CreateGameModifierRequest();
        modifierData.setCode("GM_MODIFIER");
        modifierData.setName("GameModifier Test Modifier");
        modifierData.setType(GameModifierType.RANK);
        modifierData.setOperation(GameModifierOperation.ADD);
        modifierData.setValue(1000);
        modifierData.setGameCode(game.getCode());

        // When
        var createdModifier = gameModifierService.createGameModifier(modifierData);

        // Then
        assertNotNull(createdModifier.getId());
        assertEquals("GM_MODIFIER", createdModifier.getCode());
        assertEquals("GameModifier Test Modifier", createdModifier.getName());
        assertEquals(GameModifierType.RANK, createdModifier.getType());
        assertEquals(GameModifierOperation.ADD, createdModifier.getOperation());
        assertEquals(1000, createdModifier.getValue());
    }

    @Test
    @DisplayName("SERVICE READ: Отримати модифікатор гри через сервіс")
    void shouldGetGameModifierViaService() {
        // Given - Create game first
        var gameData = new CreateGameRequest();
        gameData.setCode("GET_GM_GAME");
        gameData.setName("Get GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var game = gameService.createGame(gameData);

        var modifierData = new CreateGameModifierRequest();
        modifierData.setCode("GET_GM_MODIFIER");
        modifierData.setName("Get GameModifier Test Modifier");
        modifierData.setType(GameModifierType.RANK);
        modifierData.setOperation(GameModifierOperation.MULTIPLY);
        modifierData.setValue(150);
        modifierData.setGameCode(game.getCode());
        var createdModifier = gameModifierService.createGameModifier(modifierData);

        // When
        var foundModifier = gameModifierService.getGameModifierById(createdModifier.getId());

        // Then
        assertNotNull(foundModifier);
        assertEquals("GET_GM_MODIFIER", foundModifier.getCode());
        assertEquals("Get GameModifier Test Modifier", foundModifier.getName());
        assertEquals(GameModifierType.RANK, foundModifier.getType());
        assertEquals(GameModifierOperation.MULTIPLY, foundModifier.getOperation());
    }

    @Test
    @DisplayName("SERVICE UPDATE: Оновити модифікатор гри через сервіс")
    void shouldUpdateGameModifierViaService() {
        // Given - Create game first
        var gameData = new CreateGameRequest();
        gameData.setCode("UPDATE_GM_GAME");
        gameData.setName("Update GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameService.createGame(gameData);

        var modifierData = new CreateGameModifierRequest();
        modifierData.setCode("UPDATE_GM_MODIFIER");
        modifierData.setName("Update GameModifier Test Modifier");
        modifierData.setType(GameModifierType.RANK);
        modifierData.setOperation(GameModifierOperation.ADD);
        modifierData.setValue(500);
        modifierData.setGameCode(game.getCode());
        var createdModifier = gameModifierService.createGameModifier(modifierData);

        // When
        var updateData = new UpdateGameModifierRequest();
        updateData.setName("Updated Modifier Name");
        updateData.setValue(750);
        updateData.setOperation(GameModifierOperation.SUBTRACT);
        var updatedModifier = gameModifierService.updateGameModifier(createdModifier.getId(), updateData);

        // Then
        assertEquals("Updated Modifier Name", updatedModifier.getName());
        assertEquals(750, updatedModifier.getValue());
        assertEquals(GameModifierOperation.SUBTRACT, updatedModifier.getOperation());
        assertEquals("UPDATE_GM_MODIFIER", updatedModifier.getCode());
    }


    @Test
    @DisplayName("SERVICE LIST: Отримати список модифікаторів через сервіс")
    void shouldListGameModifiersViaService() {
        // Given - Create game first
        var gameData = new CreateGameRequest();
        gameData.setCode("LIST_GM_GAME");
        gameData.setName("List GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var game = gameService.createGame(gameData);

        var modifier1 = new CreateGameModifierRequest();
        modifier1.setCode("LIST_GM_1");
        modifier1.setName("List GameModifier 1");
        modifier1.setType(GameModifierType.RANK);
        modifier1.setOperation(GameModifierOperation.ADD);
        modifier1.setValue(100);
        modifier1.setGameCode(game.getCode());
        gameModifierService.createGameModifier(modifier1);

        var modifier2 = new CreateGameModifierRequest();
        modifier2.setCode("LIST_GM_2");
        modifier2.setName("List GameModifier 2");
        modifier2.setType(GameModifierType.RANK);
        modifier2.setOperation(GameModifierOperation.MULTIPLY);
        modifier2.setValue(120);
        modifier2.setGameCode(game.getCode());
        gameModifierService.createGameModifier(modifier2);

        // When - Test with default sorting
        var modifiers = gameModifierService.getAllGameModifiers(game.getCode(), null, null, null, null, 0, 10, null, null, null);

        // Then
        assertFalse(modifiers.getModifiers().isEmpty());
        assertTrue(modifiers.getModifiers().size() >= 2);
    }

    @Test
    @DisplayName("SERVICE SEARCH: Пошук модифікаторів за кодом гри")
    void shouldSearchGameModifiersByGameCode() {
        // Given - Create game first
        var gameData = new CreateGameRequest();
        gameData.setCode("SEARCH_GM_GAME");
        gameData.setName("Search GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var game = gameService.createGame(gameData);

        var modifierData = new CreateGameModifierRequest();
        modifierData.setCode("SEARCH_GM_MODIFIER");
        modifierData.setName("Search GameModifier Test");
        modifierData.setType(GameModifierType.RANK);
        modifierData.setOperation(GameModifierOperation.ADD);
        modifierData.setValue(300);
        modifierData.setGameCode(game.getCode());
        gameModifierService.createGameModifier(modifierData);

        // When
        var foundModifiers = gameModifierService.getAllGameModifiers(game.getCode(), null, null, null, null, 0, 10, null, null, null);

        // Then
        assertFalse(foundModifiers.getModifiers().isEmpty());
        assertTrue(foundModifiers.getModifiers().stream().anyMatch(m -> "SEARCH_GM_MODIFIER".equals(m.getCode())));
    }

    @Test
    @DisplayName("SERVICE DELETE: Видалити модифікатор гри через сервіс")
    void shouldDeleteGameModifierViaService() {
        // Given - Create game and modifier
        var gameData = new CreateGameRequest();
        gameData.setCode("DELETE_GM_GAME");
        gameData.setName("Delete GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameService.createGame(gameData);

        var modifierData = new CreateGameModifierRequest();
        modifierData.setCode("DELETE_GM_MODIFIER");
        modifierData.setName("Delete GameModifier Test");
        modifierData.setType(GameModifierType.RANK);
        modifierData.setOperation(GameModifierOperation.ADD);
        modifierData.setValue(200);
        modifierData.setGameCode(game.getCode());
        var createdModifier = gameModifierService.createGameModifier(modifierData);

        // When
        gameModifierService.deleteGameModifier(createdModifier.getId());

        // Then - Verify modifier is deleted
        var thrown = assertThrows(NotFoundException.class, () ->
            gameModifierService.getGameModifierById(createdModifier.getId()));
        assertNotNull(thrown);
    }

    @Test
    @DisplayName("SERVICE ACTIVATE: Активувати модифікатор гри через сервіс")
    void shouldActivateGameModifierViaService() {
        // Given - Create game and modifier
        var gameData = new CreateGameRequest();
        gameData.setCode("ACTIVATE_GM_GAME");
        gameData.setName("Activate GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var game = gameService.createGame(gameData);

        var modifierData = new CreateGameModifierRequest();
        modifierData.setCode("ACTIVATE_GM_MODIFIER");
        modifierData.setName("Activate GameModifier Test");
        modifierData.setType(GameModifierType.RANK);
        modifierData.setOperation(GameModifierOperation.ADD);
        modifierData.setValue(400);
        modifierData.setGameCode(game.getCode());
        var createdModifier = gameModifierService.createGameModifier(modifierData);

        // Deactivate first
        var deactivatedModifier = gameModifierService.deactivateGameModifier(createdModifier.getId());
        assertFalse(deactivatedModifier.getActive(), "Modifier should be deactivated");

        // When - Activate the modifier
        var activatedModifier = gameModifierService.activateGameModifier(createdModifier.getId());

        // Then
        assertTrue(activatedModifier.getActive(), "Modifier should be activated");
        assertEquals("ACTIVATE_GM_MODIFIER", activatedModifier.getCode());
    }

    @Test
    @DisplayName("SERVICE DEACTIVATE: Деактивувати модифікатор гри через сервіс")
    void shouldDeactivateGameModifierViaService() {
        // Given - Create game and modifier
        var gameData = new CreateGameRequest();
        gameData.setCode("DEACTIVATE_GM_GAME");
        gameData.setName("Deactivate GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameService.createGame(gameData);

        var modifierData = new CreateGameModifierRequest();
        modifierData.setCode("DEACTIVATE_GM_MODIFIER");
        modifierData.setName("Deactivate GameModifier Test");
        modifierData.setType(GameModifierType.RANK);
        modifierData.setOperation(GameModifierOperation.MULTIPLY);
        modifierData.setValue(125);
        modifierData.setGameCode(game.getCode());
        var createdModifier = gameModifierService.createGameModifier(modifierData);
        assertTrue(createdModifier.getActive(), "Modifier should be active by default");

        // When - Deactivate the modifier
        var deactivatedModifier = gameModifierService.deactivateGameModifier(createdModifier.getId());

        // Then
        assertFalse(deactivatedModifier.getActive(), "Modifier should be deactivated");
        assertEquals("DEACTIVATE_GM_MODIFIER", deactivatedModifier.getCode());
    }

    @Test
    @DisplayName("SERVICE SORTING: Динамічне сортування модифікаторів через сервіс")
    void shouldSortGameModifiersDynamicallyViaService() {
        // Given - Create game first
        var gameData = new CreateGameRequest();
        gameData.setCode("SORT_GM_GAME");
        gameData.setName("Sort GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var game = gameService.createGame(gameData);

        // Create modifiers with different names for sorting
        var modifierA = new CreateGameModifierRequest();
        modifierA.setCode("SORT_A");
        modifierA.setName("Z Modifier");
        modifierA.setType(GameModifierType.RANK);
        modifierA.setOperation(GameModifierOperation.ADD);
        modifierA.setValue(100);
        modifierA.setGameCode(game.getCode());
        gameModifierService.createGameModifier(modifierA);

        var modifierB = new CreateGameModifierRequest();
        modifierB.setCode("SORT_B");
        modifierB.setName("A Modifier");
        modifierB.setType(GameModifierType.RANK);
        modifierB.setOperation(GameModifierOperation.ADD);
        modifierB.setValue(200);
        modifierB.setGameCode(game.getCode());
        gameModifierService.createGameModifier(modifierB);

        // When - Sort by name ascending
        var sortedModifiers = gameModifierService.getAllGameModifiers(
            game.getCode(), null, null, null, null, 0, 10, "name", SortOrder.ASC, null);

        // Then
        assertFalse(sortedModifiers.getModifiers().isEmpty());
        assertTrue(sortedModifiers.getModifiers().size() >= 2);
        // First modifier should be "A Modifier" when sorted ascending by name
        assertEquals("SORT_B", sortedModifiers.getModifiers().get(0).getCode());

        // When - Sort by name descending
        var sortedModifiersDesc = gameModifierService.getAllGameModifiers(
            game.getCode(), null, null, null, null, 0, 10, "name", SortOrder.DESC, null);

        // Then
        assertFalse(sortedModifiersDesc.getModifiers().isEmpty());
        // First modifier should be "Z Modifier" when sorted descending by name
        assertEquals("SORT_A", sortedModifiersDesc.getModifiers().get(0).getCode());
    }

    @Test
    @DisplayName("SERVICE OPERATION FILTER: Фільтрація модифікаторів за типом операції")
    void shouldFilterGameModifiersByOperationViaService() {
        // Given - Create game first
        var gameData = new CreateGameRequest();
        gameData.setCode("FILTER_OP_GAME");
        gameData.setName("Filter Operation GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameService.createGame(gameData);

        // Create modifiers with different operations
        var addModifier = new CreateGameModifierRequest();
        addModifier.setCode("FILTER_ADD");
        addModifier.setName("Add Modifier");
        addModifier.setType(GameModifierType.RANK);
        addModifier.setOperation(GameModifierOperation.ADD);
        addModifier.setValue(100);
        addModifier.setGameCode(game.getCode());
        gameModifierService.createGameModifier(addModifier);

        var multiplyModifier = new CreateGameModifierRequest();
        multiplyModifier.setCode("FILTER_MULTIPLY");
        multiplyModifier.setName("Multiply Modifier");
        multiplyModifier.setType(GameModifierType.RANK);
        multiplyModifier.setOperation(GameModifierOperation.MULTIPLY);
        multiplyModifier.setValue(150);
        multiplyModifier.setGameCode(game.getCode());
        gameModifierService.createGameModifier(multiplyModifier);

        var subtractModifier = new CreateGameModifierRequest();
        subtractModifier.setCode("FILTER_SUBTRACT");
        subtractModifier.setName("Subtract Modifier");
        subtractModifier.setType(GameModifierType.RANK);
        subtractModifier.setOperation(GameModifierOperation.SUBTRACT);
        subtractModifier.setValue(50);
        subtractModifier.setGameCode(game.getCode());
        gameModifierService.createGameModifier(subtractModifier);

        // When - Filter by ADD operation
        var addModifiers = gameModifierService.getAllGameModifiers(
            game.getCode(), null, null, null, null, 0, 10, null, null, GameModifierOperation.ADD);

        // Then
        assertFalse(addModifiers.getModifiers().isEmpty());
        assertEquals(1, addModifiers.getModifiers().size());
        assertEquals("FILTER_ADD", addModifiers.getModifiers().get(0).getCode());
        assertEquals(GameModifierOperation.ADD, addModifiers.getModifiers().get(0).getOperation());

        // When - Filter by MULTIPLY operation
        var multiplyModifiers = gameModifierService.getAllGameModifiers(
            game.getCode(), null, null, null, null, 0, 10, null, null, GameModifierOperation.MULTIPLY);

        // Then
        assertFalse(multiplyModifiers.getModifiers().isEmpty());
        assertEquals(1, multiplyModifiers.getModifiers().size());
        assertEquals("FILTER_MULTIPLY", multiplyModifiers.getModifiers().get(0).getCode());
        assertEquals(GameModifierOperation.MULTIPLY, multiplyModifiers.getModifiers().get(0).getOperation());

        // When - Filter by SUBTRACT operation
        var subtractModifiers = gameModifierService.getAllGameModifiers(
            game.getCode(), null, null, null, null, 0, 10, null, null, GameModifierOperation.SUBTRACT);

        // Then
        assertFalse(subtractModifiers.getModifiers().isEmpty());
        assertEquals(1, subtractModifiers.getModifiers().size());
        assertEquals("FILTER_SUBTRACT", subtractModifiers.getModifiers().get(0).getCode());
        assertEquals(GameModifierOperation.SUBTRACT, subtractModifiers.getModifiers().get(0).getOperation());
    }

    @Test
    @DisplayName("SERVICE COMBINED FILTERS: Комбінація фільтрів з сортуванням")
    void shouldApplyCombinedFiltersWithSortingViaService() {
        // Given - Create game first
        var gameData = new CreateGameRequest();
        gameData.setCode("COMBINED_GAME");
        gameData.setName("Combined Filters GameModifier Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var game = gameService.createGame(gameData);

        // Create modifiers with different combinations
        var modifier1 = new CreateGameModifierRequest();
        modifier1.setCode("COMB_1");
        modifier1.setName("Z Combined Modifier");
        modifier1.setType(GameModifierType.TIMING);
        modifier1.setOperation(GameModifierOperation.ADD);
        modifier1.setValue(100);
        modifier1.setGameCode(game.getCode());
        gameModifierService.createGameModifier(modifier1);

        var modifier2 = new CreateGameModifierRequest();
        modifier2.setCode("COMB_2");
        modifier2.setName("A Combined Modifier");
        modifier2.setType(GameModifierType.TIMING);
        modifier2.setOperation(GameModifierOperation.MULTIPLY);
        modifier2.setValue(200);
        modifier2.setGameCode(game.getCode());
        gameModifierService.createGameModifier(modifier2);

        var modifier3 = new CreateGameModifierRequest();
        modifier3.setCode("COMB_3");
        modifier3.setName("B Combined Modifier");
        modifier3.setType(GameModifierType.RANK);
        modifier3.setOperation(GameModifierOperation.ADD);
        modifier3.setValue(150);
        modifier3.setGameCode(game.getCode());
        gameModifierService.createGameModifier(modifier3);

        // When - Filter by TIMING type, ADD operation, sorted by name ASC
        var filteredModifiers = gameModifierService.getAllGameModifiers(
            game.getCode(), GameModifierType.TIMING, null, null, null, 0, 10,
            "name", SortOrder.ASC, GameModifierOperation.ADD);

        // Then
        assertFalse(filteredModifiers.getModifiers().isEmpty());
        assertEquals(1, filteredModifiers.getModifiers().size());
        assertEquals("COMB_1", filteredModifiers.getModifiers().get(0).getCode());
        assertEquals(GameModifierType.TIMING, filteredModifiers.getModifiers().get(0).getType());
        assertEquals(GameModifierOperation.ADD, filteredModifiers.getModifiers().get(0).getOperation());
    }
}
