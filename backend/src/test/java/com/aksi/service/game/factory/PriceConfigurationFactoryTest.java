package com.aksi.service.game.factory;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;
import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.domain.game.formula.LinearFormulaEntity;
import com.aksi.domain.game.formula.RangeFormulaEntity;
import com.aksi.domain.game.formula.TimeBasedFormulaEntity;
import com.aksi.mapper.PriceConfigurationMapper;
import com.aksi.service.game.util.EntityQueryUtils;
import com.aksi.service.game.util.EntityValidationUtils;

/**
 * Unit tests for PriceConfigurationFactory
 * Tests calculationFormula initialization logic
 */
@ExtendWith(MockitoExtension.class)
class PriceConfigurationFactoryTest {

    @Mock
    private PriceConfigurationMapper priceConfigurationMapper;

    @Mock
    private EntityQueryUtils entityQueryUtils;

    @Mock
    private EntityValidationUtils entityValidationUtils;

    @InjectMocks
    private PriceConfigurationFactory factory;

    private GameEntity game;
    private DifficultyLevelEntity difficultyLevel;
    private ServiceTypeEntity serviceType;
    private PriceConfigurationEntity entity;

    @BeforeEach
    void setUp() {
        game = new GameEntity();
        game.setId(UUID.randomUUID());

        difficultyLevel = new DifficultyLevelEntity();
        difficultyLevel.setId(UUID.randomUUID());

        serviceType = new ServiceTypeEntity();
        serviceType.setId(UUID.randomUUID());

        entity = PriceConfigurationEntity.builder()
            .basePrice(1000)
            .calculationType("LINEAR")
            .build();

        // Set calculationFormula to null for testing
        entity.setCalculationFormula(null);
    }

    @Test
    @DisplayName("Should initialize LinearFormula for LINEAR calculation type")
    void shouldInitializeLinearFormulaForLinearCalculationType() {
        // Given
        var request = new CreatePriceConfigurationRequest();
        request.setGameId(game.getId());
        request.setDifficultyLevelId(difficultyLevel.getId());
        request.setServiceTypeId(serviceType.getId());
        request.setCalculationType(CreatePriceConfigurationRequest.CalculationTypeEnum.LINEAR);
        request.setPricePerLevel(50);
        request.setBasePrice(1000);

        when(entityQueryUtils.findGameEntity(any())).thenReturn(game);
        when(entityQueryUtils.findDifficultyLevelEntity(any())).thenReturn(difficultyLevel);
        when(entityQueryUtils.findServiceTypeEntity(any())).thenReturn(serviceType);
        when(priceConfigurationMapper.toPriceConfigurationEntity(request)).thenReturn(entity);

        // When
        PriceConfigurationEntity result = factory.createEntity(request);

        // Then
        assertNotNull(result);
        assertNotNull(result.getCalculationFormula());
        assertInstanceOf(LinearFormulaEntity.class, result.getCalculationFormula());
        assertEquals(50, ((LinearFormulaEntity) result.getCalculationFormula()).getPricePerLevel());
    }

    @Test
    @DisplayName("Should initialize LinearFormula for FIXED calculation type")
    void shouldInitializeLinearFormulaForFixedCalculationType() {
        // Given
        var request = new CreatePriceConfigurationRequest();
        request.setGameId(game.getId());
        request.setDifficultyLevelId(difficultyLevel.getId());
        request.setServiceTypeId(serviceType.getId());
        request.setCalculationType(CreatePriceConfigurationRequest.CalculationTypeEnum.LINEAR);
        request.setPricePerLevel(75);
        request.setBasePrice(1000);

        entity.setCalculationType("FIXED");

        when(entityQueryUtils.findGameEntity(any())).thenReturn(game);
        when(entityQueryUtils.findDifficultyLevelEntity(any())).thenReturn(difficultyLevel);
        when(entityQueryUtils.findServiceTypeEntity(any())).thenReturn(serviceType);
        when(priceConfigurationMapper.toPriceConfigurationEntity(request)).thenReturn(entity);

        // When
        PriceConfigurationEntity result = factory.createEntity(request);

        // Then
        assertNotNull(result);
        assertNotNull(result.getCalculationFormula());
        assertInstanceOf(LinearFormulaEntity.class, result.getCalculationFormula());
        assertEquals(75, ((LinearFormulaEntity) result.getCalculationFormula()).getPricePerLevel());
    }

