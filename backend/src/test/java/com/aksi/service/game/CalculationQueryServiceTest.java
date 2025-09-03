package com.aksi.service.game;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.game.dto.CalculationContext;
import com.aksi.api.game.dto.CalculationFormula;
import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.LinearFormula;
import com.aksi.api.game.dto.PriceRange;
import com.aksi.api.game.dto.RangeFormula;
import com.aksi.api.game.dto.TimeBasedFormula;
import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.domain.game.formula.LinearFormulaEntity;
import com.aksi.mapper.PriceConfigurationMapper;
import com.aksi.repository.GameRepository;
import com.aksi.repository.ServiceTypeRepository;

/**
 * Unit tests for CalculationQueryService using real data from parsed_data.
 * Tests the main calculation logic with WOW DF and Apex pricing data.
 */
@ExtendWith(MockitoExtension.class)
class CalculationQueryServiceTest {

    @Mock private CalculationValidationService validationService;
    @Mock private PriceConfigurationMapper priceConfigurationMapper;
    @Mock private GameModifierService gameModifierService;
    @Mock private GameRepository gameRepository;
    @Mock private ServiceTypeRepository serviceTypeRepository;

    private CalculationQueryService calculationService;



    private void setupService() {
        calculationService = new CalculationQueryService(
            validationService,
            priceConfigurationMapper,
            gameModifierService,
            gameRepository,
            serviceTypeRepository
        );
    }

    @Test
    @DisplayName("Should calculate WOW DF Character Leveling with LINEAR formula")
    void shouldCalculateWOWDFCharacterLeveling() {
        // Given
        setupService();
        var linearFormula = createLinearFormula(100); // $1.00 per level from WOW DF
        var request = createCalculationRequest(linearFormula, 9); // 9 levels (1-10)

        var linearEntity = new LinearFormulaEntity();
        linearEntity.setPricePerLevel(100);

        when(priceConfigurationMapper.toDomainFormula(any())).thenReturn(linearEntity);

        // When
        UniversalCalculationResponse response = calculationService.calculateWithFormula("LINEAR", request);

        // Then
        assertNotNull(response);
        assertEquals(UniversalCalculationResponse.StatusEnum.SUCCESS, response.getStatus());
        assertEquals(900, response.getFinalPrice()); // 9 levels * $1.00 = $9.00 (900 cents)
        assertNotNull(response.getBreakdown());
        assertEquals(900, response.getBreakdown().getBaseCalculation());
    }

    @Test
    @DisplayName("Should calculate WOW DF Character Leveling with RANGE formula")
    void shouldCalculateWOWDFWithRangeFormula() {
        // Given
        setupService();
        var rangeFormula = createRangeFormula();
        var request = createCalculationRequest(rangeFormula, 11); // levels 1-12

        var rangeEntity = new com.aksi.domain.game.formula.RangeFormulaEntity();
        rangeEntity.getRanges().add(new com.aksi.domain.game.formula.PriceRangeEntity(1, 5, 400));
        rangeEntity.getRanges().add(new com.aksi.domain.game.formula.PriceRangeEntity(5, 10, 500));
        rangeEntity.getRanges().add(new com.aksi.domain.game.formula.PriceRangeEntity(10, 15, 500));

        when(priceConfigurationMapper.toDomainFormula(any())).thenReturn(rangeEntity);

        // When
        UniversalCalculationResponse response = calculationService.calculateWithFormula("RANGE", request);

        // Then
        assertNotNull(response);
        assertEquals(UniversalCalculationResponse.StatusEnum.SUCCESS, response.getStatus());
        // Expected: $4.00 (01-05) + $5.00 (05-10) + $5.00 (10-15) = $14.00 (1400 cents)
        assertEquals(1400, response.getFinalPrice());
    }

    @Test
    @DisplayName("Should calculate Apex Ranked with TIME_BASED formula")
    void shouldCalculateApexRankedWithTimeBasedFormula() {
        // Given
        setupService();
        var timeFormula = createTimeBasedFormula();
        var request = createCalculationRequest(timeFormula, 4); // 4 levels (1-5)

        var timeEntity = new com.aksi.domain.game.formula.TimeBasedFormulaEntity();
        timeEntity.setHourlyRate(2000);
        timeEntity.setBaseHours(8);
        timeEntity.setHoursPerLevel(1);
        timeEntity.setComplexityMultiplier(1.5f);

        when(priceConfigurationMapper.toDomainFormula(any())).thenReturn(timeEntity);

        // When
        UniversalCalculationResponse response = calculationService.calculateWithFormula("TIME_BASED", request);

        // Then
        assertNotNull(response);
        assertEquals(UniversalCalculationResponse.StatusEnum.SUCCESS, response.getStatus());
        // Expected: 12 hours * $20.00 * 1.5 = $360.00 (36000 cents)
        assertEquals(36000, response.getFinalPrice());
    }

