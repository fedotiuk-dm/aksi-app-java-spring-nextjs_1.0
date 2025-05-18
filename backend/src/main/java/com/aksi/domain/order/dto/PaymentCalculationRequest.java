package com.aksi.domain.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.order.model.PaymentMethod;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту розрахунку оплати замовлення
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCalculationRequest {
    
    /**
     * ID замовлення
     */
    @NotNull(message = "ID замовлення обов'язковий")
    private UUID orderId;
    
    /**
     * Спосіб оплати
     */
    @NotNull(message = "Спосіб оплати обов'язковий")
    private PaymentMethod paymentMethod;
    
    /**
     * Сума передоплати
     */
    @DecimalMin(value = "0.0", inclusive = true, message = "Сума передоплати не може бути від'ємною")
    private BigDecimal prepaymentAmount;
} 