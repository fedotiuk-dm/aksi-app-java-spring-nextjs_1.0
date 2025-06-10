package com.aksi.domain.order.statemachine.stage3.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;
import com.aksi.domain.order.service.PaymentService;

/**
 * Операційний сервіс для роботи з оплатою Stage3.
 * Тонка обгортка навколо доменного сервісу PaymentService.
 *
 * ЕТАП 3.2: Operations Services (тонкі обгортки)
 * Дозволені імпорти: ТІЛЬКИ доменні сервіси, DTO, Spring аннотації, Java стандартні
 * Заборонено: Stage3 Services, Validators, Actions, Guards, Config
 */
@Service
public class Stage3PaymentOperationsService {

    private final PaymentService paymentService;

    public Stage3PaymentOperationsService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Розраховує оплату для замовлення
     */
    public PaymentCalculationResponse calculatePayment(PaymentCalculationRequest request) {
        return paymentService.calculatePayment(request);
    }

    /**
     * Застосовує інформацію про оплату до замовлення
     */
    public PaymentCalculationResponse applyPayment(PaymentCalculationRequest request) {
        return paymentService.applyPayment(request);
    }

    /**
     * Отримує інформацію про оплату замовлення
     */
    public PaymentCalculationResponse getOrderPayment(UUID orderId) {
        return paymentService.getOrderPayment(orderId);
    }

    /**
     * Розраховує залишок до доплати
     */
    public java.math.BigDecimal calculateRemainingAmount(
            java.math.BigDecimal totalAmount,
            java.math.BigDecimal prepaidAmount) {

        if (totalAmount == null || prepaidAmount == null) {
            return totalAmount != null ? totalAmount : java.math.BigDecimal.ZERO;
        }

        java.math.BigDecimal remaining = totalAmount.subtract(prepaidAmount);
        return remaining.max(java.math.BigDecimal.ZERO);
    }

    /**
     * Перевіряє чи оплата повна
     */
    public boolean isFullyPaid(java.math.BigDecimal totalAmount, java.math.BigDecimal paidAmount) {
        if (totalAmount == null || paidAmount == null) {
            return false;
        }
        return paidAmount.compareTo(totalAmount) >= 0;
    }
}
