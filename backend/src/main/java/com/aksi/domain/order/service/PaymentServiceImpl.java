package com.aksi.domain.order.service;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.util.OrderRepositoryUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу оплати замовлень
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public PaymentCalculationResponse calculatePayment(PaymentCalculationRequest request) {
        log.debug("Розрахунок оплати для замовлення: {}", request.getOrderId());

        OrderEntity order = OrderRepositoryUtils.getOrderById(orderRepository, request.getOrderId());

        BigDecimal finalAmount = order.getFinalAmount();
        BigDecimal prepaymentAmount = request.getPrepaymentAmount() != null
                ? request.getPrepaymentAmount()
                : BigDecimal.ZERO;

        BigDecimal balanceAmount = finalAmount.subtract(prepaymentAmount);

        return buildPaymentResponse(order, request.getPaymentMethod(), prepaymentAmount, balanceAmount);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public PaymentCalculationResponse applyPayment(PaymentCalculationRequest request) {
        log.debug("Застосування інформації про оплату для замовлення: {}", request.getOrderId());

        OrderEntity order = OrderRepositoryUtils.getOrderById(orderRepository, request.getOrderId());

        // Встановлення способу оплати
        order.setPaymentMethod(request.getPaymentMethod());

        // Встановлення суми передоплати
        BigDecimal prepaymentAmount = request.getPrepaymentAmount() != null
                ? request.getPrepaymentAmount()
                : BigDecimal.ZERO;
        order.setPrepaymentAmount(prepaymentAmount);

        // Розрахунок суми боргу
        BigDecimal balanceAmount = order.getFinalAmount().subtract(prepaymentAmount);
        order.setBalanceAmount(balanceAmount);

        // Збереження замовлення
        OrderEntity savedOrder = orderRepository.save(order);

        return buildPaymentResponse(savedOrder, savedOrder.getPaymentMethod(),
                savedOrder.getPrepaymentAmount(), savedOrder.getBalanceAmount());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public PaymentCalculationResponse getOrderPayment(UUID orderId) {
        log.debug("Отримання інформації про оплату для замовлення: {}", orderId);

        OrderEntity order = OrderRepositoryUtils.getOrderById(orderRepository, orderId);

        return buildPaymentResponse(order, order.getPaymentMethod(),
                order.getPrepaymentAmount(), order.getBalanceAmount());
    }

    /**
     * Створює об'єкт відповіді з розрахунком оплати
     *
     * @param order замовлення
     * @param paymentMethod спосіб оплати
     * @param prepaymentAmount сума передоплати
     * @param balanceAmount сума боргу
     * @return відповідь з розрахунком оплати
     */
    private PaymentCalculationResponse buildPaymentResponse(
            OrderEntity order,
            com.aksi.domain.order.model.PaymentMethod paymentMethod,
            BigDecimal prepaymentAmount,
            BigDecimal balanceAmount) {

        return PaymentCalculationResponse.builder()
                .orderId(order.getId())
                .paymentMethod(paymentMethod)
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .prepaymentAmount(prepaymentAmount)
                .balanceAmount(balanceAmount)
                .build();
    }
}
