package com.aksi.service.catalog;

import java.util.UUID;

import com.aksi.api.service.dto.CreateServiceInfoRequest;
import com.aksi.api.service.dto.ListServicesResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.api.service.dto.ServiceInfo;
import com.aksi.api.service.dto.UpdateServiceInfoRequest;

/** Service for managing service catalog */
public interface ServiceCatalogService {

  // DTO methods for controller

  /**
   * Get service DTO by ID
   *
   * @param serviceId Service ID
   * @return Service DTO
   */
  ServiceInfo getServiceDtoById(UUID serviceId);

  /**
   * List services and return DTO response
   *
   * @param active Filter by active status
   * @param category Filter by category
   * @return List services response
   */
  ListServicesResponse listServicesDto(Boolean active, ServiceCategoryType category);

  /**
   * Create service from request and return DTO
   *
   * @param request Create service request
   * @return Created service DTO
   */
  ServiceInfo createServiceAndReturnDto(CreateServiceInfoRequest request);

  /**
   * Update service from request and return DTO
   *
   * @param serviceId Service ID
   * @param request Update service request
   * @return Updated service DTO
   */
  ServiceInfo updateServiceAndReturnDto(UUID serviceId, UpdateServiceInfoRequest request);
}
