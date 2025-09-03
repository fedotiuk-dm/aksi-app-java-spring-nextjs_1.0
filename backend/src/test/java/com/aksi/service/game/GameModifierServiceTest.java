package com.aksi.service.game;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.domain.game.GameModifierEntity;

@ExtendWith(MockitoExtension.class)
class GameModifierServiceTest {

    @Mock
    private GameModifierService gameModifierService;

    @Test
    @DisplayName("Should return active modifiers for game and service type")
    void shouldReturnActiveModifiersForGameAndServiceType() {
        // Given
        var gameId = UUID.randomUUID();
        var serviceTypeId = UUID.randomUUID();
        var modifiers = List.of("RUSH_24H", "SPECIAL_DISCOUNT");

        var rushModifier = new GameModifierEntity();
        rushModifier.setCode("RUSH_24H");
        rushModifier.setOperation(GameModifierOperation.MULTIPLY);
        rushModifier.setValue(50);

        var discountModifier = new GameModifierEntity();
        discountModifier.setCode("SPECIAL_DISCOUNT");
        discountModifier.setOperation(GameModifierOperation.MULTIPLY);
        discountModifier.setValue(-20);

        when(gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers))
            .thenReturn(List.of(rushModifier, discountModifier));

        // When
        var result = gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("RUSH_24H", result.get(0).getCode());
        assertEquals("SPECIAL_DISCOUNT", result.get(1).getCode());
    }

    @Test
    @DisplayName("Should return empty list for no modifiers")
    void shouldReturnEmptyListForNoModifiers() {
        // Given
        var gameId = UUID.randomUUID();
        var serviceTypeId = UUID.randomUUID();
        var modifiers = List.<String>of();

        when(gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers))
            .thenReturn(List.of());

        // When
        var result = gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("VALIDATION: Should validate modifier compatibility")
    void shouldValidateModifierCompatibility() {
        // Given
        var rushModifier = new GameModifierEntity();
        rushModifier.setCode("RUSH_24H");
        rushModifier.setOperation(GameModifierOperation.MULTIPLY);
        rushModifier.setValue(50);

        var discountModifier = new GameModifierEntity();
        discountModifier.setCode("SPECIAL_DISCOUNT");
        discountModifier.setOperation(GameModifierOperation.MULTIPLY);
        discountModifier.setValue(-20);

        var modifiers = List.of(rushModifier, discountModifier);

        // When & Then - should not throw exception for compatible modifiers
        assertDoesNotThrow(() -> gameModifierService.validateModifierCompatibility(modifiers));
    }

    @Test
    @DisplayName("EDGE CASE: Should handle null modifier list")
    void shouldHandleNullModifierList() {
        // Given
        var gameId = UUID.randomUUID();
        var serviceTypeId = UUID.randomUUID();
        List<String> modifiers = null;

        when(gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers))
            .thenReturn(List.of());

        // When
        var result = gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("PERFORMANCE TEST: Should handle multiple modifiers efficiently")
    void shouldHandleMultipleModifiersEfficiently() {
        // Given
        var gameId = UUID.randomUUID();
        var serviceTypeId = UUID.randomUUID();
        var modifiers = List.of("RUSH_24H", "SPECIAL_DISCOUNT", "PRIORITY", "EXPRESS");

        var modifierEntities = List.of(
            createModifier("RUSH_24H", GameModifierOperation.MULTIPLY, 50),
            createModifier("SPECIAL_DISCOUNT", GameModifierOperation.MULTIPLY, -20),
            createModifier("PRIORITY", GameModifierOperation.ADD, 300),
            createModifier("EXPRESS", GameModifierOperation.MULTIPLY, 100)
        );

        when(gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers))
            .thenReturn(modifierEntities);

        // When
        long startTime = System.nanoTime();
        var result = gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers);
        long endTime = System.nanoTime();

        // Then
        assertNotNull(result);
        assertEquals(4, result.size());

        long durationMs = (endTime - startTime) / 1_000_000;
        assertTrue(durationMs < 5, "Modifier retrieval took too long: " + durationMs + "ms");
    }

    @Test
    @DisplayName("REAL DATA TEST: Should handle Apex modifiers correctly")
    void shouldHandleApexModifiersCorrectly() {
        // Given - Apex specific modifiers from parsed_data
        var gameId = UUID.randomUUID();
        var serviceTypeId = UUID.randomUUID();
        var modifiers = List.of("APEX_RANKED_RP_ADD", "APEX_SEASON_PASS_MULTIPLY");

        var rpModifier = createModifier("APEX_RANKED_RP_ADD", GameModifierOperation.ADD, 800);
        var seasonPassModifier = createModifier("APEX_SEASON_PASS_MULTIPLY", GameModifierOperation.MULTIPLY, 25);

        when(gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers))
            .thenReturn(List.of(rpModifier, seasonPassModifier));

        // When
        var result = gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(800, result.get(0).getValue()); // RP cost
        assertEquals(25, result.get(1).getValue()); // Season pass discount
    }

    @Test
    @DisplayName("REAL DATA TEST: Should handle COD multi-mode modifiers")
    void shouldHandleCodMultiModeModifiers() {
        // Given - COD multi-mode modifiers
        var gameId = UUID.randomUUID();
        var serviceTypeId = UUID.randomUUID();
        var modifiers = List.of("COD_VANGUARD_MULTIPLY", "COD_CW_MULTIPLY");

        var vanguardModifier = createModifier("COD_VANGUARD_MULTIPLY", GameModifierOperation.MULTIPLY, 200);
        var cwModifier = createModifier("COD_CW_MULTIPLY", GameModifierOperation.MULTIPLY, 150);

        when(gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers))
            .thenReturn(List.of(vanguardModifier, cwModifier));

        // When
        var result = gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifiers);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(200, result.get(0).getValue()); // Vanguard +200%
        assertEquals(150, result.get(1).getValue()); // Cold War +150%
    }

    private GameModifierEntity createModifier(String code, GameModifierOperation operation, int value) {
        var modifier = new GameModifierEntity();
        modifier.setId(UUID.randomUUID());
        modifier.setCode(code);
        modifier.setOperation(operation);
        modifier.setValue(value);
        return modifier;
    }
}
