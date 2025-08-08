package com.aksi.service.order;

import java.util.UUID;

import com.aksi.api.order.dto.OrderInfo;

/** Service for order signature management Handles customer signature operations */
public interface OrderSignatureService {

  /**
   * Save customer signature for order
   *
   * @param orderId order ID
   * @param signatureBase64 signature in base64 format
   * @return updated order information
   */
  OrderInfo saveSignature(UUID orderId, String signatureBase64);
}
