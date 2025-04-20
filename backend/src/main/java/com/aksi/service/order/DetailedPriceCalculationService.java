package com.aksi.service.order;

import com.aksi.domain.order.entity.Order;
import com.aksi.domain.order.entity.OrderItem;
import com.aksi.dto.order.OrderItemPriceCalculationDto;

import java.util.List;
import java.util.UUID;

/**
 * Сервіс для детального розрахунку цін замовлень та окремих предметів
 */
public interface DetailedPriceCalculationService {
    
    /**
     * Отримати детальний розрахунок ціни для конкретного предмета
     * @param itemId ідентифікатор предмета замовлення
     * @return детальний розрахунок ціни
     */
    OrderItemPriceCalculationDto getDetailedPriceCalculation(UUID itemId);
    
    /**
     * Отримати детальні розрахунки цін для всіх предметів замовлення
     * @param orderId ідентифікатор замовлення
     * @return список детальних розрахунків для кожного предмета
     */
    List<OrderItemPriceCalculationDto> getDetailedPriceCalculationsForOrder(UUID orderId);
    
    /**
     * Розрахувати та оновити детальну інформацію про ціну для предмета
     * @param orderItem предмет замовлення
     * @return детальний розрахунок ціни
     */
    OrderItemPriceCalculationDto calculateDetailedPrice(OrderItem orderItem);
    
    /**
     * Розрахувати та оновити детальну інформацію про ціни для всіх предметів у замовленні
     * @param order замовлення
     * @return список детальних розрахунків для кожного предмета
     */
    List<OrderItemPriceCalculationDto> calculateDetailedPricesForOrder(Order order);
}
