package com.aksi.service.order;

import java.util.UUID;

import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;

/**
 * Service for order item management Handles updates to order item characteristics, stains, defects,
 * and risks
 */
public interface OrderItemService {

  /**
   * Update order item characteristics
   *
   * @param orderId order ID
   * @param itemId item ID
   * @param request update request with characteristics, stains, defects, risks
   * @return updated order item information
   */
  OrderItemInfo updateCharacteristics(
      UUID orderId, UUID itemId, UpdateItemCharacteristicsRequest request);
}
