package com.aksi.service.order;

import java.util.UUID;

import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;

/** Service for order status management Handles status transitions and related business rules */
public interface OrderStatusService {

  /**
   * Update order status
   *
   * @param orderId order ID
   * @param request status update request
   * @return updated order information
   */
  OrderInfo updateStatus(UUID orderId, UpdateOrderStatusRequest request);
}
