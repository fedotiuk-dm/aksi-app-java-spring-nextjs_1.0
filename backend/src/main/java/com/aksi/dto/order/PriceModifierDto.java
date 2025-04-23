package com.aksi.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * DTO для модифікаторів цін (знижок та надбавок).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceModifierDto {
    
    /**
     * Унікальний ідентифікатор модифікатора
     */
    private String id;
    
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
     * Категорія модифікатора (загальний, для текстилю, для шкіри тощо)
     */
    private String modifierCategory;
    
    /**
     * Список ідентифікаторів категорій товарів, для яких застосовується модифікатор
     */
    private List<UUID> applicableCategories;
    
    /**
     * Порядок застосування модифікатора
     */
    private Integer applicationOrder;
    
    /**
     * Чи замінює це значення базову ціну (якщо true, то модифікатор замінює базову ціну замість модифікування)
     */
    private boolean replacesBasePrice;
}
