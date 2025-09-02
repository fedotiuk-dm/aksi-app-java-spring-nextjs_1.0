package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.ServiceType;
import com.aksi.api.game.dto.UpdateServiceTypeRequest;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.ServiceTypeRepository;
import com.aksi.service.game.factory.ServiceTypeFactory;

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
  private final ServiceTypeValidationService validationService;
  private final ServiceTypeFactory serviceTypeFactory;

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

    // Create entity using factory
    ServiceTypeEntity entity = serviceTypeFactory.createEntity(request);

    // Save entity
    ServiceTypeEntity savedEntity = serviceTypeRepository.save(entity);
    log.info("Created service type with id: {}", savedEntity.getId());

    return serviceTypeFactory.toDto(savedEntity);
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

    // Update entity using factory
    ServiceTypeEntity updatedEntity = serviceTypeFactory.updateEntity(existingEntity, request);

    // Save updated entity
    ServiceTypeEntity savedEntity = serviceTypeRepository.save(updatedEntity);
    log.info("Updated service type with id: {}", savedEntity.getId());

    return serviceTypeFactory.toDto(savedEntity);
  }

  /**
   * Delete a service type by setting it as inactive.
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
}