    @Test
    @DisplayName("Should apply RUSH modifier to WOW DF calculation")
    void shouldApplyRushModifierToWOWDF() {
        // Given
        setupService();
        var linearFormula = createLinearFormula(100);
        var request = createCalculationRequest(linearFormula, 9);
        request.getContext().setModifiers(java.util.List.of("RUSH_24H"));

        var gameEntity = createGameEntity();
        var serviceTypeEntity = createServiceTypeEntity();
        var rushModifier = createRushModifier();

        var linearEntity = new LinearFormulaEntity();
        linearEntity.setPricePerLevel(100);

        when(gameRepository.findByCode("WOW")).thenReturn(java.util.Optional.of(gameEntity));
        when(serviceTypeRepository.findByCode("LEVEL_BOOST")).thenReturn(java.util.Optional.of(serviceTypeEntity));
        when(gameModifierService.getActiveModifiersForCalculation(any(), any(), eq(java.util.List.of("RUSH_24H"))))
            .thenReturn(java.util.List.of(rushModifier));
        when(priceConfigurationMapper.toDomainFormula(any())).thenReturn(linearEntity);

        // When
        UniversalCalculationResponse response = calculationService.calculateWithFormula("LINEAR", request);

        // Then
        assertNotNull(response);
        assertEquals(UniversalCalculationResponse.StatusEnum.SUCCESS, response.getStatus());
        // Base: 900 cents, Rush modifier: 900 * 0.5 = 450 cents, Total: 1350 cents
        assertEquals(1350, response.getFinalPrice());
        assertNotNull(response.getBreakdown());
        assertEquals(1, response.getBreakdown().getModifierAdjustments().size());
    }

    @Test
    @DisplayName("Should throw exception when formula is null")
    void shouldThrowWhenFormulaIsNull() {
        // Given
        setupService();
        var request = createCalculationRequest(null, 5);

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            calculationService.calculateWithFormula("LINEAR", request));
        assertEquals("Formula is required", exception.getMessage());
    }



    // Helper methods

    private LinearFormula createLinearFormula(int pricePerLevel) {
        var formula = new LinearFormula();
        formula.setType(TypeEnum.LINEAR);
        formula.setPricePerLevel(pricePerLevel);
        return formula;
    }

    private RangeFormula createRangeFormula() {
        var formula = new RangeFormula();
        formula.setType(TypeEnum.RANGE);

        var ranges = java.util.List.of(
            new PriceRange().from(1).to(5).price(400),   // 01-05: $4.00
            new PriceRange().from(5).to(10).price(500),  // 05-10: $5.00
            new PriceRange().from(10).to(15).price(500)  // 10-15: $5.00
        );
        formula.setRanges(ranges);

        return formula;
    }

    private TimeBasedFormula createTimeBasedFormula() {
        var formula = new TimeBasedFormula();
        formula.setType(TypeEnum.TIME_BASED);
        formula.setHourlyRate(2000);    // $20.00 per hour
        formula.setBaseHours(8);        // 8 hours base time
        formula.setHoursPerLevel(1);    // 1 hour per level
        formula.setComplexityMultiplier(1.5f); // 50% complexity bonus
        return formula;
    }

    private UniversalCalculationRequest createCalculationRequest(CalculationFormula formula, int levelDiff) {
        var request = new UniversalCalculationRequest();
        request.setFormula(formula);

        var context = new CalculationContext();
        context.setGameCode("WOW");
        context.setServiceTypeCode("LEVEL_BOOST");
        context.setDifficultyLevelCode("01-60");
        context.setStartLevel(1);
        context.setTargetLevel(1 + levelDiff);
        context.setModifiers(java.util.List.of());

        request.setContext(context);
        return request;
    }

    private GameEntity createGameEntity() {
        var game = new GameEntity();
        game.setId(java.util.UUID.randomUUID());
        game.setCode("WOW");
        game.setName("World of Warcraft");
        return game;
    }

    private ServiceTypeEntity createServiceTypeEntity() {
        var serviceType = new ServiceTypeEntity();
        serviceType.setId(java.util.UUID.randomUUID());
        serviceType.setCode("LEVEL_BOOST");
        serviceType.setName("Level Boosting");
        return serviceType;
    }

    private GameModifierEntity createRushModifier() {
        var modifier = new GameModifierEntity();
        modifier.setId(java.util.UUID.randomUUID());
        modifier.setCode("RUSH_24H");
        modifier.setName("24 Hour Rush");
        modifier.setOperation(GameModifierOperation.MULTIPLY);
        modifier.setValue(50); // 50% increase (as integer)
        return modifier;
    }
}
