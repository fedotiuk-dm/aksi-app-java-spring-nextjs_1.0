package com.aksi.domain.order.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.model.DiscountType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді з даними про знижку до замовлення
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDiscountResponse {
    
    /**
     * ID замовлення
     */
    private UUID orderId;
    
    /**
     * Тип знижки
     */
    private DiscountType discountType;
    
    /**
     * Відсоток знижки
     */
    private Integer discountPercentage;
    
    /**
     * Опис знижки (для користувацького типу знижки)
     */
    private String discountDescription;
    
    /**
     * Загальна сума замовлення до знижки
     */
    private BigDecimal totalAmount;
    
    /**
     * Сума знижки
     */
    private BigDecimal discountAmount;
    
    /**
     * Фінальна сума замовлення зі знижкою
     */
    private BigDecimal finalAmount;
    
    /**
     * Список категорій, до яких не застосовується знижка
     */
    private List<String> nonDiscountableCategories;
    
    /**
     * Загальна сума елементів, до яких не застосовується знижка
     */
    private BigDecimal nonDiscountableAmount;
} 