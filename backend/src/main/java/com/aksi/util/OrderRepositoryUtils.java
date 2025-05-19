package com.aksi.util;

import java.util.UUID;

import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

/**
 * Утилітарний клас для операцій з репозиторієм замовлень.
 * Містить спільні методи, які використовуються різними сервісами.
 */
@UtilityClass
@Slf4j
public class OrderRepositoryUtils {

    /**
     * Отримати замовлення за ID
     *
     * @param orderRepository репозиторій замовлень
     * @param orderId ID замовлення
     * @return сутність замовлення
     * @throws EntityNotFoundException якщо замовлення не знайдено
     */
    public OrderEntity getOrderById(OrderRepository orderRepository, UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    log.error("Замовлення з ID {} не знайдено", orderId);
                    return EntityNotFoundException.withTypeAndId("Замовлення", orderId.toString());
                });
    }
}
