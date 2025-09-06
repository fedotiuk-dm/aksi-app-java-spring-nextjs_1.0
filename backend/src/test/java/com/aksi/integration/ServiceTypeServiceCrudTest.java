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
import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.UpdateServiceTypeRequest;
import com.aksi.exception.NotFoundException;
import com.aksi.service.game.GameService;
import com.aksi.service.game.ServiceTypeService;

/**
 * ІНТЕГРАЦІЙНІ ТЕСТИ ДЛЯ ServiceTypeService
 *
 * Тестує CRUD операції через сервісний шар
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ServiceTypeServiceCrudTest {

    @Autowired
    private ServiceTypeService serviceTypeService;

    @Autowired
    private GameService gameService;

    @Test
    @DisplayName("SERVICE CREATE: Створити тип послуги через сервіс")
    void shouldCreateServiceTypeViaService() {
        // Given - Create game first
        var gameData = new CreateGameRequest();
        gameData.setCode("ST_GAME");
        gameData.setName("ServiceType Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameService.createGame(gameData);

        var serviceTypeData = new CreateServiceTypeRequest();
        serviceTypeData.setCode("ST_SERVICE");
        serviceTypeData.setName("ServiceType Test Service");
        serviceTypeData.setGameId(game.getId());

        // When
        var createdServiceType = serviceTypeService.createServiceType(serviceTypeData);

        // Then
        assertNotNull(createdServiceType.getId());
        assertEquals("ST_SERVICE", createdServiceType.getCode());
        assertEquals("ServiceType Test Service", createdServiceType.getName());
        assertEquals(game.getId(), createdServiceType.getGameId());
    }

    @Test
    @DisplayName("SERVICE READ: Отримати тип послуги через сервіс")
    void shouldGetServiceTypeViaService() {
        // Given - Create game and service type
        var gameData = new CreateGameRequest();
        gameData.setCode("GET_ST_GAME");
        gameData.setName("Get ServiceType Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var game = gameService.createGame(gameData);

        var serviceTypeData = new CreateServiceTypeRequest();
        serviceTypeData.setCode("GET_ST_SERVICE");
        serviceTypeData.setName("Get ServiceType Test Service");
        serviceTypeData.setGameId(game.getId());
        var createdServiceType = serviceTypeService.createServiceType(serviceTypeData);
        assertNotNull(createdServiceType.getId(), "ServiceType ID should not be null after creation");

        // When
        var foundServiceType = serviceTypeService.getServiceTypeById(createdServiceType.getId());

        // Then
        assertNotNull(foundServiceType);
        assertEquals("GET_ST_SERVICE", foundServiceType.getCode());
        assertEquals("Get ServiceType Test Service", foundServiceType.getName());
    }

    @Test
    @DisplayName("SERVICE UPDATE: Оновити тип послуги через сервіс")
    void shouldUpdateServiceTypeViaService() {
        // Given - Create game and service type
        var gameData = new CreateGameRequest();
        gameData.setCode("UPDATE_ST_GAME");
        gameData.setName("Update ServiceType Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameService.createGame(gameData);

        var serviceTypeData = new CreateServiceTypeRequest();
        serviceTypeData.setCode("UPDATE_ST_SERVICE");
        serviceTypeData.setName("Update ServiceType Test Service");
        serviceTypeData.setGameId(game.getId());
        var createdServiceType = serviceTypeService.createServiceType(serviceTypeData);
        assertNotNull(createdServiceType.getId(), "ServiceType ID should not be null after creation");

        // When
        var updateData = new UpdateServiceTypeRequest();
        updateData.setName("Updated ServiceType Name");
        updateData.setGameId(game.getId()); // Required for validation
        var updatedServiceType = serviceTypeService.updateServiceType(createdServiceType.getId(), updateData);

        // Then
        assertEquals("Updated ServiceType Name", updatedServiceType.getName());
        assertEquals("UPDATE_ST_SERVICE", updatedServiceType.getCode());
    }

    @Test
    @DisplayName("SERVICE DELETE: Видалити тип послуги через сервіс")
    void shouldDeleteServiceTypeViaService() {
        // Given - Create game and service type
        var gameData = new CreateGameRequest();
        gameData.setCode("DELETE_ST_GAME");
        gameData.setName("Delete ServiceType Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var game = gameService.createGame(gameData);

        var serviceTypeData = new CreateServiceTypeRequest();
        serviceTypeData.setCode("DELETE_ST_SERVICE");
        serviceTypeData.setName("Delete ServiceType Test Service");
        serviceTypeData.setGameId(game.getId());
        var createdServiceType = serviceTypeService.createServiceType(serviceTypeData);
        assertNotNull(createdServiceType.getId(), "ServiceType ID should not be null after creation");

        // Verify ServiceType exists before deletion
        var existingServiceType = serviceTypeService.getServiceTypeById(createdServiceType.getId());
        assertNotNull(existingServiceType, "ServiceType should exist before deletion");

        // When
        serviceTypeService.deleteServiceType(createdServiceType.getId());

        // Force flush to ensure deletion is committed
        // Note: In @Transactional test, this might not be necessary, but let's try

        // Then - Verify ServiceType is "deleted" (marked as inactive)
        var deletedServiceType = serviceTypeService.getServiceTypeById(createdServiceType.getId());
        assertNotNull(deletedServiceType, "ServiceType should still exist but be inactive");
        assertFalse(deletedServiceType.getActive(), "ServiceType should be marked as inactive");
        assertEquals("DELETE_ST_SERVICE", deletedServiceType.getCode(), "ServiceType code should remain unchanged");
    }

    @Test
    @DisplayName("SERVICE FORCE DELETE: Повністю видалити тип послуги через сервіс")
    void shouldForceDeleteServiceTypeViaService() {
        // Given - Create service type
        var gameData = new CreateGameRequest();
        gameData.setCode("FORCE_DELETE_ST_GAME");
        gameData.setName("Force Delete ServiceType Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameService.createGame(gameData);

        var serviceTypeData = new CreateServiceTypeRequest();
        serviceTypeData.setCode("FORCE_DELETE_ST");
        serviceTypeData.setName("Force Delete ServiceType");
        serviceTypeData.setGameId(game.getId());
        var createdServiceType = serviceTypeService.createServiceType(serviceTypeData);
        assertNotNull(createdServiceType.getId(), "ServiceType ID should not be null after creation");

        // When - Force delete ServiceType completely
        serviceTypeService.forceDeleteServiceType(createdServiceType.getId());

        // Then - Verify ServiceType is completely removed
        assertThrows(NotFoundException.class, () -> {
            serviceTypeService.getServiceTypeById(createdServiceType.getId());
        });
    }

    @Test
    @DisplayName("SERVICE ACTIVATE: Активувати тип послуги через сервіс")
    void shouldActivateServiceTypeViaService() {
        // Given - Create game and service type, then deactivate it
        var gameData = new CreateGameRequest();
        gameData.setCode("ACTIVATE_ST_GAME");
        gameData.setName("Activate ServiceType Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.MMORPG);
        var game = gameService.createGame(gameData);

        var serviceTypeData = new CreateServiceTypeRequest();
        serviceTypeData.setCode("ACTIVATE_ST");
        serviceTypeData.setName("Activate ServiceType");
        serviceTypeData.setGameId(game.getId());
        var createdServiceType = serviceTypeService.createServiceType(serviceTypeData);
        assertNotNull(createdServiceType.getId(), "ServiceType ID should not be null after creation");

        // Deactivate first
        var deactivatedServiceType = serviceTypeService.setServiceTypeActive(createdServiceType.getId(), false);
        assertFalse(deactivatedServiceType.getActive(), "ServiceType should be deactivated");

        // When - Activate the service type
        var activatedServiceType = serviceTypeService.setServiceTypeActive(createdServiceType.getId(), true);

        // Then
        assertTrue(activatedServiceType.getActive(), "ServiceType should be activated");
        assertEquals("ACTIVATE_ST", activatedServiceType.getCode());
        assertEquals("Activate ServiceType", activatedServiceType.getName());
    }

    @Test
    @DisplayName("SERVICE DEACTIVATE: Деактивувати тип послуги через сервіс")
    void shouldDeactivateServiceTypeViaService() {
        // Given - Create game and service type
        var gameData = new CreateGameRequest();
        gameData.setCode("DEACTIVATE_ST_GAME");
        gameData.setName("Deactivate ServiceType Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameService.createGame(gameData);

        var serviceTypeData = new CreateServiceTypeRequest();
        serviceTypeData.setCode("DEACTIVATE_ST");
        serviceTypeData.setName("Deactivate ServiceType");
        serviceTypeData.setGameId(game.getId());
        var createdServiceType = serviceTypeService.createServiceType(serviceTypeData);
        assertNotNull(createdServiceType.getId(), "ServiceType ID should not be null after creation");
        assertTrue(createdServiceType.getActive(), "ServiceType should be active by default");

        // When - Deactivate the service type
        var deactivatedServiceType = serviceTypeService.setServiceTypeActive(createdServiceType.getId(), false);

        // Then
        assertFalse(deactivatedServiceType.getActive(), "ServiceType should be deactivated");
        assertEquals("DEACTIVATE_ST", deactivatedServiceType.getCode());
        assertEquals("Deactivate ServiceType", deactivatedServiceType.getName());
    }

    @Test
    @DisplayName("SERVICE LIST: Отримати список типів послуг через сервіс")
    void shouldListServiceTypesViaService() {
        // Given - Create game and multiple service types
        var gameData = new CreateGameRequest();
        gameData.setCode("LIST_ST_GAME");
        gameData.setName("List ServiceType Test Game");
        gameData.setCategory(CreateGameRequest.CategoryEnum.BATTLE_ROYALE);
        var game = gameService.createGame(gameData);

        var serviceType1 = new CreateServiceTypeRequest();
        serviceType1.setCode("LIST_ST_1");
        serviceType1.setName("List ServiceType 1");
        serviceType1.setGameId(game.getId());
        serviceTypeService.createServiceType(serviceType1);

        var serviceType2 = new CreateServiceTypeRequest();
        serviceType2.setCode("LIST_ST_2");
        serviceType2.setName("List ServiceType 2");
        serviceType2.setGameId(game.getId());
        serviceTypeService.createServiceType(serviceType2);

        // When
        var serviceTypes = serviceTypeService.getServiceTypes(0, 10, null, null, null, game.getId(), null);

        // Then
        assertFalse(serviceTypes.getData().isEmpty());
        assertTrue(serviceTypes.getData().size() >= 2);
    }
}
