package com.aksi.domain.order.service.order;

import java.util.UUID;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.model.OrderStatusEnum;

/**
 * Сервіс для управління статусами замовлень.
 */
public interface OrderStatusService {
    
    /**
     * Оновити статус замовлення.
     * @param id ідентифікатор
     * @param status параметр status
     * @return оновлене замовлення
     */
    OrderDTO updateOrderStatus(UUID id, OrderStatusEnum status);
    
    /**
     * Скасувати замовлення.
     * @param id ідентифікатор
     */
    void cancelOrder(UUID id);
    
    /**
     * Відзначити замовлення як виконане.
     * @param id ідентифікатор
     * @return виконане замовлення
     */
    OrderDTO completeOrder(UUID id);
} 