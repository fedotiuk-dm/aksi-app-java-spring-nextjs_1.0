package com.aksi.domain.pricing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

/**
 * DTO для передачі даних про модифікатори цін.
 */
@SuperBuilder
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Модифікатор ціни (фіксований, відсотковий, діапазонний)")
public class PriceModifierDTO extends BasePriceModifierDTO {
    // Всі поля та методи успадковуються від BasePriceModifierDTO
    
    /**
     * Конструктор з усіма параметрами для правильної роботи з MapStruct
     */
    public PriceModifierDTO(UUID id, String code, String name, String description, 
                           ModifierType modifierType, ModifierCategory category, 
                           BigDecimal value, BigDecimal minValue, BigDecimal maxValue, 
                           boolean active, Integer sortOrder) {
        super(id, code, name, description, modifierType, category, value, minValue, maxValue, active, sortOrder);
    }
}
