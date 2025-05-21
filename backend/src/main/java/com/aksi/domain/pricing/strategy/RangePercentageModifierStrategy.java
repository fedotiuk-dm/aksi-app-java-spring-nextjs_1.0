package com.aksi.domain.pricing.strategy;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.aksi.domain.pricing.constants.PriceCalculationConstants;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

/**
 * Стратегія для застосування відсоткових модифікаторів з діапазоном.
 */
@Component
public class RangePercentageModifierStrategy implements ModifierStrategy {

    @Override
    public boolean supports(PriceModifierDTO modifier) {
        return modifier != null && ModifierType.RANGE_PERCENTAGE.equals(modifier.getModifierType());
    }

    @Override
    public BigDecimal apply(BigDecimal price, PriceModifierDTO modifier, BigDecimal rangeValue, Integer fixedQuantity) {
        if (price == null || modifier == null) {
            return price;
        }
        
        BigDecimal percentToUse;
        if (rangeValue != null) {
            // Використовуємо вказане значення
            percentToUse = rangeValue;
        } else {
            // За замовчуванням використовуємо зважене середнє значення діапазону з коефіцієнтом
            // який ближче до мінімального значення для консервативного підходу
            BigDecimal range = modifier.getMaxValue().subtract(modifier.getMinValue());
            BigDecimal weightedValue = range.multiply(PriceCalculationConstants.DEFAULT_RANGE_WEIGHT_FACTOR);
            percentToUse = modifier.getMinValue().add(weightedValue);
        }
        
        return PriceCalculationConstants.applyPercentage(price, percentToUse);
    }
}
