package com.aksi.domain.order.service.order;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;

/**
 * Сервіс для роботи з чернетками замовлень.
 */
public interface OrderDraftService {
    
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
     * Отримати чернетки замовлень.
     * @return список чернеток замовлень
     */
    List<OrderDTO> getDraftOrders();
} 
