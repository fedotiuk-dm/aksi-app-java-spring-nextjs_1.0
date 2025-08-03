package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.service.ServiceItemsApi;
import com.aksi.api.service.dto.CreateServiceItemInfoRequest;
import com.aksi.api.service.dto.ListServiceItemsResponse;
import com.aksi.api.service.dto.ServiceItemInfo;
import com.aksi.api.service.dto.UpdateServiceItemInfoRequest;
import com.aksi.service.catalog.ServiceItemService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for service-item catalog operations. Thin layer between OpenAPI and service with
 * logging.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class ServiceItemController implements ServiceItemsApi {

  private final ServiceItemService serviceItemService;

  @Override
  public ResponseEntity<ServiceItemInfo> createServiceItem(
      CreateServiceItemInfoRequest createServiceItemRequest) {
    log.info(
        "Creating new service-item for service: {} and item: {}",
        createServiceItemRequest.getServiceId(),
        createServiceItemRequest.getItemId());
    ServiceItemInfo serviceItem = serviceItemService.createServiceItem(createServiceItemRequest);
    log.info("Service-item created successfully with id: {}", serviceItem.getId());
    return ResponseEntity.status(201).body(serviceItem);
  }

  @Override
  public ResponseEntity<ServiceItemInfo> getServiceItemById(UUID serviceItemId, UUID branchId) {
    log.debug("Getting service-item by id: {}, branchId: {}", serviceItemId, branchId);
    ServiceItemInfo serviceItem = serviceItemService.getServiceItemById(serviceItemId, branchId);
    log.debug("Retrieved service-item details for id: {}", serviceItemId);
    return ResponseEntity.ok(serviceItem);
  }

  @Override
  public ResponseEntity<ListServiceItemsResponse> listServiceItems(
      @Nullable UUID serviceId, @Nullable UUID itemId, @Nullable UUID branchId,
      Boolean active, Integer offset, Integer limit) {
    log.debug(
        "Listing service-items with serviceId: {}, itemId: {}, branchId: {}, active: {}, offset: {}, limit: {}",
        serviceId, itemId, branchId, active, offset, limit);
    return ResponseEntity.ok(serviceItemService.listServiceItems(serviceId, itemId, branchId, active, offset, limit));
  }

  @Override
  public ResponseEntity<ServiceItemInfo> updateServiceItem(
      UUID serviceItemId, UpdateServiceItemInfoRequest updateServiceItemRequest) {
    log.info("Updating service-item with id: {}", serviceItemId);
    ServiceItemInfo updatedServiceItem =
        serviceItemService.updateServiceItem(serviceItemId, updateServiceItemRequest);
    log.info("Service-item updated successfully with id: {}", serviceItemId);
    return ResponseEntity.ok(updatedServiceItem);
  }
}
