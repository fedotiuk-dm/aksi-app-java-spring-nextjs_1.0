package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.service.ServicesApi;
import com.aksi.api.service.dto.CreateServiceInfoRequest;
import com.aksi.api.service.dto.ListServicesResponse;
import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.api.service.dto.ServiceInfo;
import com.aksi.api.service.dto.UpdateServiceInfoRequest;
import com.aksi.service.catalog.ServiceCatalogService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for service catalog operations. Thin layer between OpenAPI and service with
 * logging.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class ServiceController implements ServicesApi {

  private final ServiceCatalogService serviceCatalogService;

  @Override
  public ResponseEntity<ServiceInfo> createService(CreateServiceInfoRequest createServiceRequest) {
    log.info("Creating new service with code: {}", createServiceRequest.getCode());
    ServiceInfo service = serviceCatalogService.createServiceAndReturnDto(createServiceRequest);
    log.info("Service created successfully with code: {}", createServiceRequest.getCode());
    return ResponseEntity.status(201).body(service);
  }

  @Override
  public ResponseEntity<ServiceInfo> getServiceById(UUID serviceId) {
    log.debug("Getting service by id: {}", serviceId);
    ServiceInfo service = serviceCatalogService.getServiceDtoById(serviceId);
    log.debug("Retrieved service details for id: {}", serviceId);
    return ResponseEntity.ok(service);
  }

  @Override
  public ResponseEntity<ListServicesResponse> listServices(
      Boolean active, @Nullable ServiceCategoryType category) {
    log.debug("Listing services with active: {}, category: {}", active, category);
    ListServicesResponse response = serviceCatalogService.listServicesDto(active, category);
    log.debug("Listed services successfully");
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<ServiceInfo> updateService(
      UUID serviceId, UpdateServiceInfoRequest updateServiceRequest) {
    log.info("Updating service with id: {}", serviceId);
    ServiceInfo service =
        serviceCatalogService.updateServiceAndReturnDto(serviceId, updateServiceRequest);
    log.info("Service updated successfully: {}", serviceId);
    return ResponseEntity.ok(service);
  }
}
