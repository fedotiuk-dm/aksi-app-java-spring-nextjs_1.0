package com.aksi.domain.order.dto;

import java.math.BigDecimal;

import com.aksi.domain.order.model.ModifierType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для модифікатора ціни предмета.
 * Використовується для деталізації розрахунку вартості.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Модифікатор ціни предмета замовлення")
public class PriceModifierDTO {
    
    /**
     * Назва модифікатора.
     */
    @Schema(description = "Назва модифікатора", example = "Натуральний шовк")
    private String name;
    
    /**
     * Опис модифікатора.
     */
    @Schema(description = "Опис модифікатора", example = "Надбавка за особливий матеріал")
    private String description;
    
    /**
     * Тип модифікатора (відсоток, фіксована сума, множник).
     */
    @Schema(description = "Тип модифікатора", example = "PERCENTAGE", 
            enumAsRef = true)
    private ModifierType type;
    
    /**
     * Значення модифікатора.
     * Наприклад, 20 для відсотка (+20%) або 100 для фіксованої суми (+100 грн).
     */
    @Schema(description = "Значення модифікатора", example = "20.00")
    private BigDecimal value;
    
    /**
     * Сума модифікатора, яка додається до ціни.
     */
    @Schema(description = "Сума модифікатора", example = "50.00")
    private BigDecimal amount;
} 
