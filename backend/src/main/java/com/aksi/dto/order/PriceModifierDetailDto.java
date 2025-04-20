package com.aksi.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO для деталізації модифікаторів ціни.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceModifierDetailDto {
    
    /**
     * Назва модифікатора
     */
    private String name;
    
    /**
     * Опис модифікатора
     */
    private String description;
    
    /**
     * Тип модифікатора (PERCENTAGE або FIXED)
     */
    private String type;
    
    /**
     * Значення модифікатора
     */
    private BigDecimal value;
    
    /**
     * Вплив модифікатора на ціну (сума)
     */
    private BigDecimal impact;
    
    /**
     * Ціна до застосування модифікатора
     */
    private BigDecimal priceBefore;
    
    /**
     * Ціна після застосування модифікатора
     */
    private BigDecimal priceAfter;
    
    /**
     * Замінює базову ціну?
     */
    private Boolean replacesBasePrice;
    
    /**
     * Порядок застосування
     */
    private Integer applicationOrder;
}
