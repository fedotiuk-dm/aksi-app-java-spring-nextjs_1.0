package com.aksi.domain.order.service.order;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.aksi.domain.order.dto.OrderItemDTO;

/**
 * Сервіс для управління предметами замовлення.
 */
public interface OrderItemManagementService {

    /**
     * Отримати всі предмети замовлення.
     * @param orderId ідентифікатор замовлення
     * @return список предметів замовлення
     */
    List<OrderItemDTO> getOrderItems(UUID orderId);

    /**
     * Отримати конкретний предмет замовлення за ID.
     * @param orderId ідентифікатор замовлення
     * @param itemId ідентифікатор предмета
     * @return об'єкт Optional з предметом замовлення або пустий Optional
     */
    Optional<OrderItemDTO> getOrderItem(UUID orderId, UUID itemId);

    /**
     * Додати новий предмет до замовлення.
     * @param orderId ідентифікатор замовлення
     * @param itemDTO дані предмета
     * @return доданий предмет замовлення
     */
    OrderItemDTO addOrderItem(UUID orderId, OrderItemDTO itemDTO);

    /**
     * Оновити існуючий предмет замовлення.
     * @param orderId ідентифікатор замовлення
     * @param itemId ідентифікатор предмета
     * @param itemDTO оновлені дані предмета
     * @return оновлений предмет замовлення
     */
    OrderItemDTO updateOrderItem(UUID orderId, UUID itemId, OrderItemDTO itemDTO);

    /**
     * Видалити предмет із замовлення.
     * @param orderId ідентифікатор замовлення
     * @param itemId ідентифікатор предмета
     */
    void deleteOrderItem(UUID orderId, UUID itemId);
}
