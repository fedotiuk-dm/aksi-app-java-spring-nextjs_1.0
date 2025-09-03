package com.aksi.integration;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.LinearFormula;
import com.aksi.api.game.dto.UniversalCalculationContext;
import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.repository.GameModifierRepository;
import com.aksi.repository.GameRepository;
import com.aksi.repository.ServiceTypeRepository;
import com.aksi.service.game.CalculationQueryService;

/**
 * Full integration test with H2 database to verify end-to-end calculation flow
 */
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
class CalculationIntegrationTest {

    @Autowired
    private CalculationQueryService calculationService;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private ServiceTypeRepository serviceTypeRepository;

    @Autowired
    private GameModifierRepository gameModifierRepository;

    @Test
    @DisplayName("FULL INTEGRATION: Should calculate complete flow from API to database")
    void shouldCalculateCompleteFlowFromApiToDatabase() {
        // Given - Setup test data in H2 database
        var game = new GameEntity();
        game.setId(UUID.randomUUID());
        game.setCode("APEX_INTEGRATION");
        game.setName("Apex Legends Integration Test");
        game = gameRepository.save(game);

        var serviceType = new ServiceTypeEntity();
        serviceType.setId(UUID.randomUUID());
        serviceType.setCode("RANKED_BOOST_INTEGRATION");
        serviceType.setName("Ranked Boost Integration Test");
        serviceType = serviceTypeRepository.save(serviceType);

        var rpModifier = new GameModifierEntity();
        rpModifier.setId(UUID.randomUUID());
        rpModifier.setCode("APEX_INTEGRATION_RP_ADD");
        rpModifier.setName("Apex RP Cost Integration");
        rpModifier.setOperation(GameModifierOperation.ADD);
        rpModifier.setValue(800); // RP cost from parsed_data
        rpModifier.setGameCode(game.getCode());
        rpModifier.setServiceTypeCodes(List.of(serviceType.getCode()));
        gameModifierRepository.save(rpModifier);

        var rushModifier = new GameModifierEntity();
        rushModifier.setId(UUID.randomUUID());
        rushModifier.setCode("INTEGRATION_RUSH_MULTIPLY");
        rushModifier.setName("Rush Order Integration");
        rushModifier.setOperation(GameModifierOperation.MULTIPLY);
        rushModifier.setValue(50); // +50% rush
        rushModifier.setGameCode(game.getCode());
        rushModifier.setServiceTypeCodes(List.of(serviceType.getCode()));
        gameModifierRepository.save(rushModifier);

        // Create API request
        var linearFormula = new LinearFormula();
        linearFormula.setType(TypeEnum.LINEAR);
        linearFormula.setPricePerLevel(100); // $1.00 per level

        var request = new UniversalCalculationRequest();
        request.setFormula(linearFormula);

        var context = new UniversalCalculationContext();
        context.setStartLevel(1);
        context.setTargetLevel(5); // 4 levels
        context.setGameCode("APEX_INTEGRATION");
        context.setServiceTypeCode("RANKED_BOOST_INTEGRATION");
        context.setModifiers(List.of("APEX_INTEGRATION_RP_ADD", "INTEGRATION_RUSH_MULTIPLY"));
        request.setContext(context);

        // When - Execute complete calculation flow
        UniversalCalculationResponse response = calculationService.calculateWithFormula("LINEAR", request);

        // Then - Verify complete end-to-end result
        assertNotNull(response);
        assertEquals(UniversalCalculationResponse.StatusEnum.SUCCESS, response.getStatus());

        // Expected calculation:
        // Base: 4 levels * $1.00 = $4.00 = 400 cents
        // Rush: 400 * 150/100 - 400 = 200 cents additional
        // RP: 800 cents additional
        // Total: 400 + 200 + 800 = 1400 cents
        assertEquals(1400, response.getFinalPrice());

        // Verify breakdown contains both modifiers
        assertNotNull(response.getBreakdown());
        assertNotNull(response.getBreakdown().getModifierAdjustments());
        assertEquals(2, response.getBreakdown().getModifierAdjustments().size());

        // Verify modifier details
        var adjustments = response.getBreakdown().getModifierAdjustments();
        var rpAdjustment = adjustments.stream()
            .filter(a -> "APEX_INTEGRATION_RP_ADD".equals(a.getModifierCode()))
            .findFirst().orElseThrow();
        assertEquals(800, rpAdjustment.getAdjustment());

        var rushAdjustment = adjustments.stream()
            .filter(a -> "INTEGRATION_RUSH_MULTIPLY".equals(a.getModifierCode()))
            .findFirst().orElseThrow();
        assertEquals(200, rushAdjustment.getAdjustment()); // 400 * 150/100 - 400 = 200
    }

    @Test
    @DisplayName("INTEGRATION ERROR: Should handle database errors gracefully")
    void shouldHandleDatabaseErrorsGracefully() {
        // Given - Request with non-existent game
        var linearFormula = new LinearFormula();
        linearFormula.setType(TypeEnum.LINEAR);
        linearFormula.setPricePerLevel(100);

        var request = new UniversalCalculationRequest();
        request.setFormula(linearFormula);

        var context = new UniversalCalculationContext();
        context.setStartLevel(1);
        context.setTargetLevel(5);
        context.setGameCode("NON_EXISTENT_GAME");
        context.setServiceTypeCode("LEVEL_BOOST");
        request.setContext(context);

        // When & Then
        var exception = assertThrows(RuntimeException.class, () ->
            calculationService.calculateWithFormula("LINEAR", request));
        assertTrue(exception.getMessage().contains("Game not found"));
    }

