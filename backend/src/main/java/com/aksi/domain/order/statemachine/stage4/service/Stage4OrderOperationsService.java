package com.aksi.domain.order.statemachine.stage4.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderDetailedSummaryResponse;
import com.aksi.domain.order.service.OrderService;
import com.aksi.domain.order.service.OrderSummaryService;

import lombok.RequiredArgsConstructor;

/**
 * Сервіс операцій з замовленнями для Stage4.
 * Тонка обгортка навколо domain OrderService та OrderSummaryService.
 */
@Service
@RequiredArgsConstructor
public class Stage4OrderOperationsService {

    private final OrderService orderService;
    private final OrderSummaryService orderSummaryService;

    /**
     * Отримує детальний підсумок замовлення.
     *
     * @param orderId ID замовлення
     * @return детальний підсумок замовлення
     */
    public OrderDetailedSummaryResponse getOrderDetailedSummary(UUID orderId) {
        return orderSummaryService.getOrderDetailedSummary(orderId);
    }

    /**
     * Перевіряє чи існує замовлення.
     *
     * @param orderId ID замовлення
     * @return true якщо замовлення існує
     */
    public boolean orderExists(UUID orderId) {
        return orderService.getOrderById(orderId).isPresent();
    }

    /**
     * Перевіряє чи готове замовлення до підтвердження.
     *
     * @param orderId ID замовлення
     * @return true якщо замовлення готове до підтвердження
     */
    public boolean isOrderReadyForConfirmation(UUID orderId) {
        try {
            OrderDetailedSummaryResponse summary = getOrderDetailedSummary(orderId);
            return summary != null
                && summary.getClient() != null
                && summary.getItems() != null
                && !summary.getItems().isEmpty()
                && summary.getFinalAmount() != null;
        } catch (Exception e) {
            return false;
        }
    }
}
