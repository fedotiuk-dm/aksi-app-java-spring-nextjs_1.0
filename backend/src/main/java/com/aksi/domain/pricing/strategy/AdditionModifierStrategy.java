package com.aksi.domain.pricing.strategy;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.aksi.domain.pricing.constants.PriceCalculationConstants;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

/**
 * Стратегія для застосування модифікаторів з додаванням фіксованої суми.
 */
@Component
public class AdditionModifierStrategy implements ModifierStrategy {

    @Override
    public boolean supports(PriceModifierDTO modifier) {
        return modifier != null && ModifierType.ADDITION.equals(modifier.getModifierType());
    }

    @Override
    public BigDecimal apply(BigDecimal price, PriceModifierDTO modifier, BigDecimal rangeValue, Integer fixedQuantity) {
        if (price == null || modifier == null) {
            return price;
        }
        
        // Додавання фіксованої суми з урахуванням кількості
        BigDecimal valueToAdd = modifier.getValue();
        if (fixedQuantity != null && fixedQuantity > 1) {
            valueToAdd = valueToAdd.multiply(new BigDecimal(fixedQuantity));
        }
        
        return price.add(valueToAdd)
                .setScale(PriceCalculationConstants.SCALE, PriceCalculationConstants.ROUNDING_MODE);
    }
}
