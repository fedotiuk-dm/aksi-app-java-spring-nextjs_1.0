package com.aksi.service.game.factory;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.ServiceType;
import com.aksi.api.game.dto.ServiceTypeListResponse;
import com.aksi.api.game.dto.UpdateServiceTypeRequest;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.mapper.ServiceTypeMapper;
import com.aksi.service.game.util.EntityQueryUtils;
import com.aksi.service.game.util.EntityValidationUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Factory for creating and managing ServiceType entities and DTOs. Reduces code duplication and
 * provides consistent entity creation patterns.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ServiceTypeFactory {

  private final ServiceTypeMapper serviceTypeMapper;
  private final EntityQueryUtils entityQueryUtils;
  private final EntityValidationUtils entityValidationUtils;

  /**
   * Create new ServiceType entity from request.
   *
   * @param request Create request
   * @return ServiceType entity
   */
  public ServiceTypeEntity createEntity(CreateServiceTypeRequest request) {
    log.debug("Creating ServiceType entity from request");

    // Validate game exists
    entityValidationUtils.validateGameExists(request.getGameId());

    ServiceTypeEntity entity = serviceTypeMapper.toServiceTypeEntity(request);

    // Set relationships
    entity.setGame(entityQueryUtils.findGameEntity(request.getGameId()));

    return entity;
  }

  /**
   * Update existing ServiceType entity from request.
   *
   * @param entity Existing entity
   * @param request Update request
   * @return Updated entity
   */
  public ServiceTypeEntity updateEntity(
      ServiceTypeEntity entity, UpdateServiceTypeRequest request) {

    log.debug("Updating ServiceType entity: {}", entity.getId());

    // Validate game exists if ID provided
    if (request.getGameId() != null) {
      entityValidationUtils.validateGameExists(request.getGameId());
    }

    // Update fields using MapStruct
    serviceTypeMapper.updateServiceTypeFromDto(request, entity);

    // Update relationships if ID provided
    if (request.getGameId() != null) {
      entity.setGame(entityQueryUtils.findGameEntity(request.getGameId()));
    }

    return entity;
  }

  /**
   * Convert entity to DTO.
   *
   * @param entity ServiceType entity
   * @return ServiceType DTO
   */
  public ServiceType toDto(ServiceTypeEntity entity) {
    return serviceTypeMapper.toServiceTypeDto(entity);
  }

  /**
   * Convert entity list to DTO list.
   *
   * @param entities List of entities
   * @return List of DTOs
   */
  public List<ServiceType> toDtoList(List<ServiceTypeEntity> entities) {
    return serviceTypeMapper.toServiceTypeDtoList(entities);
  }

  /**
   * Create ServiceTypeListResponse from Page.
   *
   * @param page Page of entities
   * @return List response
   */
  public ServiceTypeListResponse createListResponse(Page<ServiceTypeEntity> page) {
    List<ServiceType> dtos = toDtoList(page.getContent());

    return new ServiceTypeListResponse(
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
