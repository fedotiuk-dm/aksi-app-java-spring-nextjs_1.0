package com.aksi.service.order;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.ServiceItemInfo;
import com.aksi.service.catalog.ServiceItemService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for order wizard functionality.
 * Demonstrates usage of ServiceItemService methods for order creation flow.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class OrderWizardService {

  private final ServiceItemService serviceItemService;

  /**
   * Get available items for selected service in order wizard
   * This method demonstrates usage of getAvailableItemsForService
   * 
   * @param serviceId Selected service ID
   * @return List of available items for ordering
   */
  public List<ServiceItemInfo> getAvailableItemsForOrder(UUID serviceId) {
    log.debug("Getting available items for service: {} in order wizard", serviceId);
    
    // This is the critical method for order wizard
    // When user selects a service, we show only items that are:
    // - Active
    // - Available for order
    List<ServiceItemInfo> availableItems = serviceItemService.getAvailableItemsForService(serviceId);
    
    log.info("Found {} available items for service: {}", availableItems.size(), serviceId);
    return availableItems;
  }

  /**
   * Get all service-items for a service (including unavailable)
   * This method demonstrates usage of getServiceItemsByService
   * Used in admin panel or for showing all options with availability status
   * 
   * @param serviceId Service ID
   * @return All service-items for the service
   */
  public List<ServiceItemInfo> getAllServiceItems(UUID serviceId) {
    log.debug("Getting all service items for service: {}", serviceId);
    
    // This shows ALL items for a service, not just available ones
    // Useful for admin view or showing items with "out of stock" status
    List<ServiceItemInfo> allItems = serviceItemService.getServiceItemsByService(serviceId);
    
    log.info("Found {} total items for service: {}", allItems.size(), serviceId);
    return allItems;
  }

  /**
   * Example of order wizard flow
   */
  public OrderWizardResponse startOrderWizard(UUID customerId, UUID serviceId, UUID branchId) {
    log.info("Starting order wizard for customer: {}, service: {}, branch: {}", 
        customerId, serviceId, branchId);
    
    // Step 1: Get available items for the selected service
    List<ServiceItemInfo> availableItems = getAvailableItemsForOrder(serviceId);
    
    // Step 2: Filter by branch if needed (future enhancement)
    // In real implementation, might filter by branch-specific availability
    
    // Step 3: Sort by popularity or price
    List<ServiceItemInfo> sortedItems = availableItems.stream()
        .sorted((a, b) -> a.getSortOrder().compareTo(b.getSortOrder()))
        .collect(Collectors.toList());
    
    return OrderWizardResponse.builder()
        .serviceId(serviceId)
        .branchId(branchId)
        .availableItems(sortedItems)
        .totalAvailableItems(sortedItems.size())
        .build();
  }

  /**
   * Response DTO for order wizard
   */
  @lombok.Data
  @lombok.Builder
  public static class OrderWizardResponse {
    private UUID serviceId;
    private UUID branchId;
    private List<ServiceItemInfo> availableItems;
    private int totalAvailableItems;
  }
}