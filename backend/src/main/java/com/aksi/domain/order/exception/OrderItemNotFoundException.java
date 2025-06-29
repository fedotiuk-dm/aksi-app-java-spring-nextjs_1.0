package com.aksi.domain.order.exception;

import java.util.UUID;

/**
 * Exception який кидається коли предмет замовлення не знайдено
 */
public class OrderItemNotFoundException extends RuntimeException {

    public OrderItemNotFoundException(String message) {
        super(message);
    }

    public OrderItemNotFoundException(UUID itemId) {
        super("Предмет замовлення з ID " + itemId + " не знайдено");
    }

    public OrderItemNotFoundException(UUID orderId, UUID itemId) {
        super("Предмет з ID " + itemId + " не знайдено в замовленні " + orderId);
    }

    public OrderItemNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
