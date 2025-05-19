package com.aksi.domain.order.service;

import java.util.UUID;

import com.aksi.domain.order.dto.OrderDetailedSummaryResponse;

/**
 * Сервіс для отримання детального підсумку замовлення.
 */
public interface OrderSummaryService {

    /**
     * Отримує детальний підсумок замовлення за його ID.
     *
     * @param orderId ID замовлення
     * @return детальний підсумок замовлення
     */
    OrderDetailedSummaryResponse getOrderDetailedSummary(UUID orderId);
}
