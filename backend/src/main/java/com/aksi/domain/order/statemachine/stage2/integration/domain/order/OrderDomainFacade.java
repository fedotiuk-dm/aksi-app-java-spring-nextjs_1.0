package com.aksi.domain.order.statemachine.stage2.integration.domain.order;

import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.service.OrderService;
import com.aksi.domain.order.service.DiscountService;
import com.aksi.domain.order.service.PaymentService;
import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;
import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;
import com.aksi.domain.order.model.DiscountType;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.dto.OrderDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Фасад для інтеграції з Order Domain.
 * Надає методи для роботи з замовленнями, розрахунків та фінансових операцій.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderDomainFacade {

    private final OrderService orderService;
    private final DiscountService discountService;
    private final PaymentService paymentService;

    /**
     * Додає предмет до замовлення (через DTO)
     */
    public OrderItemDTO addItemToOrder(UUID orderId, OrderItemDTO newItem) {
        log.debug("Adding item to order: orderId={}, item={}", orderId, newItem.getName());
        return orderService.addOrderItem(orderId, newItem);
    }

    /**
     * Оновлює предмет в замовленні
     */
    public OrderItemDTO updateOrderItem(UUID orderId, UUID itemId, OrderItemDTO updatedItem) {
        log.debug("Updating order item: orderId={}, itemId={}", orderId, itemId);
        return orderService.updateOrderItem(orderId, itemId, updatedItem);
    }

    /**
     * Видаляє предмет з замовлення
     */
    public void removeItemFromOrder(UUID orderId, UUID itemId) {
        log.debug("Removing item from order: orderId={}, itemId={}", orderId, itemId);
        orderService.deleteOrderItem(orderId, itemId);
    }

    /**
     * Отримує всі предмети замовлення
     */
    public List<OrderItemDTO> getOrderItems(UUID orderId) {
        log.debug("Getting order items for orderId={}", orderId);
        return orderService.getOrderItems(orderId);
    }

    /**
     * Розраховує підсумкову вартість замовлення
     */
    public OrderDTO calculateOrderTotal(UUID orderId) {
        log.debug("Calculating order total for orderId={}", orderId);
        OrderEntity orderEntity = orderService.findOrderEntityById(orderId);
        return orderService.calculateOrderTotal(orderEntity);
    }

        /**
     * Застосовує знижку до замовлення
     */
    public OrderDiscountResponse applyDiscount(UUID orderId, DiscountType discountType, Integer discountPercentage, String description) {
        log.debug("Applying discount to order: orderId={}, type={}, percentage={}", orderId, discountType, discountPercentage);

        OrderDiscountRequest request = OrderDiscountRequest.builder()
                .orderId(orderId)
                .discountType(discountType)
                .discountPercentage(discountPercentage)
                .discountDescription(description)
                .build();

        return discountService.applyDiscount(request);
    }

    /**
     * Застосовує знижку до замовлення (через OrderService)
     */
    public OrderDTO applyDiscountToOrder(UUID orderId, BigDecimal discountAmount) {
        log.debug("Applying discount amount to order: orderId={}, amount={}", orderId, discountAmount);
        return orderService.applyDiscount(orderId, discountAmount);
    }

    /**
     * Додає передоплату до замовлення
     */
    public OrderDTO addPrepayment(UUID orderId, BigDecimal prepaymentAmount) {
        log.debug("Adding prepayment to order: orderId={}, amount={}", orderId, prepaymentAmount);
        return orderService.addPrepayment(orderId, prepaymentAmount);
    }

        /**
     * Розраховує оплату замовлення
     */
    public PaymentCalculationResponse calculatePayment(PaymentCalculationRequest request) {
        log.debug("Calculating payment for orderId={}", request.getOrderId());
        return paymentService.calculatePayment(request);
    }

    /**
     * Отримує замовлення за ID
     */
    public OrderEntity getOrderById(UUID orderId) {
        log.debug("Getting order by id: {}", orderId);
        return orderService.findOrderEntityById(orderId);
    }

    /**
     * Отримує замовлення DTO за ID
     */
    public OrderDTO getOrderDTOById(UUID orderId) {
        log.debug("Getting order DTO by id: {}", orderId);
        return orderService.getOrderById(orderId).orElse(null);
    }

    /**
     * Валідує стан замовлення для переходу до наступного етапу
     */
    public boolean validateOrderForNextStage(UUID orderId) {
        log.debug("Validating order for next stage: {}", orderId);

        List<OrderItemDTO> items = getOrderItems(orderId);
        if (items.isEmpty()) {
            log.warn("Order has no items: {}", orderId);
            return false;
        }

        // Перевіряємо чи всі предмети мають розраховані ціни
        boolean allItemsHavePrices = items.stream()
                .allMatch(item -> item.getTotalPrice() != null && item.getTotalPrice().compareTo(BigDecimal.ZERO) > 0);

        if (!allItemsHavePrices) {
            log.warn("Some items don't have calculated prices: {}", orderId);
            return false;
        }

        return true;
    }

    /**
     * Розраховує кількість предметів у замовленні
     */
    public int getOrderItemsCount(UUID orderId) {
        log.debug("Getting order items count for orderId={}", orderId);
        return getOrderItems(orderId).size();
    }

    /**
     * Зберігає замовлення
     */
    public OrderDTO saveOrder(OrderEntity orderEntity) {
        log.debug("Saving order: {}", orderEntity.getId());
        return orderService.saveOrder(orderEntity);
    }

    /**
     * Отримує інформацію про знижку замовлення
     */
    public OrderDiscountResponse getOrderDiscount(UUID orderId) {
        log.debug("Getting order discount for orderId={}", orderId);
        return discountService.getOrderDiscount(orderId.toString());
    }

    /**
     * Видаляє знижку з замовлення
     */
    public OrderDiscountResponse removeDiscount(UUID orderId) {
        log.debug("Removing discount from order: {}", orderId);
        return discountService.removeDiscount(orderId.toString());
    }

    /**
     * Перевіряє чи можна застосувати знижку до категорії
     */
    public boolean isDiscountApplicable(String categoryCode) {
        log.debug("Checking if discount applicable for category: {}", categoryCode);
        return discountService.isDiscountApplicable(categoryCode);
    }

    /**
     * Застосовує знижку до ціни якщо це можливо
     */
    public BigDecimal applyDiscountIfApplicable(BigDecimal price, BigDecimal discountPercent, String categoryCode) {
        log.debug("Applying discount if applicable: price={}, discount={}, category={}", price, discountPercent, categoryCode);
        return discountService.applyDiscountIfApplicable(price, discountPercent, categoryCode);
    }
}