    @Test
    @DisplayName("INTEGRATION PERFORMANCE: Should handle concurrent calculations")
    void shouldHandleConcurrentCalculations() {
        // Given - Setup test data
        var game = new GameEntity();
        game.setId(UUID.randomUUID());
        game.setCode("PERFORMANCE_GAME");
        game.setName("Performance Test Game");
        game = gameRepository.save(game);

        var serviceType = new ServiceTypeEntity();
        serviceType.setId(UUID.randomUUID());
        serviceType.setCode("PERFORMANCE_BOOST");
        serviceType.setName("Performance Test Boost");
        serviceType = serviceTypeRepository.save(serviceType);

        // When - Execute multiple calculations concurrently
        long startTime = System.nanoTime();

        List<Thread> threads = new java.util.ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Thread thread = new Thread(() -> {
                var linearFormula = new LinearFormula();
                linearFormula.setType(TypeEnum.LINEAR);
                linearFormula.setPricePerLevel(10);

                var request = new UniversalCalculationRequest();
                request.setFormula(linearFormula);

                var context = new UniversalCalculationContext();
                context.setStartLevel(1);
                context.setTargetLevel(10);
                context.setGameCode("PERFORMANCE_GAME");
                context.setServiceTypeCode("PERFORMANCE_BOOST");
                request.setContext(context);

                var response = calculationService.calculateWithFormula("LINEAR", request);
                assertNotNull(response);
                assertEquals(UniversalCalculationResponse.StatusEnum.SUCCESS, response.getStatus());
                assertEquals(90, response.getFinalPrice()); // 9 levels * $0.10 = $0.90
            });
            threads.add(thread);
        }

        // Start all threads
        threads.forEach(Thread::start);

        // Wait for all threads to complete
        threads.forEach(thread -> {
            try {
                thread.join();
            } catch (InterruptedException e) {
                fail("Thread interrupted: " + e.getMessage());
            }
        });

        long endTime = System.nanoTime();

        // Then - Performance check
        long durationMs = (endTime - startTime) / 1_000_000;
        assertTrue(durationMs < 1000, "Concurrent calculations took too long: " + durationMs + "ms");
    }

    @Test
    @DisplayName("INTEGRATION REAL DATA: Should calculate with real NW weapon data")
    void shouldCalculateWithRealNwWeaponData() {
        // Given - Setup NW game with weapon modifiers from parsed_data
        var game = new GameEntity();
        game.setId(UUID.randomUUID());
        game.setCode("NW_REAL_DATA");
        game.setName("New World Real Data Test");
        game = gameRepository.save(game);

        var serviceType = new ServiceTypeEntity();
        serviceType.setId(UUID.randomUUID());
        serviceType.setCode("WEAPON_REAL_DATA");
        serviceType.setName("Weapon Real Data Test");
        serviceType = serviceTypeRepository.save(serviceType);

        // NW Weapon modifier: +125% based on parsed_data (Weapon Per Level = 2.5 vs Level Per Level = 1)
        var weaponModifier = new GameModifierEntity();
        weaponModifier.setId(UUID.randomUUID());
        weaponModifier.setCode("NW_REAL_WEAPON_MULTIPLY");
        weaponModifier.setName("NW Weapon Real Data Multiplier");
        weaponModifier.setOperation(GameModifierOperation.MULTIPLY);
        weaponModifier.setValue(125); // 2.5 / 1 = 2.5x total, so +125% additional
        weaponModifier.setGameCode(game.getCode());
        weaponModifier.setServiceTypeCodes(List.of(serviceType.getCode()));
        gameModifierRepository.save(weaponModifier);

        // Create API request for NW Weapon 01-05
        var linearFormula = new LinearFormula();
        linearFormula.setType(TypeEnum.LINEAR);
        linearFormula.setPricePerLevel(100); // Base $1.00 per level

        var request = new UniversalCalculationRequest();
        request.setFormula(linearFormula);

        var context = new UniversalCalculationContext();
        context.setStartLevel(1);
        context.setTargetLevel(5); // 4 levels
        context.setGameCode("NW_REAL_DATA");
        context.setServiceTypeCode("WEAPON_REAL_DATA");
        context.setModifiers(List.of("NW_REAL_WEAPON_MULTIPLY"));
        request.setContext(context);

        // When
        UniversalCalculationResponse response = calculationService.calculateWithFormula("LINEAR", request);

        // Then - Verify calculation matches NW parsed_data
        assertNotNull(response);
        assertEquals(UniversalCalculationResponse.StatusEnum.SUCCESS, response.getStatus());

        // Expected based on NW parsed_data:
        // Base: 4 levels * $1.00 = $4.00 = 400 cents
        // Weapon modifier: 400 * 2.25 - 400 = 500 cents additional
        // Total: 400 + 500 = 900 cents
        assertEquals(900, response.getFinalPrice());

        // Verify modifier details
        var adjustments = response.getBreakdown().getModifierAdjustments();
        assertEquals(1, adjustments.size());
        assertEquals(500, adjustments.getFirst().getAdjustment()); // 400 * 2.25 - 400 = 500
    }
}
