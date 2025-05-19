package com.aksi.domain.order.service.order;

import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.entity.OrderEntity;

/**
 * Сервіс для фінансових операцій із замовленнями.
 */
public interface OrderFinancialService {
    
    /**
     * Розрахувати вартість замовлення.
     * @param order параметр order
     * @return замовлення з розрахованою загальною вартістю
     */
    OrderDTO calculateOrderTotal(OrderEntity order);
    
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
} 