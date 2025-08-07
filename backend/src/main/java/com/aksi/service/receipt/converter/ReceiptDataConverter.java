package com.aksi.service.receipt.converter;

import com.aksi.api.receipt.dto.ReceiptOrderData;
import com.aksi.domain.order.OrderEntity;

/** Converter interface for transforming order entities to receipt data */
public interface ReceiptDataConverter {

  /**
   * Convert OrderEntity to ReceiptOrderData
   *
   * @param order Order entity
   * @return Receipt order data
   */
  ReceiptOrderData convert(OrderEntity order);
}
