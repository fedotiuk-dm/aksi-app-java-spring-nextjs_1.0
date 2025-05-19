package com.aksi.domain.pricing.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.pricing.constants.ModifierFormatConstants;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Базовий клас для DTO модифікаторів цін.
 */
@Data
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public abstract class BasePriceModifierDTO {
    
    @Schema(description = "Унікальний ідентифікатор модифікатора")
    private UUID id;
    
    @Schema(description = "Код модифікатора для програмного використання")
    private String code;
    
    @Schema(description = "Назва модифікатора")
    private String name;
    
    @Schema(description = "Опис модифікатора")
    private String description;
    
    @Schema(description = "Тип модифікатора (PERCENTAGE, FIXED, RANGE_PERCENTAGE, ADDITION)")
    private ModifierType modifierType;
    
    @Schema(description = "Категорія модифікатора (GENERAL, TEXTILE, LEATHER)")
    private ModifierCategory category;
    
    @Schema(description = "Значення для фіксованих модифікаторів або відсоткових")
    private BigDecimal value;
    
    @Schema(description = "Мінімальне значення для модифікаторів з діапазоном")
    private BigDecimal minValue;
    
    @Schema(description = "Максимальне значення для модифікаторів з діапазоном")
    private BigDecimal maxValue;
    
    @Schema(description = "Чи активний модифікатор")
    private boolean active;
    
    @Schema(description = "Порядок сортування для відображення")
    private Integer sortOrder;
    
    /**
     * Повертає текстовий опис зміни ціни для відображення користувачу.
     * 
     * @return Текстовий опис зміни
     */
    @Schema(description = "Текстовий опис зміни ціни", accessMode = Schema.AccessMode.READ_ONLY)
    public String getChangeDescription() {
        if (modifierType == null) {
            return "";
        }
        
        return switch (modifierType) {
            case PERCENTAGE -> value != null 
                ? String.format(
                    ModifierFormatConstants.PERCENTAGE_FORMAT,
                    value.compareTo(BigDecimal.ZERO) >= 0 ? ModifierFormatConstants.PERCENTAGE_PLUS_PREFIX : "",
                    value)
                : "";
                
            case RANGE_PERCENTAGE -> minValue != null && maxValue != null 
                ? String.format(ModifierFormatConstants.RANGE_PERCENTAGE_FORMAT, minValue, maxValue)
                : "";
                
            case FIXED -> value != null 
                ? String.format(ModifierFormatConstants.FIXED_PRICE_FORMAT, value, ModifierFormatConstants.DEFAULT_CURRENCY)
                : "";
                
            case ADDITION -> value != null 
                ? String.format(ModifierFormatConstants.ADDITION_FORMAT, value, ModifierFormatConstants.DEFAULT_CURRENCY)
                : "";
        };
    }
}
