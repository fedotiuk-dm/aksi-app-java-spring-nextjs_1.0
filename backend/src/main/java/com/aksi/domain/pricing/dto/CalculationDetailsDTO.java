package com.aksi.domain.pricing.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для деталей розрахунку ціни на конкретному кроці.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculationDetailsDTO {
    
    /**
     * Номер кроку в процесі розрахунку.
     * 1 - Базова ціна з прайсу
     * 2 - Перевірка кольору (чорний/інший)
     * 3 - Застосування особливих модифікаторів
     * 4 - Застосування множників (коефіцієнтів)
     * 5 - Додавання фіксованих послуг
     * 6 - Застосування терміновості
     * 7 - Застосування знижок
     * 8 - Округлення результату
     */
    private int step;
    
    /**
     * Назва кроку.
     */
    private String stepName;
    
    /**
     * Опис дії на цьому кроці.
     */
    private String description;
    
    /**
     * Код модифікатора (якщо є).
     */
    private String modifierCode;
    
    /**
     * Назва модифікатора (якщо є).
     */
    private String modifierName;
    
    /**
     * Значення модифікатора (наприклад, "+20%").
     */
    private String modifierValue;
    
    /**
     * Ціна до застосування модифікатора.
     */
    private BigDecimal priceBefore;
    
    /**
     * Ціна після застосування модифікатора.
     */
    private BigDecimal priceAfter;
    
    /**
     * Різниця в ціні (priceAfter - priceBefore).
     */
    private BigDecimal priceDifference;
} 
