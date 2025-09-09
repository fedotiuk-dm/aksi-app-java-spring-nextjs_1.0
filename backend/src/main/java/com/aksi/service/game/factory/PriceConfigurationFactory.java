package com.aksi.service.game.factory;

import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.PriceConfigurationListResponse;
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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Factory for creating and managing PriceConfiguration entities and DTOs. Reduces code duplication
 * and provides consistent entity creation patterns.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PriceConfigurationFactory {

  private final PriceConfigurationMapper priceConfigurationMapper;
  private final EntityQueryUtils entityQueryUtils;
  private final EntityValidationUtils entityValidationUtils;

  /**
   * Create new PriceConfiguration entity from request.
   *
   * @param request Create request
   * @return PriceConfiguration entity
   */
  public PriceConfigurationEntity createEntity(CreatePriceConfigurationRequest request) {
    log.debug("Creating PriceConfiguration entity from request");

    // Validate entities exist and get them
    GameEntity game = entityQueryUtils.findGameEntity(request.getGameId());
    DifficultyLevelEntity difficultyLevel = entityQueryUtils.findDifficultyLevelEntity(request.getDifficultyLevelId());
    ServiceTypeEntity serviceType = entityQueryUtils.findServiceTypeEntity(request.getServiceTypeId());

    PriceConfigurationEntity entity = priceConfigurationMapper.toPriceConfigurationEntity(request);

    // Set JPA relationship fields
    entity.setGame(game);
    entity.setDifficultyLevel(difficultyLevel);
    entity.setServiceType(serviceType);

    // Initialize calculationFormula based on calculationType or create fallback
    if (entity.getCalculationFormula() == null) {
      String calculationTypeValue = entity.getCalculationType();
      if (calculationTypeValue != null) {
        log.debug("Initializing calculationFormula for entity calculationType: {}", calculationTypeValue);
        switch (calculationTypeValue) {
          case "LINEAR" -> {
            LinearFormulaEntity linearFormula = new LinearFormulaEntity();
            Integer pricePerLevel = request.getPricePerLevel();
            linearFormula.setPricePerLevel(pricePerLevel != null ? pricePerLevel : 0);
            entity.setCalculationFormula(linearFormula);
            log.debug("Created LinearFormulaEntity with pricePerLevel: {}", linearFormula.getPricePerLevel());
          }
          case "FIXED" -> {
            LinearFormulaEntity fixedFormula = new LinearFormulaEntity();
            Integer pricePerLevel = request.getPricePerLevel();
            fixedFormula.setPricePerLevel(pricePerLevel != null ? pricePerLevel : 0);
            entity.setCalculationFormula(fixedFormula);
            log.debug("Created Fixed LinearFormulaEntity with pricePerLevel: {}", fixedFormula.getPricePerLevel());
          }
          case "RANGE" -> {
            RangeFormulaEntity rangeFormula = new RangeFormulaEntity();
            entity.setCalculationFormula(rangeFormula);
            log.debug("Created RangeFormulaEntity");
          }
          case "TIME_BASED" -> {
            TimeBasedFormulaEntity timeFormula = new TimeBasedFormulaEntity();
            entity.setCalculationFormula(timeFormula);
            log.debug("Created TimeBasedFormulaEntity");
          }
          case "FORMULA" -> {
            FormulaFormulaEntity formulaFormula = new FormulaFormulaEntity();
            entity.setCalculationFormula(formulaFormula);
            log.debug("Created FormulaFormulaEntity");
          }
          default -> {
            log.warn("Unknown calculationType: {}, creating default LinearFormulaEntity", calculationTypeValue);
            LinearFormulaEntity defaultFormula = new LinearFormulaEntity();
            defaultFormula.setPricePerLevel(0);
            entity.setCalculationFormula(defaultFormula);
            log.debug("Created fallback LinearFormulaEntity with pricePerLevel: 0 for unknown type");
          }
        }
      } else {
        // Fallback for null calculationType
        log.debug("CalculationType is null, creating fallback LinearFormulaEntity");
        LinearFormulaEntity fallbackFormula = new LinearFormulaEntity();
        fallbackFormula.setPricePerLevel(0);
        entity.setCalculationFormula(fallbackFormula);
        log.debug("Created fallback LinearFormulaEntity with pricePerLevel: 0");
      }
    }

    return entity;
  }

  /**
   * Update existing PriceConfiguration entity from request.
   *
   * @param entity Existing entity
   * @param request Update request
   * @return Updated entity
   */
  public PriceConfigurationEntity updateEntity(
      PriceConfigurationEntity entity, UpdatePriceConfigurationRequest request) {

    log.debug("Updating PriceConfiguration entity: {}", entity.getId());

    // Store original calculationType to detect changes
    String originalCalculationType = entity.getCalculationType();

    // Validate entities exist (all IDs are required in UpdatePriceConfigurationRequest)
    entityValidationUtils.validateEntitiesExist(
        request.getGameId(), request.getDifficultyLevelId(), request.getServiceTypeId());

    // Update fields using MapStruct
    priceConfigurationMapper.updatePriceConfigurationFromDto(request, entity);

    // Manually update calculationType from request
    var calculationType = request.getCalculationType();
    if (calculationType != null) {
        entity.setCalculationType(calculationType.getValue());
    }

    // Check if calculationType changed and reinitialize calculationFormula if needed
    String newCalculationType = entity.getCalculationType();
    boolean calculationTypeChanged = !Objects.equals(originalCalculationType, newCalculationType);
    log.debug("CalculationType change detection: original={}, new={}, changed={}",
        originalCalculationType, newCalculationType, calculationTypeChanged);

    // Update JPA relationship fields (all IDs are required)
    GameEntity game = entityQueryUtils.findGameEntity(request.getGameId());
    DifficultyLevelEntity difficultyLevel = entityQueryUtils.findDifficultyLevelEntity(request.getDifficultyLevelId());
    ServiceTypeEntity serviceType = entityQueryUtils.findServiceTypeEntity(request.getServiceTypeId());

    entity.setGame(game);
    entity.setDifficultyLevel(difficultyLevel);
    entity.setServiceType(serviceType);

    // Initialize calculationFormula based on calculationType or create fallback
    // Always reinitialize if calculationFormula is null OR calculationType changed
    log.debug("Formula reinitialization check: formula is null={}, calculationTypeChanged={}, will reinitialize={}",
        entity.getCalculationFormula() == null, calculationTypeChanged, entity.getCalculationFormula() == null || calculationTypeChanged);
    if (entity.getCalculationFormula() == null || calculationTypeChanged) {
      // Remove existing calculationFormula if type changed
      if (calculationTypeChanged && entity.getCalculationFormula() != null) {
        log.debug("CalculationType changed from {} to {}, removing old formula", originalCalculationType, newCalculationType);
        entity.setCalculationFormula(null);
      }
      String calculationTypeValue = entity.getCalculationType();
      if (calculationTypeValue != null) {
        log.debug("Initializing calculationFormula for update with entity calculationType: {}", calculationTypeValue);
        switch (calculationTypeValue) {
          case "LINEAR" -> {
            LinearFormulaEntity linearFormula = new LinearFormulaEntity();
            Integer pricePerLevel = request.getPricePerLevel();
            linearFormula.setPricePerLevel(pricePerLevel != null ? pricePerLevel : 0);
            entity.setCalculationFormula(linearFormula);
            log.debug("Created LinearFormulaEntity for update with pricePerLevel: {}", linearFormula.getPricePerLevel());
          }
          case "FIXED" -> {
            LinearFormulaEntity fixedFormula = new LinearFormulaEntity();
            Integer pricePerLevel = request.getPricePerLevel();
            fixedFormula.setPricePerLevel(pricePerLevel != null ? pricePerLevel : 0);
            entity.setCalculationFormula(fixedFormula);
            log.debug("Created Fixed LinearFormulaEntity for update with pricePerLevel: {}", fixedFormula.getPricePerLevel());
          }
          case "RANGE" -> {
            RangeFormulaEntity rangeFormula = new RangeFormulaEntity();
            entity.setCalculationFormula(rangeFormula);
            log.debug("Created RangeFormulaEntity for update");
          }
          case "TIME_BASED" -> {
            TimeBasedFormulaEntity timeFormula = new TimeBasedFormulaEntity();
            entity.setCalculationFormula(timeFormula);
            log.debug("Created TimeBasedFormulaEntity for update");
          }
          case "FORMULA" -> {
            FormulaFormulaEntity formulaFormula = new FormulaFormulaEntity();
            entity.setCalculationFormula(formulaFormula);
            log.debug("Created FormulaFormulaEntity for update");
          }
          default -> {
            log.warn("Unknown calculationType for update: {}, creating default LinearFormulaEntity", calculationTypeValue);
            LinearFormulaEntity defaultFormula = new LinearFormulaEntity();
            defaultFormula.setPricePerLevel(0);
            entity.setCalculationFormula(defaultFormula);
            log.debug("Created fallback LinearFormulaEntity for update with pricePerLevel: 0");
          }
        }
      } else {
        // Fallback for null calculationType in update
        log.debug("CalculationType is null in update, creating fallback LinearFormulaEntity");
        LinearFormulaEntity fallbackFormula = new LinearFormulaEntity();
        fallbackFormula.setPricePerLevel(0);
        entity.setCalculationFormula(fallbackFormula);
        log.debug("Created fallback LinearFormulaEntity for update with pricePerLevel: 0");
      }
    }

    return entity;
  }

  /**
   * Convert entity to DTO.
   *
   * @param entity PriceConfiguration entity
   * @return PriceConfiguration DTO
   */
  public PriceConfiguration toDto(PriceConfigurationEntity entity) {
    return priceConfigurationMapper.toPriceConfigurationDto(entity);
  }

  /**
   * Convert entity list to DTO list.
   *
   * @param entities List of entities
   * @return List of DTOs
   */
  public List<PriceConfiguration> toDtoList(List<PriceConfigurationEntity> entities) {
    return priceConfigurationMapper.toPriceConfigurationDtoList(entities);
  }

  /**
   * Create PriceConfigurationListResponse from Page.
   *
   * @param page Page of entities
   * @return List response
   */
  public PriceConfigurationListResponse createListResponse(Page<PriceConfigurationEntity> page) {
    List<PriceConfiguration> dtos = toDtoList(page.getContent());

    return new PriceConfigurationListResponse(
        dtos,
        page.getTotalElements(),
        page.getTotalPages(),
        page.getSize(),
        page.getNumber(),
        page.getNumberOfElements(),
        page.isFirst(),
        page.isLast(),
        page.isEmpty());
  }
}
