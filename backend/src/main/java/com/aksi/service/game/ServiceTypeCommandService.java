package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.ServiceType;
import com.aksi.api.game.dto.UpdateServiceTypeRequest;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.ServiceTypeMapper;
import com.aksi.repository.ServiceTypeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for service type-related write operations. All methods are write-only and
 * optimized for creating, updating, and deleting service types.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ServiceTypeCommandService {

  private final ServiceTypeRepository serviceTypeRepository;
  private final ServiceTypeMapper serviceTypeMapper;
  private final ServiceTypeValidationService validationService;
  private final GameQueryService gameQueryService;

  /**
   * Create a new service type.
   *
   * @param request Create service type request
   * @return Created service type
   * @throws ConflictException if service type with same code already exists
   * @throws NotFoundException if game not found
   */
  public ServiceType createServiceType(CreateServiceTypeRequest request) {
    log.info("Creating service type with code: {}", request.getCode());

    // Validate request
    validationService.validateForCreate(request);

    // Find required entities using utility
    GameEntity game = gameQueryService.findGameEntityById(request.getGameId());

    // Create entity
    ServiceTypeEntity entity = serviceTypeMapper.toServiceTypeEntity(request);
    entity.setGame(game);

    ServiceTypeEntity savedEntity = serviceTypeRepository.save(entity);
    log.info("Created service type with id: {}", savedEntity.getId());

    return serviceTypeMapper.toServiceTypeDto(savedEntity);
  }

  /**
   * Update an existing service type.
   *
   * @param serviceTypeId Service type ID
   * @param request Update service type request
   * @return Updated service type
   * @throws NotFoundException if service type not found
   * @throws ConflictException if code conflict with another service type
   */
  public ServiceType updateServiceType(UUID serviceTypeId, UpdateServiceTypeRequest request) {
    log.info("Updating service type with id: {}", serviceTypeId);

    // Validate request
    validationService.validateForUpdate(serviceTypeId, request);

    // Get existing entity
    ServiceTypeEntity existingEntity =
        serviceTypeRepository
            .findById(serviceTypeId)
            .orElseThrow(
                () -> new NotFoundException("Service type not found with id: " + serviceTypeId));

    // Find required entities using utility
    GameEntity game = gameQueryService.findGameEntityById(request.getGameId());

    // Update fields
    existingEntity.setGame(game);
    existingEntity.setCode(request.getCode());
    existingEntity.setName(request.getName());
    existingEntity.setDescription(request.getDescription());
    existingEntity.setActive(request.getActive());
    existingEntity.setSortOrder(request.getSortOrder());

    ServiceTypeEntity savedEntity = serviceTypeRepository.save(existingEntity);
    log.info("Updated service type with id: {}", savedEntity.getId());

    return serviceTypeMapper.toServiceTypeDto(savedEntity);
  }

  /**
   * Soft delete a service type by setting it as inactive.
   *
   * @param serviceTypeId Service type ID
   * @throws NotFoundException if service type not found
   */
  public void deleteServiceType(UUID serviceTypeId) {
    log.info("Deleting service type with id: {}", serviceTypeId);

    ServiceTypeEntity entity =
        serviceTypeRepository
            .findById(serviceTypeId)
            .orElseThrow(
                () -> new NotFoundException("Service type not found with id: " + serviceTypeId));

    entity.setActive(false);
    serviceTypeRepository.save(entity);

    log.info("Deleted service type with id: {}", serviceTypeId);
  }

  /**
   * Restore a soft deleted service type by setting it as active.
   *
   * @param serviceTypeId Service type ID
   * @return Restored service type
   * @throws NotFoundException if service type not found
   */
  public ServiceType restoreServiceType(UUID serviceTypeId) {
    log.info("Restoring service type with id: {}", serviceTypeId);

    ServiceTypeEntity entity =
        serviceTypeRepository
            .findById(serviceTypeId)
            .orElseThrow(
                () -> new NotFoundException("Service type not found with id: " + serviceTypeId));

    entity.setActive(true);
    ServiceTypeEntity savedEntity = serviceTypeRepository.save(entity);

    log.info("Restored service type with id: {}", serviceTypeId);

    return serviceTypeMapper.toServiceTypeDto(savedEntity);
  }

  /**
   * Activate a service type.
   *
   * @param serviceTypeId Service type ID
   * @return Updated service type
   */
  public ServiceType activateServiceType(UUID serviceTypeId) {
    log.info("Activating service type: {}", serviceTypeId);

    ServiceTypeEntity entity =
        serviceTypeRepository
            .findById(serviceTypeId)
            .orElseThrow(() -> new NotFoundException("Service type not found: " + serviceTypeId));

    entity.setActive(true);
    ServiceTypeEntity saved = serviceTypeRepository.save(entity);

    log.info("Activated service type: {}", serviceTypeId);
    return serviceTypeMapper.toServiceTypeDto(saved);
  }

  /**
   * Deactivate a service type.
   *
   * @param serviceTypeId Service type ID
   * @return Updated service type
   */
  public ServiceType deactivateServiceType(UUID serviceTypeId) {
    log.info("Deactivating service type: {}", serviceTypeId);

    ServiceTypeEntity entity =
        serviceTypeRepository
            .findById(serviceTypeId)
            .orElseThrow(() -> new NotFoundException("Service type not found: " + serviceTypeId));

    entity.setActive(false);
    ServiceTypeEntity saved = serviceTypeRepository.save(entity);

    log.info("Deactivated service type: {}", serviceTypeId);
    return serviceTypeMapper.toServiceTypeDto(saved);
  }
}
