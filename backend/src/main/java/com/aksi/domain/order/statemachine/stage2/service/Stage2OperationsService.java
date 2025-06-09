package com.aksi.domain.order.statemachine.stage2.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.OrderService;

/**
 * Сервіс операцій для роботи з предметами замовлення в Stage2.
 * Тонка обгортка навколо OrderService.
 */
@Service
public class Stage2OperationsService {

    private final OrderService orderService;

    public Stage2OperationsService(final OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Отримує всі предмети замовлення
     */
    public List<OrderItemDTO> getOrderItems(final UUID orderId) {
        return orderService.getOrderItems(orderId);
    }

    /**
     * Додає новий предмет до замовлення
     */
    public OrderItemDTO addItemToOrder(final UUID orderId, final OrderItemDTO itemDTO) {
        return orderService.addOrderItem(orderId, itemDTO);
    }

    /**
     * Оновлює існуючий предмет замовлення
     */
    public OrderItemDTO updateOrderItem(final UUID orderId, final UUID itemId, final OrderItemDTO itemDTO) {
        return orderService.updateOrderItem(orderId, itemId, itemDTO);
    }

    /**
     * Видаляє предмет з замовлення
     */
    public void deleteOrderItem(final UUID orderId, final UUID itemId) {
        orderService.deleteOrderItem(orderId, itemId);
    }

    /**
     * Отримує предмет замовлення за ID
     */
    public OrderItemDTO getOrderItem(final UUID orderId, final UUID itemId) {
        return orderService.getOrderItem(orderId, itemId).orElse(null);
    }

    /**
     * Перевіряє, чи існує замовлення
     */
    public boolean orderExists(final UUID orderId) {
        return orderService.getOrderById(orderId).isPresent();
    }
}
