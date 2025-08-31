package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.game.ServiceTypesApi;
import com.aksi.api.game.dto.CreateServiceTypeRequest;
import com.aksi.api.game.dto.ServiceType;
import com.aksi.api.game.dto.ServiceTypeListResponse;
import com.aksi.api.game.dto.UpdateServiceTypeRequest;
import com.aksi.service.game.ServiceTypeService;

import lombok.RequiredArgsConstructor;

/** REST controller for service type operations */
@RestController
@RequiredArgsConstructor
public class ServiceTypesController implements ServiceTypesApi {

  private final ServiceTypeService serviceTypeService;

  @Override
  public ResponseEntity<ServiceType> createServiceType(
      CreateServiceTypeRequest createServiceTypeRequest) {

    ServiceType result = serviceTypeService.createServiceType(createServiceTypeRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(result);
  }

  @Override
  public ResponseEntity<Void> deleteServiceType(UUID serviceTypeId) {
    serviceTypeService.deleteServiceType(serviceTypeId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<ServiceType> getServiceTypeById(UUID serviceTypeId) {
    ServiceType result = serviceTypeService.getServiceTypeById(serviceTypeId);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<ServiceTypeListResponse> listServiceTypes(
      Integer page, Integer size, @Nullable UUID gameId, @Nullable Boolean active) {

    ServiceTypeListResponse result =
        serviceTypeService.getServiceTypes(page, size, null, "asc", active, gameId, null);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<ServiceType> updateServiceType(
      UUID serviceTypeId, UpdateServiceTypeRequest updateServiceTypeRequest) {

    ServiceType result =
        serviceTypeService.updateServiceType(serviceTypeId, updateServiceTypeRequest);
    return ResponseEntity.ok(result);
  }
}
