package com.aksi.domain.pricing.strategy;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

/**
 * Стратегія для застосування фіксованих модифікаторів, 
 * що замінюють базову ціну.
 */
@Component
public class FixedModifierStrategy implements ModifierStrategy {

    @Override
    public boolean supports(PriceModifierDTO modifier) {
        return modifier != null && ModifierType.FIXED.equals(modifier.getModifierType());
    }

    @Override
    public BigDecimal apply(BigDecimal price, PriceModifierDTO modifier, BigDecimal rangeValue, Integer fixedQuantity) {
        if (modifier == null) {
            return price;
        }
        
        // Фіксований модифікатор замінює базову ціну
        return modifier.getValue();
    }
}