    @Test
    @DisplayName("Should create fallback LinearFormula for unknown calculation type")
    void shouldCreateFallbackLinearFormulaForUnknownCalculationType() {
        // Given
        var request = new CreatePriceConfigurationRequest();
        request.setGameId(game.getId());
        request.setDifficultyLevelId(difficultyLevel.getId());
        request.setServiceTypeId(serviceType.getId());
        // Set unknown calculation type to trigger fallback
        request.setCalculationType(CreatePriceConfigurationRequest.CalculationTypeEnum.LINEAR);
        request.setPricePerLevel(25);
        request.setBasePrice(1000);

        // Set unknown calculation type in entity to trigger default case
        entity.setCalculationType("UNKNOWN_TYPE");

        when(entityQueryUtils.findGameEntity(any())).thenReturn(game);
        when(entityQueryUtils.findDifficultyLevelEntity(any())).thenReturn(difficultyLevel);
        when(entityQueryUtils.findServiceTypeEntity(any())).thenReturn(serviceType);
        when(priceConfigurationMapper.toPriceConfigurationEntity(request)).thenReturn(entity);

        // When
        PriceConfigurationEntity result = factory.createEntity(request);

        // Then
        assertNotNull(result);
        assertNotNull(result.getCalculationFormula());
        assertInstanceOf(LinearFormulaEntity.class, result.getCalculationFormula());
        // For unknown types, pricePerLevel should be 0 (fallback)
        assertEquals(0, ((LinearFormulaEntity) result.getCalculationFormula()).getPricePerLevel());
    }

    @Test
    @DisplayName("Should create fallback LinearFormula when calculationType is null")
    void shouldCreateFallbackLinearFormulaWhenCalculationTypeIsNull() {
        // Given
        var request = new CreatePriceConfigurationRequest();
        request.setGameId(game.getId());
        request.setDifficultyLevelId(difficultyLevel.getId());
        request.setServiceTypeId(serviceType.getId());
        request.setCalculationType(null);
        request.setPricePerLevel(100);
        request.setBasePrice(1000);

        entity.setCalculationType(null);

        when(entityQueryUtils.findGameEntity(any())).thenReturn(game);
        when(entityQueryUtils.findDifficultyLevelEntity(any())).thenReturn(difficultyLevel);
        when(entityQueryUtils.findServiceTypeEntity(any())).thenReturn(serviceType);
        when(priceConfigurationMapper.toPriceConfigurationEntity(request)).thenReturn(entity);

        // When
        PriceConfigurationEntity result = factory.createEntity(request);

        // Then
        assertNotNull(result);
        assertNotNull(result.getCalculationFormula());
        assertInstanceOf(LinearFormulaEntity.class, result.getCalculationFormula());
        // For null calculationType, pricePerLevel should be 0 (fallback)
        assertEquals(0, ((LinearFormulaEntity) result.getCalculationFormula()).getPricePerLevel());
    }

    @Test
    @DisplayName("Should not reinitialize calculationFormula if already exists")
    void shouldNotReinitializeCalculationFormulaIfAlreadyExists() {
        // Given
        var existingFormula = new LinearFormulaEntity();
        existingFormula.setPricePerLevel(200);

        entity.setCalculationFormula(existingFormula);

        var request = new CreatePriceConfigurationRequest();
        request.setGameId(game.getId());
        request.setDifficultyLevelId(difficultyLevel.getId());
        request.setServiceTypeId(serviceType.getId());
        request.setCalculationType(CreatePriceConfigurationRequest.CalculationTypeEnum.LINEAR);
        request.setPricePerLevel(50);
        request.setBasePrice(1000);

        when(entityQueryUtils.findGameEntity(any())).thenReturn(game);
        when(entityQueryUtils.findDifficultyLevelEntity(any())).thenReturn(difficultyLevel);
        when(entityQueryUtils.findServiceTypeEntity(any())).thenReturn(serviceType);
        when(priceConfigurationMapper.toPriceConfigurationEntity(request)).thenReturn(entity);

        // When
        PriceConfigurationEntity result = factory.createEntity(request);

        // Then
        assertNotNull(result);
        assertNotNull(result.getCalculationFormula());
        assertInstanceOf(LinearFormulaEntity.class, result.getCalculationFormula());
        // Should keep existing formula with pricePerLevel = 200
        assertEquals(200, ((LinearFormulaEntity) result.getCalculationFormula()).getPricePerLevel());
    }

