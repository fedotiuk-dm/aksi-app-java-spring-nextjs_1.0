package com.aksi.domain.order.dto.receipt;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для фінансової інформації у квитанції
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptFinancialInfoDTO {
    /**
     * Вартість послуг до знижок
     */
    private BigDecimal totalAmount;
    
    /**
     * Сума знижки
     */
    private BigDecimal discountAmount;
    
    /**
     * Тип знижки
     */
    private String discountType;
    
    /**
     * Надбавка за терміновість
     */
    private BigDecimal expediteSurcharge;
    
    /**
     * Загальна вартість після знижок та надбавок
     */
    private BigDecimal finalAmount;
    
    /**
     * Сплачена сума (передоплата)
     */
    private BigDecimal prepaymentAmount;
    
    /**
     * Залишок до сплати при отриманні
     */
    private BigDecimal balanceAmount;
} 