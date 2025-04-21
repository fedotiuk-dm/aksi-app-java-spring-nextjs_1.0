package com.aksi.dto.catalog;

import com.aksi.domain.order.entity.StainType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO для рекомендацій модифікаторів, які варто застосувати
 * залежно від типу забруднення.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModifierRecommendationDto {
    
    /**
     * Тип забруднення, для якого рекомендується модифікатор.
     */
    private StainType stainType;
    
    /**
     * Назва рекомендованого модифікатора.
     */
    private String modifierName;
    
    /**
     * Тип модифікатора (PERCENTAGE або FIXED).
     */
    private String modifierType;
    
    /**
     * Значення модифікатора.
     */
    private BigDecimal modifierValue;
    
    /**
     * Опис, який пояснює, чому рекомендується цей модифікатор.
     */
    private String description;
    
    /**
     * Пріоритет рекомендації.
     */
    private Integer priority;
    
    /**
     * Чи застосовувати модифікатор автоматично.
     */
    private boolean applyAutomatically;
}
