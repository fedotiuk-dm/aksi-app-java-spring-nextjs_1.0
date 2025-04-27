package com.aksi.domain.pricing.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді на запит розрахунку ціни.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceCalculationResponseDTO {
    
    /**
     * Початкова базова ціна за одиницю з прайс-листа.
     */
    private BigDecimal baseUnitPrice;
    
    /**
     * Кількість предметів.
     */
    private Integer quantity;
    
    /**
     * Сума базових цін за всі предмети без модифікаторів.
     */
    private BigDecimal baseTotalPrice;
    
    /**
     * Кінцева ціна за одиницю з урахуванням всіх модифікаторів.
     */
    private BigDecimal finalUnitPrice;
    
    /**
     * Загальна кінцева ціна за всі предмети з урахуванням всіх модифікаторів.
     */
    private BigDecimal finalTotalPrice;
    
    /**
     * Список деталей розрахунку для кожного модифікатора.
     */
    private List<ModifierCalculationDetail> calculationDetails;
    
    /**
     * Деталі розрахунку для конкретного модифікатора.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModifierCalculationDetail {
        /**
         * ID модифікатора.
         */
        private String modifierId;
        
        /**
         * Назва модифікатора.
         */
        private String modifierName;
        
        /**
         * Опис модифікатора.
         */
        private String modifierDescription;
        
        /**
         * Опис змін, які модифікатор вносить у ціну.
         */
        private String changeDescription;
        
        /**
         * Ціна до застосування модифікатора.
         */
        private BigDecimal priceBefore;
        
        /**
         * Ціна після застосування модифікатора.
         */
        private BigDecimal priceAfter;
        
        /**
         * Різниця (зміна) в ціні після застосування модифікатора.
         */
        private BigDecimal priceDifference;
    }
}
