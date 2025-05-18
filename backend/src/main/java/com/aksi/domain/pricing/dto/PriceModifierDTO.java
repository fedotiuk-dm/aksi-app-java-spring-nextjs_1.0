package com.aksi.domain.pricing.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierCategory;
import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для передачі даних про модифікатори цін.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Модифікатор ціни (фіксований, відсотковий, діапазонний)")
public class PriceModifierDTO {
    
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
        
        switch (modifierType) {
            case PERCENTAGE:
                if (value != null) {
                    return (value.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "") + value + "%";
                }
                break;
                
            case RANGE_PERCENTAGE:
                if (minValue != null && maxValue != null) {
                    return "від +" + minValue + "% до +" + maxValue + "%";
                }
                break;
                
            case FIXED:
                if (value != null) {
                    return "фіксована ціна " + value + " грн";
                }
                break;
                
            case ADDITION:
                if (value != null) {
                    return "додатково " + value + " грн";
                }
                break;
        }
        
        return "";
    }
} 