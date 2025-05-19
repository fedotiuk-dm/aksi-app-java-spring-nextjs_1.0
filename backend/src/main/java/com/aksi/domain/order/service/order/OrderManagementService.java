package com.aksi.domain.order.service.order;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.entity.OrderEntity;

/**
 * Сервіс для базового управління замовленнями.
 */
public interface OrderManagementService {
    
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
     * Отримати поточні активні замовлення.
     * @return список активних замовлень
     */
    List<OrderDTO> getActiveOrders();
    
    /**
     * Знайти сутність замовлення за ID.
     * @param id ідентифікатор
     * @return знайдена сутність замовлення
     * @throws EntityNotFoundException якщо замовлення не знайдено
     */
    OrderEntity findOrderEntityById(UUID id);
    
    /**
     * Зберегти замовлення.
     * @param orderEntity сутність замовлення
     * @return DTO оновленого замовлення
     */
    OrderDTO saveOrder(OrderEntity orderEntity);
    
    /**
     * Генерувати номер квитанції для замовлення.
     * @param branchLocationId ID філії
     * @return згенерований номер квитанції
     */
    String generateReceiptNumber(UUID branchLocationId);
} 
