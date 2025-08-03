package com.aksi.service.catalog;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aksi.api.service.dto.CreateServiceInfoRequest;
import com.aksi.api.service.dto.ListServicesResponse;
import com.aksi.api.service.dto.ServiceCategory;
import com.aksi.api.service.dto.ServiceInfo;
import com.aksi.api.service.dto.UpdateServiceInfoRequest;
import com.aksi.domain.catalog.ServiceCatalog;
import com.aksi.domain.catalog.ServiceCategoryType;

/** Service for managing service catalog */
public interface ServiceCatalogService {

  // Entity methods

  /**
   * Find service entity by ID
   *
   * @param id Service ID
   * @return Optional of service entity
   */
  Optional<ServiceCatalog> findById(UUID id);

  /**
   * List all service entities with optional filters
   *
   * @param active Filter by active status
   * @param category Filter by category
   * @param pageable Pagination parameters
   * @return Page of service entities
   */
  Page<ServiceCatalog> listServices(
      Boolean active, ServiceCategoryType category, Pageable pageable);

  /**
   * Create new service entity
   *
   * @param serviceCatalog Service entity to create
   * @return Created service entity
   */
  ServiceCatalog createService(ServiceCatalog serviceCatalog);

  /**
   * Update existing service entity
   *
   * @param serviceCatalog Service entity to update
   * @return Updated service entity
   */
  ServiceCatalog updateService(ServiceCatalog serviceCatalog);

  /**
   * Delete service
   *
   * @param serviceId Service ID
   */
  void deleteService(UUID serviceId);

  /**
   * Check if service code exists
   *
   * @param code Service code
   * @return true if exists
   */
  boolean existsByCode(String code);

  /**
   * Get service entities by category
   *
   * @param category Service category
   * @return List of service entities
   */
  List<ServiceCatalog> getServicesByCategory(ServiceCategoryType category);

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
  ListServicesResponse listServicesDto(Boolean active, ServiceCategory category);

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
