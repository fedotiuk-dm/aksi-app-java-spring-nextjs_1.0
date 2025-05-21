package com.aksi.domain.pricing.strategy;

import java.math.BigDecimal;

import com.aksi.domain.pricing.dto.PriceModifierDTO;

/**
 * Інтерфейс стратегії для застосування модифікаторів ціни.
 * Реалізує патерн "Стратегія" для різних типів модифікаторів.
 */
public interface ModifierStrategy {
    
    /**
     * Перевіряє, чи підтримує стратегія заданий тип модифікатора.
     *
     * @param modifier модифікатор для перевірки
     * @return true, якщо стратегія підтримує тип модифікатора
     */
    boolean supports(PriceModifierDTO modifier);
    
    /**
     * Застосовує модифікатор до ціни.
     *
     * @param price базова ціна
     * @param modifier модифікатор для застосування
     * @param rangeValue значення у межах діапазону (для RANGE_PERCENTAGE)
     * @param fixedQuantity кількість (для FIXED_QUANTITY)
     * @return модифікована ціна
     */
    BigDecimal apply(BigDecimal price, PriceModifierDTO modifier, BigDecimal rangeValue, Integer fixedQuantity);
}
