package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aksi.api.service.dto.CreateServiceItemInfoRequest;
import com.aksi.api.service.dto.ServiceItemInfo;
import com.aksi.api.service.dto.UpdateServiceItemInfoRequest;

/** Service for managing service-item combinations with pricing */
public interface ServiceItemService {

  /**
   * List all service-item combinations with optional filters
   *
   * @param serviceId Filter by service
   * @param itemId Filter by item
   * @param branchId Get branch-specific pricing
   * @param active Filter by active status
   * @param pageable Pagination parameters
   * @return Page of service-item combinations
   */
  Page<ServiceItemInfo> listServiceItems(
      UUID serviceId, UUID itemId, UUID branchId, Boolean active, Pageable pageable);

  /**
   * Get service-item combination by ID
   *
   * @param serviceItemId Service-item ID
   * @param branchId Optional branch ID for branch-specific pricing
   * @return Service-item details
   */
  ServiceItemInfo getServiceItemById(UUID serviceItemId, UUID branchId);

  /**
   * Create new service-item combination
   *
   * @param request Create service-item request
   * @return Created service-item
   */
  ServiceItemInfo createServiceItem(CreateServiceItemInfoRequest request);

  /**
   * Update existing service-item combination
   *
   * @param serviceItemId Service-item ID
   * @param request Update service-item request
   * @return Updated service-item
   */
  ServiceItemInfo updateServiceItem(UUID serviceItemId, UpdateServiceItemInfoRequest request);

  /**
   * Delete service-item combination
   *
   * @param serviceItemId Service-item ID
   */
  void deleteServiceItem(UUID serviceItemId);

  /**
   * Check if service-item combination exists
   *
   * @param serviceId Service ID
   * @param itemId Item ID
   * @return true if exists
   */
  boolean existsByServiceAndItem(UUID serviceId, UUID itemId);

  /**
   * Get service-items by service
   *
   * @param serviceId Service ID
   * @return List of service-items
   */
  List<ServiceItemInfo> getServiceItemsByService(UUID serviceId);

  /**
   * Get service-items by item
   *
   * @param itemId Item ID
   * @return List of service-items
   */
  List<ServiceItemInfo> getServiceItemsByItem(UUID itemId);

  /**
   * Get available items for a service
   *
   * @param serviceId Service ID
   * @return List of available service-items
   */
  List<ServiceItemInfo> getAvailableItemsForService(UUID serviceId);
}
