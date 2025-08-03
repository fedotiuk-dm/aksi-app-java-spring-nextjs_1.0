package com.aksi.service.catalog;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.aksi.api.service.dto.CreateServiceItemInfoRequest;
import com.aksi.api.service.dto.ListServiceItemsResponse;
import com.aksi.api.service.dto.ServiceItemInfo;
import com.aksi.api.service.dto.UpdateServiceItemInfoRequest;

/** Service for managing service-item combinations with pricing */
public interface ServiceItemService {

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
   * List service items with response DTO
   *
   * @param serviceId Filter by service
   * @param itemId Filter by item
   * @param branchId Get branch-specific pricing
   * @param active Filter by active status
   * @param offset Number of items to skip
   * @param limit Number of items to return
   * @return Service items response
   */
  ListServiceItemsResponse listServiceItems(
      UUID serviceId, UUID itemId, UUID branchId, Boolean active, Integer offset, Integer limit);

  // Internal methods for business logic - essential for order processing

  /**
   * Get all service-items for a specific service Used in OrderWizardService.getAllServiceItems()
   * for admin view Endpoint: GET /api/order-wizard/services/{serviceId}/all-items
   *
   * @param serviceId Service ID
   * @return List of service-items
   */
  List<ServiceItemInfo> getServiceItemsByService(UUID serviceId);

  /**
   * Get all service-items for a specific item Used in PriceListServiceImpl.synchronizePrices() for
   * price updates
   *
   * @param itemId Item ID
   * @return List of service-items
   */
  List<ServiceItemInfo> getServiceItemsByItem(UUID itemId);

  /**
   * Get available items for a service (active and available for order) Critical for order wizard
   * functionality Used in OrderWizardService.getAvailableItemsForOrder() Endpoint: GET
   * /api/order-wizard/services/{serviceId}/available-items
   *
   * @param serviceId Service ID
   * @return List of available service-items
   */
  List<ServiceItemInfo> getAvailableItemsForService(UUID serviceId);

  /**
   * Update service item prices from price list Used in PriceListServiceImpl.synchronizePrices()
   * during price synchronization Called from admin endpoint: POST /api/admin/price-list/sync
   *
   * @param serviceItemId Service item ID
   * @param basePrice New base price
   * @param priceBlack New black price (optional)
   * @param priceColor New color price (optional)
   * @return true if prices were updated
   */
  boolean updateServiceItemPrices(
      UUID serviceItemId, BigDecimal basePrice, BigDecimal priceBlack, BigDecimal priceColor);
}
