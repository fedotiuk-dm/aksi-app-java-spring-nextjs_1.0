package com.aksi.domain.order.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.model.OrderStatusEnum;

/**
 * Сервіс для роботи з замовленнями.
 */
public interface OrderService {
    
    /**
     * Отримати всі замовлення.
     * @return список всіх замовлень
     */
    List<OrderDTO> getAllOrders();
    
    /**
     * Отримати замовлення за ID.
     * @param id ідентифікатор
     * @return об'єкт Optional з знайденим замовленням або пустий Optional
     */
    Optional<OrderDTO> getOrderById(UUID id);
    
    /**
     * Створити нове замовлення.
     * @param request запит
     * @return створене замовлення
     */
    OrderDTO createOrder(CreateOrderRequest request);
    
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
    
    /**
     * Зберегти чернетку замовлення.
     * @param request запит
     * @return збережена чернетка замовлення
     */
    OrderDTO saveOrderDraft(CreateOrderRequest request);
    
    /**
     * Перетворити чернетку на активне замовлення.
     * @param id ідентифікатор
     * @return активне замовлення, перетворене з чернетки
     */
    OrderDTO convertDraftToOrder(UUID id);
    
    /**
     * Додати знижку до замовлення.
     * @param id ідентифікатор
     * @param discountAmount параметр discountAmount
     * @return замовлення з доданою знижкою
     */
    OrderDTO applyDiscount(UUID id, BigDecimal discountAmount);
    
    /**
     * Додати передоплату до замовлення.
     * @param id ідентифікатор
     * @param prepaymentAmount параметр prepaymentAmount
     * @return замовлення з доданою передоплатою
     */
    OrderDTO addPrepayment(UUID id, BigDecimal prepaymentAmount);
    
    /**
     * Отримати поточні активні замовлення.
     * @return список активних замовлень
     */
    List<OrderDTO> getActiveOrders();
    
    /**
     * Отримати чернетки замовлень.
     * @return список чернеток замовлень
     */
    List<OrderDTO> getDraftOrders();
    
    /**
     * Розрахувати вартість замовлення.
     * @param order параметр order
     * @return замовлення з розрахованою загальною вартістю
     */
    OrderDTO calculateOrderTotal(OrderEntity order);
    
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
