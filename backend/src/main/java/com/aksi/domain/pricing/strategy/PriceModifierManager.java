package com.aksi.domain.pricing.strategy;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.pricing.constants.PriceCalculationConstants;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.exception.InvalidModifierTypeException;
import com.aksi.domain.pricing.exception.InvalidPriceCalculationParameterException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Менеджер цінових модифікаторів, який відповідає за вибір
 * та застосування правильної стратегії для заданого модифікатора.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PriceModifierManager {
    
    /**
     * Список всіх доступних стратегій, автоматично внесених через DI.
     */
    private final List<ModifierStrategy> strategies;
    
    /**
     * Застосовує найбільш підходящу стратегію модифікатора до вказаної ціни.
     *
     * @param price ціна для модифікації
     * @param modifier модифікатор ціни
     * @param rangeValue конкретне значення для діапазону (опціонально)
     * @param fixedQuantity кількість для фіксованого модифікатора (опціонально)
     * @return модифікована ціна
     * @throws InvalidPriceCalculationParameterException якщо передані недійсні параметри
     * @throws InvalidModifierTypeException якщо тип модифікатора не підтримується
     */
    public BigDecimal applyModifier(BigDecimal price, PriceModifierDTO modifier, BigDecimal rangeValue, Integer fixedQuantity) {
        // Валідація вхідних параметрів
        if (price == null) {
            throw new InvalidPriceCalculationParameterException("Price cannot be null");
        }
        if (modifier == null) {
            throw new InvalidPriceCalculationParameterException("Modifier cannot be null");
        }
        if (modifier.getModifierType() == null) {
            throw new InvalidPriceCalculationParameterException("Modifier type cannot be null for modifier: " + modifier.getCode());
        }

        // Знаходимо відповідну стратегію для цього типу модифікатора
        BigDecimal result = strategies.stream()
                .filter(strategy -> strategy.supports(modifier))
                .findFirst()
                .map(strategy -> {
                    try {
                        return strategy.apply(price, modifier, rangeValue, fixedQuantity);
                    } catch (Exception e) {
                        // Логуємо помилку і перетворюємо її на бізнес-виняток
                        log.error("Error applying price modifier {}: {}", modifier.getCode(), e.getMessage(), e);
                        throw new InvalidPriceCalculationParameterException(
                                "Failed to apply modifier " + modifier.getCode() + ": " + e.getMessage(), e);
                    }
                })
                .orElseThrow(() -> {
                    // Якщо стратегія не знайдена, генеруємо відповідний виняток
                    log.warn("No strategy found for modifier type: {}", modifier.getModifierType());
                    return new InvalidModifierTypeException(
                            "No strategy found for modifier type: " + modifier.getModifierType(), 
                            modifier.getModifierType());
                });
                
        // Ціна не може бути менше мінімальної
        return result.compareTo(PriceCalculationConstants.MIN_PRICE) < 0 
                ? PriceCalculationConstants.MIN_PRICE 
                : result;
    }
}
