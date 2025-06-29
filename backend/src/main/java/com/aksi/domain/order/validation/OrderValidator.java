package com.aksi.domain.order.validation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.enums.DiscountType;
import com.aksi.domain.order.enums.OrderStatus;
import com.aksi.domain.order.exception.OrderValidationException;
import com.aksi.domain.order.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validator для бізнес-правил Order domain.
 * ТІЛЬКИ business logic - форматна валідація в OpenAPI Bean Validation.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderValidator {

    private final OrderRepository orderRepository;

    /**
     * Валідація бізнес-правил при створенні нового замовлення
     */
    public void validateForCreate(OrderEntity order) {
        log.debug("Валідація бізнес-правил для створення замовлення: {}", order.getReceiptNumber());

        validateReceiptNumberUniqueness(order.getReceiptNumber());
        validateInitialStatus(order);
        validateDeliveryDateBusinessRules(order);
        validateDiscountBusinessRules(order);
    }

    /**
     * Валідація бізнес-правил при оновленні існуючого замовлення
     */
    public void validateForUpdate(OrderEntity existingOrder, OrderEntity updatedOrder) {
        log.debug("Валідація бізнес-правил для оновлення замовлення: {}", existingOrder.getId());

        validateStatusTransition(existingOrder.getStatus(), updatedOrder.getStatus());
        validateUpdateBusinessRules(existingOrder, updatedOrder);
        validateDeliveryDateBusinessRules(updatedOrder);
        validateDiscountBusinessRules(updatedOrder);
    }

    /**
     * Валідація переходів між статусами замовлення
     */
    public void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (Objects.equals(currentStatus, newStatus)) {
            return; // Без змін
        }

        if (!currentStatus.canTransitionTo(newStatus)) {
            throw OrderValidationException.invalidStatusTransition(currentStatus, newStatus);
        }
    }

    /**
     * Валідація можливості видалення замовлення
     */
    public void validateForDeletion(OrderEntity order) {
        // Видаляти можна тільки DRAFT замовлення
        if (order.getStatus() != OrderStatus.DRAFT) {
            throw OrderValidationException.cannotDeleteOrder(order.getId(), order.getStatus());
        }
    }

    /**
     * Валідація можливості модифікації замовлення
     */
    public void validateForModification(OrderEntity order) {
        if (!order.getStatus().canModifyOrder()) {
            throw OrderValidationException.cannotModifyOrder(order.getId(), order.getStatus());
        }
    }

    // === ПРИВАТНІ МЕТОДИ БІЗНЕС-ВАЛІДАЦІЇ ===

    private void validateReceiptNumberUniqueness(String receiptNumber) {
        if (orderRepository.existsByReceiptNumber(receiptNumber)) {
            throw OrderValidationException.receiptNumberAlreadyExists(receiptNumber);
        }
    }

    private void validateInitialStatus(OrderEntity order) {
        // Статус при створенні повинен бути DRAFT
        if (order.getStatus() != OrderStatus.DRAFT) {
            throw OrderValidationException.invalidInitialStatus(order.getStatus());
        }
    }

    private void validateUpdateBusinessRules(OrderEntity existingOrder, OrderEntity updatedOrder) {
        // ID не можна змінювати
        if (!Objects.equals(existingOrder.getId(), updatedOrder.getId())) {
            throw OrderValidationException.cannotChangeOrderId();
        }

        // Номер квитанції не можна змінювати після створення
        if (!Objects.equals(existingOrder.getReceiptNumber(), updatedOrder.getReceiptNumber())) {
            throw OrderValidationException.cannotChangeReceiptNumber();
        }

        // Клієнта не можна змінювати після початку обробки
        if (existingOrder.getStatus() != OrderStatus.DRAFT
            && !Objects.equals(existingOrder.getClientId(), updatedOrder.getClientId())) {
            throw OrderValidationException.cannotChangeClientAfterProcessingStarted();
        }
    }

    private void validateDeliveryDateBusinessRules(OrderEntity order) {
        if (order.getExecutionDate() == null) {
            return; // Дата буде встановлена автоматично
        }

        LocalDateTime now = LocalDateTime.now();

        if (order.getExecutionDate().isBefore(now)) {
            throw OrderValidationException.deliveryDateInPast();
        }

        // Перевірка відповідності терміновості - БІЗНЕС-ПРАВИЛО
        if (order.getUrgency() != null) {
            LocalDateTime minDeliveryDate = order.getUrgency().calculateReadyDate(now);
            if (order.getExecutionDate().isBefore(minDeliveryDate)) {
                throw OrderValidationException.deliveryDateTooEarly(
                    order.getUrgency(),
                    order.getExecutionDate(),
                    minDeliveryDate
                );
            }
        }
    }

    private void validateDiscountBusinessRules(OrderEntity order) {
        if (order.getDiscount() == null) {
            return;
        }

        DiscountType discountType = order.getDiscount().getType();
        BigDecimal discountValue = order.getDiscount().getPercentage();

        // БІЗНЕС-ПРАВИЛО: Валідація відсотка знижки для типу
        if (!discountType.isValidPercentage(discountValue)) {
            throw OrderValidationException.invalidPercentageDiscount(discountValue);
        }

        // БІЗНЕС-ПРАВИЛО: Перевірка що знижка не перевищує вартість замовлення
        if (order.getCalculation() != null) {
            BigDecimal totalAmount = order.getCalculation().getTotalAmount();
            BigDecimal maxDiscount = totalAmount.multiply(BigDecimal.valueOf(0.9)); // Максимум 90%

            if (order.getCalculation().getDiscountAmount().compareTo(maxDiscount) > 0) {
                throw OrderValidationException.discountTooHigh(
                    order.getCalculation().getDiscountAmount(),
                    maxDiscount
                );
            }
        }
    }
}
