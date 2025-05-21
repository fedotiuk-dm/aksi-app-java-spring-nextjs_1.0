package com.aksi.domain.pricing.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

import lombok.Builder;
import lombok.Data;

/**
 * Доменний об'єкт, який містить всі необхідні параметри для обчислення ціни.
 * Дозволяє спростити сигнатуру методів та покращити розуміння коду.
 */
@Data
@Builder
public class PriceCalculationParams {
    /**
     * Базова ціна товару/послуги.
     */
    private BigDecimal basePrice;
    
    /**
     * Список всіх доступних модифікаторів.
     */
    private List<PriceModifierDTO> modifiers;
    
    /**
     * Колір виробу (напр. "чорний", "білий", "кольоровий").
     */
    private String color;
    
    /**
     * Значення для модифікаторів з діапазоном, якщо користувач вказав конкретне значення.
     * Ключ - код модифікатора, значення - конкретне значення процентного коефіцієнта.
     */
    private Map<String, BigDecimal> rangeModifierValues;
    
    /**
     * Кількість застосувань фіксованих модифікаторів.
     * Ключ - код модифікатора, значення - кількість.
     */
    private Map<String, Integer> fixedModifierQuantities;
    
    /**
     * Ознака терміновості замовлення.
     */
    private boolean expedited;
    
    /**
     * Коефіцієнт терміновості (відсоток надбавки за терміновість).
     */
    private BigDecimal expediteFactor;
    
    /**
     * Код категорії товару/послуги. Використовується для визначення, 
     * чи може бути застосована терміновість.
     */
    private String categoryCode;
    
    /**
     * Список деталей обчислення ціни для формування звіту.
     */
    private List<CalculationDetailsDTO> calculationDetails;
}
