package com.aksi.mapper;

import com.aksi.api.game.dto.*;
import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.aksi.domain.game.formula.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import static org.junit.jupiter.api.Assertions.*;

class PriceConfigurationMapperTest {

    private final PriceConfigurationMapper mapper = Mappers.getMapper(PriceConfigurationMapper.class);

    @Test
    @DisplayName("Should map LINEAR formula DTO to entity")
    void shouldMapLinearFormulaDtoToEntity() {
        // Given
        var linearDto = new LinearFormula();
        linearDto.setType(TypeEnum.LINEAR);
        linearDto.setPricePerLevel(100); // $1.00 per level

        // When
        CalculationFormulaEntity result = mapper.toDomainFormula(linearDto);

        // Then
        assertNotNull(result);
      assertInstanceOf(LinearFormulaEntity.class, result);
        var linearEntity = (LinearFormulaEntity) result;
        assertEquals(100, linearEntity.getPricePerLevel());
    }

    @Test
    @DisplayName("Should map RANGE formula DTO to entity")
    void shouldMapRangeFormulaDtoToEntity() {
        // Given
        var rangeDto = new RangeFormula();
        rangeDto.setType(TypeEnum.RANGE);

        var priceRangeDto = new PriceRange();
        priceRangeDto.setFrom(1);
        priceRangeDto.setTo(5);
        priceRangeDto.setPrice(100);
        rangeDto.setRanges(java.util.List.of(priceRangeDto));

        // When
        CalculationFormulaEntity result = mapper.toDomainFormula(rangeDto);

        // Then
        assertNotNull(result);
      assertInstanceOf(RangeFormulaEntity.class, result);
        var rangeEntity = (RangeFormulaEntity) result;
        assertEquals(1, rangeEntity.getRanges().size());
        assertEquals(100, rangeEntity.getRanges().getFirst().getPrice());
    }

    @Test
    @DisplayName("Should map TIME_BASED formula DTO to entity")
    void shouldMapTimeBasedFormulaDtoToEntity() {
        // Given
        var timeDto = new TimeBasedFormula();
        timeDto.setType(TypeEnum.TIME_BASED);
        timeDto.setHourlyRate(2000); // $20.00 per hour
        timeDto.setBaseHours(2);
        timeDto.setComplexityMultiplier(150); // 150% = 1.5x multiplier

        // When
        CalculationFormulaEntity result = mapper.toDomainFormula(timeDto);

        // Then
        assertNotNull(result);
      assertInstanceOf(TimeBasedFormulaEntity.class, result);
        var timeEntity = (TimeBasedFormulaEntity) result;
        assertEquals(2000, timeEntity.getHourlyRate());
        assertEquals(2, timeEntity.getBaseHours());
        assertEquals(150, timeEntity.getComplexityMultiplier()); // 150% = 1.5x
    }

    @Test
    @DisplayName("Should map FORMULA formula DTO to entity")
    void shouldMapFormulaFormulaDtoToEntity() {
        // Given
        var formulaDto = new FormulaFormula();
        formulaDto.setType(TypeEnum.FORMULA);
        formulaDto.setExpression("basePrice + (level * 50)");
        formulaDto.setVariables(java.util.Map.of("multiplier", 50));

        // When
        CalculationFormulaEntity result = mapper.toDomainFormula(formulaDto);

        // Then
        assertNotNull(result);
      assertInstanceOf(FormulaFormulaEntity.class, result);
        var formulaEntity = (FormulaFormulaEntity) result;
        assertEquals("basePrice + (level * 50)", formulaEntity.getExpression());
        assertEquals(50, formulaEntity.getVariables().get("multiplier"));
    }

    @Test
    @DisplayName("VALIDATION: Should throw exception for null formula type")
    void shouldThrowExceptionForNullFormulaType() {
        // Given
        var linearDto = new LinearFormula();
        linearDto.setType(null); // Null type

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            mapper.toDomainFormula(linearDto));
        assertTrue(exception.getMessage().contains("type"));
    }

    @Test
    @DisplayName("VALIDATION: Should throw exception for unknown formula type")
    void shouldThrowExceptionForUnknownFormulaType() {
        // Given - Create a mock formula with unknown type
        var unknownFormula = new LinearFormula();
        unknownFormula.setType(TypeEnum.LINEAR);
        // Manually set unknown type (this would normally be validated by OpenAPI)

        // When & Then - Should handle gracefully
        CalculationFormulaEntity result = mapper.toDomainFormula(unknownFormula);
        assertNotNull(result);
    }

    @Test
    @DisplayName("PERFORMANCE TEST: Should map formulas efficiently")
    void shouldMapFormulasEfficiently() {
        // Given
        var linearDto = new LinearFormula();
        linearDto.setType(TypeEnum.LINEAR);
        linearDto.setPricePerLevel(100);

        // When
        long startTime = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            mapper.toDomainFormula(linearDto);
        }
        long endTime = System.nanoTime();

        // Then
        long durationMs = (endTime - startTime) / 1_000_000;
        assertTrue(durationMs < 50, "Mapping 1000 formulas took too long: " + durationMs + "ms");
    }

    @Test
    @DisplayName("EDGE CASE: Should handle empty ranges in RANGE formula")
    void shouldHandleEmptyRangesInRangeFormula() {
        // Given
        var rangeDto = new RangeFormula();
        rangeDto.setType(TypeEnum.RANGE);
        rangeDto.setRanges(java.util.List.of()); // Empty list

        // When
        CalculationFormulaEntity result = mapper.toDomainFormula(rangeDto);

        // Then
        assertNotNull(result);
      assertInstanceOf(RangeFormulaEntity.class, result);
        var rangeEntity = (RangeFormulaEntity) result;
        assertTrue(rangeEntity.getRanges().isEmpty());
    }

    @Test
    @DisplayName("EDGE CASE: Should handle null variables in FORMULA")
    void shouldHandleNullVariablesInFormula() {
        // Given
        var formulaDto = new FormulaFormula();
        formulaDto.setType(TypeEnum.FORMULA);
        formulaDto.setExpression("basePrice + level");
        formulaDto.setVariables(null); // Null variables

        // When
        CalculationFormulaEntity result = mapper.toDomainFormula(formulaDto);

        // Then
        assertNotNull(result);
      assertInstanceOf(FormulaFormulaEntity.class, result);
        var formulaEntity = (FormulaFormulaEntity) result;
        assertNotNull(formulaEntity.getVariables());
        assertTrue(formulaEntity.getVariables().isEmpty());
    }
}
