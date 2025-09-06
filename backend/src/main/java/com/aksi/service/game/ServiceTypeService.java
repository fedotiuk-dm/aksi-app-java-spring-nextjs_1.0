package com.aksi.service.game;

import java.util.UUID;

import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.ServiceType;
import com.aksi.api.game.dto.ServiceTypeListResponse;
import com.aksi.api.game.dto.UpdateServiceTypeRequest;

/**
 * Service interface for ServiceType operations. Combines read and write operations with proper
 * separation of concerns.
 */
public interface ServiceTypeService {

  // Create operations
  ServiceType createServiceType(CreateServiceTypeRequest request);

  // Read operations
  ServiceType getServiceTypeById(UUID serviceTypeId);

  ServiceTypeListResponse getServiceTypes(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      Boolean active,
      UUID gameId,
      String search);

  // Update operations
  ServiceType updateServiceType(UUID serviceTypeId, UpdateServiceTypeRequest request);

  // Delete operations
  void deleteServiceType(UUID serviceTypeId);

  /**
   * Set service type active status.
   */
  ServiceType setServiceTypeActive(UUID serviceTypeId, Boolean active);

  /**
   * Force delete a service type completely from database.
   * WARNING: This permanently removes the service type!
   * Use only for admin operations or data cleanup.
   */
  void forceDeleteServiceType(UUID serviceTypeId);

  /**
   * Activate a service type.
   */
  ServiceType activateServiceType(UUID serviceTypeId);

  /**
   * Deactivate a service type.
   */
  ServiceType deactivateServiceType(UUID serviceTypeId);
}
