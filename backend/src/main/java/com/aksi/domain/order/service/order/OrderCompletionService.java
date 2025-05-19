package com.aksi.domain.order.service.order;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.model.ExpediteType;

/**
 * Сервіс для роботи з параметрами виконання замовлення.
 */
public interface OrderCompletionService {

    /**
     * Оновити параметри виконання замовлення.
     *
     * @param orderId ідентифікатор замовлення
     * @param expediteType тип термінового виконання
     * @param expectedCompletionDate очікувана дата завершення
     * @return оновлене замовлення
     */
    OrderDTO updateOrderCompletionParameters(
        UUID orderId,
        ExpediteType expediteType,
        LocalDateTime expectedCompletionDate);
}
