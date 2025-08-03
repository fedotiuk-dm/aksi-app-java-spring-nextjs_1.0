package com.aksi.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.service.dto.ServiceItemInfo;
import com.aksi.service.order.OrderWizardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Controller for order wizard operations. TODO: Add these endpoints to OpenAPI specification */
@Slf4j
@RestController
@RequestMapping("/api/order-wizard")
@RequiredArgsConstructor
public class OrderWizardController {

  private final OrderWizardService orderWizardService;

  /**
   * Get available items for a service in order wizard This endpoint is critical for order creation
   * flow
   */
  @GetMapping("/services/{serviceId}/available-items")
  public ResponseEntity<List<ServiceItemInfo>> getAvailableItemsForService(
      @PathVariable UUID serviceId) {
    log.debug("Getting available items for service: {} in order wizard", serviceId);
    List<ServiceItemInfo> items = orderWizardService.getAvailableItemsForOrder(serviceId);
    return ResponseEntity.ok(items);
  }

  /** Get all service items (including unavailable) - useful for admin view */
  @GetMapping("/services/{serviceId}/all-items")
  public ResponseEntity<List<ServiceItemInfo>> getAllServiceItems(@PathVariable UUID serviceId) {
    log.debug("Getting all service items for service: {}", serviceId);
    List<ServiceItemInfo> items = orderWizardService.getAllServiceItems(serviceId);
    return ResponseEntity.ok(items);
  }

  // TODO: Uncomment when OrderWizardResponse is implemented
  // /** Start order wizard with pre-selected service */
  // @GetMapping("/start")
  // public ResponseEntity<OrderWizardService.OrderWizardResponse> startOrderWizard(
  //     @RequestParam UUID customerId, @RequestParam UUID serviceId, @RequestParam UUID branchId) {
  //   log.info(
  //       "Starting order wizard for customer: {}, service: {}, branch: {}",
  //       customerId,
  //       serviceId,
  //       branchId);
  //   OrderWizardService.OrderWizardResponse response =
  //       orderWizardService.startOrderWizard(customerId, serviceId, branchId);
  //   return ResponseEntity.ok(response);
  // }
}