    @Test
    @DisplayName("Should create TimeBasedFormulaEntity for TIME_BASED calculation type")
    void shouldCreateTimeBasedFormulaEntityForTimeBasedCalculationType() {
        // Given
        var request = new CreatePriceConfigurationRequest();
        request.setGameId(game.getId());
        request.setDifficultyLevelId(difficultyLevel.getId());
        request.setServiceTypeId(serviceType.getId());
        request.setCalculationType(CreatePriceConfigurationRequest.CalculationTypeEnum.TIME_BASED);
        request.setBasePrice(1000);

        var entity = new PriceConfigurationEntity();
        entity.setCalculationType("TIME_BASED");

        when(entityQueryUtils.findGameEntity(any())).thenReturn(game);
        when(entityQueryUtils.findDifficultyLevelEntity(any())).thenReturn(difficultyLevel);
        when(entityQueryUtils.findServiceTypeEntity(any())).thenReturn(serviceType);
        when(priceConfigurationMapper.toPriceConfigurationEntity(request)).thenReturn(entity);

        // When
        PriceConfigurationEntity result = factory.createEntity(request);

        // Then
        assertNotNull(result);
        assertNotNull(result.getCalculationFormula());
        assertInstanceOf(TimeBasedFormulaEntity.class, result.getCalculationFormula());
    }

    @Test
    @DisplayName("Should create FormulaFormulaEntity for FORMULA calculation type")
    void shouldCreateFormulaFormulaEntityForFormulaCalculationType() {
        // Given
        var request = new CreatePriceConfigurationRequest();
        request.setGameId(game.getId());
        request.setDifficultyLevelId(difficultyLevel.getId());
        request.setServiceTypeId(serviceType.getId());
        request.setCalculationType(CreatePriceConfigurationRequest.CalculationTypeEnum.FORMULA);
        request.setBasePrice(1000);

        var entity = new PriceConfigurationEntity();
        entity.setCalculationType("FORMULA");

        when(entityQueryUtils.findGameEntity(any())).thenReturn(game);
        when(entityQueryUtils.findDifficultyLevelEntity(any())).thenReturn(difficultyLevel);
        when(entityQueryUtils.findServiceTypeEntity(any())).thenReturn(serviceType);
        when(priceConfigurationMapper.toPriceConfigurationEntity(request)).thenReturn(entity);

        // When
        PriceConfigurationEntity result = factory.createEntity(request);

        // Then
        assertNotNull(result);
        assertNotNull(result.getCalculationFormula());
        assertInstanceOf(FormulaFormulaEntity.class, result.getCalculationFormula());
    }

    @Test
    @DisplayName("Should handle updateEntity with different calculation types")
    void shouldHandleUpdateEntityWithDifferentCalculationTypes() {
        // Given
        var existingEntity = PriceConfigurationEntity.builder()
            .basePrice(1000)
            .calculationType("LINEAR")
            .build();

        var existingFormula = new LinearFormulaEntity();
        existingFormula.setPricePerLevel(100);
        existingEntity.setCalculationFormula(existingFormula);

        var request = new UpdatePriceConfigurationRequest();
        request.setGameId(game.getId());
        request.setDifficultyLevelId(difficultyLevel.getId());
        request.setServiceTypeId(serviceType.getId());
        request.setCalculationType(UpdatePriceConfigurationRequest.CalculationTypeEnum.RANGE);
        // Don't set pricePerLevel to test fallback logic
        request.setPricePerLevel(null);

        doNothing().when(entityValidationUtils).validateEntitiesExist(any(), any(), any());
        when(entityQueryUtils.findGameEntity(any())).thenReturn(game);
        when(entityQueryUtils.findDifficultyLevelEntity(any())).thenReturn(difficultyLevel);
        when(entityQueryUtils.findServiceTypeEntity(any())).thenReturn(serviceType);

        // When
        PriceConfigurationEntity result = factory.updateEntity(existingEntity, request);

        // Then
        assertNotNull(result);
        assertNotNull(result.getCalculationFormula());
        assertInstanceOf(RangeFormulaEntity.class, result.getCalculationFormula());
        // Should create new RangeFormulaEntity for RANGE type
    }
}
