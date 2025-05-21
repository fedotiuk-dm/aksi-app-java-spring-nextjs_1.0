package com.aksi.domain.pricing.strategy;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.aksi.domain.pricing.constants.PriceCalculationConstants;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

/**
 * Стратегія для застосування відсоткових модифікаторів.
 */
@Component
public class PercentageModifierStrategy implements ModifierStrategy {

    @Override
    public boolean supports(PriceModifierDTO modifier) {
        return modifier != null && ModifierType.PERCENTAGE.equals(modifier.getModifierType());
    }

    @Override
    public BigDecimal apply(BigDecimal price, PriceModifierDTO modifier, BigDecimal rangeValue, Integer fixedQuantity) {
        if (price == null || modifier == null) {
            return price;
        }
        
        BigDecimal percentValue = modifier.getValue();
        return PriceCalculationConstants.applyPercentage(price, percentValue);
    }
}
