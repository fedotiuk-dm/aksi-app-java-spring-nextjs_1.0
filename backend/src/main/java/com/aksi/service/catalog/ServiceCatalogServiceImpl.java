package com.aksi.service.catalog;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.CreateServiceInfoRequest;
import com.aksi.api.service.dto.ListServicesResponse;
import com.aksi.api.service.dto.ServiceCategory;
import com.aksi.api.service.dto.ServiceInfo;
import com.aksi.api.service.dto.UpdateServiceInfoRequest;
import com.aksi.domain.catalog.ServiceCatalog;
import com.aksi.domain.catalog.ServiceCategoryType;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.catalog.ServiceCatalogMapper;
import com.aksi.repository.catalog.ServiceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of ServiceCatalogService */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ServiceCatalogServiceImpl implements ServiceCatalogService {

  private final ServiceRepository serviceRepository;
  private final ServiceCatalogMapper serviceCatalogMapper;

  // Entity methods

  @Override
  @Transactional(readOnly = true)
  public Optional<ServiceCatalog> findById(UUID id) {
    return serviceRepository.findById(id);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<ServiceCatalog> listServices(
      Boolean active, ServiceCategoryType category, Pageable pageable) {

    log.debug("Listing service entities with active: {}, category: {}", active, category);

    if (active != null && active && category != null) {
      return serviceRepository.findByCategoryAndActiveTrue(category, pageable);
    } else if (active != null && active) {
      return serviceRepository.findByActiveTrue(pageable);
    } else {
      return serviceRepository.findAll(pageable);
    }
  }

  @Override
  public ServiceCatalog createService(ServiceCatalog serviceCatalog) {
    log.debug("Creating new service entity with code: {}", serviceCatalog.getCode());

    // Check if code already exists
    if (serviceRepository.existsByCode(serviceCatalog.getCode())) {
      throw new ConflictException("Service with code already exists: " + serviceCatalog.getCode());
    }

    ServiceCatalog saved = serviceRepository.save(serviceCatalog);
    log.info("Created new service entity with id: {}", saved.getId());

    return saved;
  }

  @Override
  public ServiceCatalog updateService(ServiceCatalog serviceCatalog) {
    log.debug("Updating service entity with id: {}", serviceCatalog.getId());

    ServiceCatalog updated = serviceRepository.save(serviceCatalog);
    log.info("Updated service entity with id: {}", updated.getId());

    return updated;
  }

  @Override
  public void deleteService(UUID serviceId) {
    log.debug("Deleting service with id: {}", serviceId);

    if (!serviceRepository.existsById(serviceId)) {
      throw new NotFoundException("Service not found with id: " + serviceId);
    }

    serviceRepository.deleteById(serviceId);
    log.info("Deleted service with id: {}", serviceId);
  }

  @Override
  @Transactional(readOnly = true)
  public boolean existsByCode(String code) {
    return serviceRepository.existsByCode(code);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ServiceCatalog> getServicesByCategory(ServiceCategoryType category) {
    log.debug("Getting services by category: {}", category);

    Page<ServiceCatalog> services =
        serviceRepository.findByCategoryAndActiveTrue(category, Pageable.unpaged());

    return services.getContent();
  }

  // DTO methods for controller

  @Override
  @Transactional(readOnly = true)
  public ServiceInfo getServiceDtoById(UUID serviceId) {
    log.debug("Getting service DTO by id: {}", serviceId);

    ServiceCatalog serviceCatalog =
        serviceRepository
            .findById(serviceId)
            .orElseThrow(() -> new NotFoundException("Service not found with id: " + serviceId));

    return serviceCatalogMapper.toServiceResponse(serviceCatalog);
  }

  @Override
  @Transactional(readOnly = true)
  public ListServicesResponse listServicesDto(Boolean active, ServiceCategory category) {
    log.debug("Listing services DTO with active: {}, category: {}", active, category);

    // Create pageable with default values
    Pageable pageable = PageRequest.of(0, 100, Sort.by("sortOrder").ascending());

    // Convert ServiceCategory to ServiceCategoryType if provided
    ServiceCategoryType categoryType = null;
    if (category != null) {
      categoryType = mapServiceCategoryToType(category);
    }

    Page<ServiceCatalog> servicesPage = listServices(active, categoryType, pageable);

    return serviceCatalogMapper.toServiceListResponse(servicesPage.getContent());
  }

  @Override
  public ServiceInfo createServiceAndReturnDto(CreateServiceInfoRequest request) {
    log.debug("Creating service from request with code: {}", request.getCode());

    ServiceCatalog serviceCatalog = serviceCatalogMapper.toEntity(request);
    serviceCatalog.setActive(true);

    ServiceCatalog saved = createService(serviceCatalog);

    return serviceCatalogMapper.toServiceResponse(saved);
  }

  @Override
  public ServiceInfo updateServiceAndReturnDto(UUID serviceId, UpdateServiceInfoRequest request) {
    log.debug("Updating service from request with id: {}", serviceId);

    ServiceCatalog serviceCatalog =
        serviceRepository
            .findById(serviceId)
            .orElseThrow(() -> new NotFoundException("Service not found with id: " + serviceId));

    serviceCatalogMapper.updateEntityFromDto(request, serviceCatalog);

    ServiceCatalog updated = updateService(serviceCatalog);

    return serviceCatalogMapper.toServiceResponse(updated);
  }

  /** Maps ServiceCategory to ServiceCategoryType */
  private ServiceCategoryType mapServiceCategoryToType(ServiceCategory category) {
    return switch (category) {
      case DRY_CLEANING -> ServiceCategoryType.CLOTHING;
      case WASHING -> ServiceCategoryType.LAUNDRY;
      case IRONING -> ServiceCategoryType.IRONING;
      case DYEING -> ServiceCategoryType.DYEING;
      case SPECIAL -> ServiceCategoryType.LEATHER;
      case REPAIR, OTHER -> ServiceCategoryType.ADDITIONAL_SERVICES;
    };
  }
}
