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
  public ResponseEntity<ServiceType> gamesCreateServiceType(CreateServiceTypeRequest request) {
    ServiceType result = serviceTypeService.createServiceType(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(result);
  }

  @Override
  public ResponseEntity<Void> gamesDeleteServiceType(UUID serviceTypeId) {
    serviceTypeService.deleteServiceType(serviceTypeId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<ServiceType> gamesGetServiceTypeById(UUID serviceTypeId) {
    ServiceType result = serviceTypeService.getServiceTypeById(serviceTypeId);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<ServiceTypeListResponse> gamesListServiceTypes(
      Integer page, Integer size, @Nullable UUID gameId, @Nullable Boolean active) {
    ServiceTypeListResponse result = serviceTypeService.getServiceTypes(page, size, null, "asc", active, gameId, null);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<ServiceType> gamesUpdateServiceType(
      UUID serviceTypeId, UpdateServiceTypeRequest request) {
    ServiceType result = serviceTypeService.updateServiceType(serviceTypeId, request);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<ServiceType> gamesSetServiceTypeActive(UUID serviceTypeId, Boolean active) {
    ServiceType result = serviceTypeService.setServiceTypeActive(serviceTypeId, active);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<Void> gamesForceDeleteServiceType(UUID serviceTypeId) {
    serviceTypeService.forceDeleteServiceType(serviceTypeId);
    return ResponseEntity.noContent().build();
  }

}
