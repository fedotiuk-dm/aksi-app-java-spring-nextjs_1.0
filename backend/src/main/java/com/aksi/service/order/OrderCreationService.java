package com.aksi.service.order;

import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.OrderInfo;

/** Service for order creation operations Handles the creation of new orders from carts */
public interface OrderCreationService {

  /**
   * Create new order from cart
   *
   * @param request create order request with cart ID and branch ID
   * @return created order information
   */
  OrderInfo create(CreateOrderRequest request);
}
