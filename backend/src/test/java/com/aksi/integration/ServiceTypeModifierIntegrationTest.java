package com.aksi.integration;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;

import com.aksi.api.game.dto.CreateGameModifierRequest;
import com.aksi.api.game.dto.CreateGameRequest;
import com.aksi.api.game.dto.CreateGameRequest.CategoryEnum;
import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.Game;
import com.aksi.api.game.dto.GameModifierInfo;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.api.game.dto.ServiceType;
import com.aksi.api.game.dto.UpdateGameModifierRequest;
import com.aksi.service.game.GameModifierService;
import com.aksi.service.game.GameService;
import com.aksi.service.game.ServiceTypeService;

/**
 * Integration test to reproduce and fix modifier visibility and calculation issues
 * when service types are involved.
 */
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ServiceTypeModifierIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private GameService gameService;

    @Autowired
    private ServiceTypeService serviceTypeService;

    @Autowired
    private GameModifierService gameModifierService;

    @Test
    @DisplayName("Should show modifier when bound to service type")
    void testModifierVisibilityWithServiceType() {
        // Given: Create game LOL
        var lolGame = createLolGame();

        // Given: Create service type BOOSTING (same code as frontend sends)
        var boostingServiceType = createBoostingServiceType(lolGame.getId().toString());

        // Given: Create modifier bound to BOOSTING service type
        var streamingModifier = createStreamingModifier(lolGame.getCode());
        bindModifierToServiceType(streamingModifier.getId().toString(), boostingServiceType.getCode());

        // When: Get modifiers for LOL with BOOSTING service type
        var modifiersResponse = gameModifierService.getAllGameModifiers(
                lolGame.getCode(), null, boostingServiceType.getCode(), true, null, 0, 10, null, null, null);

        // Then: Modifier should be visible
        assertThat(modifiersResponse.getModifiers()).hasSize(1);
        var modifier = modifiersResponse.getModifiers().getFirst();
        assertThat(modifier.getCode()).isEqualTo("STREAMING");
        assertThat(modifier.getServiceTypeCodes()).contains(boostingServiceType.getCode());
    }

    @Test
    @DisplayName("Should show modifier when NOT bound to service type")
    void testModifierVisibilityWithoutServiceTypeBinding() {
        // Given: Create game LOL
        var lolGame = createLolGame();

        // Given: Create service type BOOSTING
        var boostingServiceType = createBoostingServiceType(lolGame.getId().toString());

        // Note: Create modifier NOT bound to any service type
        createStreamingModifier(lolGame.getCode());

        // When: Get modifiers for LOL with BOOSTING service type
        var modifiersResponse = gameModifierService.getAllGameModifiers(
                lolGame.getCode(), null, boostingServiceType.getCode(), true, null, 0, 10, null, null, null);

        // Then: Modifier should still be visible (because serviceTypeCodes is empty)
        assertThat(modifiersResponse.getModifiers()).hasSize(1);
        var modifier = modifiersResponse.getModifiers().getFirst();
        assertThat(modifier.getCode()).isEqualTo("STREAMING");
        assertThat(modifier.getServiceTypeCodes()).isEmpty();
    }

    @Test
    @DisplayName("Should handle service type codes case sensitivity")
    void testServiceTypeCodeCaseSensitivity() {
        // Given: Create game LOL
        var lolGame = createLolGame();

        // Given: Create service type with lowercase "boosting"
        var boostingServiceType = createServiceType(lolGame.getId().toString(), "boosting", "Boosting Service");

        // Given: Create modifier bound to lowercase "boosting"
        var streamingModifier = createStreamingModifier(lolGame.getCode());
        bindModifierToServiceType(streamingModifier.getId().toString(), boostingServiceType.getCode());

        // When: Get modifiers with uppercase "BOOSTING" (different case)
        var modifiersResponse = gameModifierService.getAllGameModifiers(
                lolGame.getCode(), null, "BOOSTING", true, null, 0, 10, null, null, null);

        // Then: Should not find modifier due to case mismatch
        assertThat(modifiersResponse.getModifiers()).isEmpty();
    }

    private Game createLolGame() {
        var request = new CreateGameRequest();
        request.setCode("LOL");
        request.setName("League of Legends");
        request.setCategory(CategoryEnum.MOBA);

        return gameService.createGame(request);
    }

    private ServiceType createBoostingServiceType(String gameId) {
        return createServiceType(gameId, "BOOSTING", "Rank Boosting Service");
    }

    private ServiceType createServiceType(String gameId, String code, String name) {
        var request = new CreateServiceTypeRequest();
        request.setGameId(UUID.fromString(gameId));
        request.setCode(code);
        request.setName(name);

        return serviceTypeService.createServiceType(request);
    }


    private GameModifierInfo createStreamingModifier(String gameCode) {
        var request = new CreateGameModifierRequest();
        request.setCode("STREAMING");
        request.setName("Streaming Bonus");
        request.setType(GameModifierType.EXTRA);
        request.setOperation(GameModifierOperation.ADD);
        request.setValue(50000); // 500.00 USD in cents
        request.setGameCode(gameCode);

        return gameModifierService.createGameModifier(request);
    }

    private void bindModifierToServiceType(String modifierId, String serviceTypeCode) {
        // Simulate binding modifier to service type through admin panel
        var updateRequest = new UpdateGameModifierRequest();
        updateRequest.setServiceTypeCodes(List.of(serviceTypeCode));

        UUID uuid = UUID.fromString(modifierId);
        gameModifierService.updateGameModifier(uuid, updateRequest);
    }
}
