package com.aksi.domain.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.order.model.PaymentMethod;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді з розрахунком оплати замовлення
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCalculationResponse {
    
    /**
     * ID замовлення
     */
    private UUID orderId;
    
    /**
     * Спосіб оплати
     */
    private PaymentMethod paymentMethod;
    
    /**
     * Загальна сума замовлення
     */
    private BigDecimal totalAmount;
    
    /**
     * Сума знижки (якщо є)
     */
    private BigDecimal discountAmount;
    
    /**
     * Кінцева сума до оплати
     */
    private BigDecimal finalAmount;
    
    /**
     * Сума передоплати
     */
    private BigDecimal prepaymentAmount;
    
    /**
     * Сума боргу (залишок до оплати)
     */
    private BigDecimal balanceAmount;
} 
