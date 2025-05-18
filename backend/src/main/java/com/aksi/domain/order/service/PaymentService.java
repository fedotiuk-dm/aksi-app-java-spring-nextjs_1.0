package com.aksi.domain.order.service;

import java.util.UUID;

import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;

/**
 * Сервіс для роботи з оплатами замовлень
 */
public interface PaymentService {
    
    /**
     * Розрахувати деталі оплати замовлення
     * 
     * @param request запит з інформацією про оплату
     * @return відповідь з розрахунком оплати
     */
    PaymentCalculationResponse calculatePayment(PaymentCalculationRequest request);
    
    /**
     * Застосувати інформацію про оплату до замовлення
     * 
     * @param request запит з інформацією про оплату
     * @return відповідь з оновленими даними про оплату
     */
    PaymentCalculationResponse applyPayment(PaymentCalculationRequest request);
    
    /**
     * Отримати інформацію про оплату замовлення
     * 
     * @param orderId ідентифікатор замовлення
     * @return відповідь з даними про оплату
     */
    PaymentCalculationResponse getOrderPayment(UUID orderId);
} 