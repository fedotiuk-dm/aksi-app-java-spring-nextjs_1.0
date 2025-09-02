package com.aksi.service.game.factory;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.PriceConfigurationListResponse;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;
import com.aksi.domain.game.PriceConfigurationEntity;
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

    // Validate entities exist
    entityValidationUtils.validateEntitiesExist(
        request.getGameId(), request.getDifficultyLevelId(), request.getServiceTypeId());

    PriceConfigurationEntity entity = priceConfigurationMapper.toPriceConfigurationEntity(request);

    // Set relationships
    entity.setGame(entityQueryUtils.findGameEntity(request.getGameId()));
    entity.setDifficultyLevel(
        entityQueryUtils.findDifficultyLevelEntity(request.getDifficultyLevelId()));
    entity.setServiceType(entityQueryUtils.findServiceTypeEntity(request.getServiceTypeId()));

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

    // Validate entities exist (all IDs are required in UpdatePriceConfigurationRequest)
    entityValidationUtils.validateEntitiesExist(
        request.getGameId(), request.getDifficultyLevelId(), request.getServiceTypeId());

    // Update fields using MapStruct
    priceConfigurationMapper.updatePriceConfigurationFromDto(request, entity);

    // Update relationships (all IDs are required)
    entity.setGame(entityQueryUtils.findGameEntity(request.getGameId()));
    entity.setDifficultyLevel(
        entityQueryUtils.findDifficultyLevelEntity(request.getDifficultyLevelId()));
    entity.setServiceType(entityQueryUtils.findServiceTypeEntity(request.getServiceTypeId()));

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
