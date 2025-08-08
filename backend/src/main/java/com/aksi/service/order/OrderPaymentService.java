package com.aksi.service.order;

import java.util.UUID;

import com.aksi.api.order.dto.AddPaymentRequest;
import com.aksi.api.order.dto.PaymentInfo;

/** Service for order payment management Handles adding payments to orders */
public interface OrderPaymentService {

  /**
   * Add payment to order
   *
   * @param orderId order ID
   * @param request payment request with amount and method
   * @return added payment information
   */
  PaymentInfo addPayment(UUID orderId, AddPaymentRequest request);
}
