package com.aksi.service.game;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.ServiceType;
import com.aksi.api.game.dto.ServiceTypeListResponse;
import com.aksi.api.game.dto.UpdateServiceTypeRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for ServiceType operations. Delegates to specialized command and query
 * services for proper separation of concerns.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ServiceTypeServiceImpl implements ServiceTypeService {

  private final ServiceTypeCommandService commandService;
  private final ServiceTypeQueryService queryService;

  // Create operations

  @Override
  public ServiceType createServiceType(CreateServiceTypeRequest request) {
    log.info("Creating service type: {}", request.getCode());
    return commandService.createServiceType(request);
  }

  // Read operations

  @Override
  @Transactional(readOnly = true)
  public ServiceType getServiceTypeById(UUID serviceTypeId) {
    return queryService.getServiceTypeById(serviceTypeId);
  }

  @Override
  @Transactional(readOnly = true)
  public ServiceTypeListResponse getServiceTypes(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      Boolean active,
      UUID gameId,
      String search) {

    return queryService.getServiceTypes(page, size, sortBy, sortOrder, active, gameId, search);
  }

  // Update operations

  @Override
  public ServiceType updateServiceType(UUID serviceTypeId, UpdateServiceTypeRequest request) {
    log.info("Updating service type: {}", serviceTypeId);
    return commandService.updateServiceType(serviceTypeId, request);
  }

  // Delete operations

  @Override
  public void deleteServiceType(UUID serviceTypeId) {
    log.info("Deleting service type: {}", serviceTypeId);
    commandService.deleteServiceType(serviceTypeId);
  }
}
