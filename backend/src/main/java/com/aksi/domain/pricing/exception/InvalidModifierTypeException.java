package com.aksi.domain.pricing.exception;

import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierType;

/**
 * Виняток, який виникає коли тип модифікатора не підтримується
 * або не відповідає очікуваному.
 */
public class InvalidModifierTypeException extends PriceCalculationException {

    private final ModifierType providedType;

    /**
     * Створює новий виняток з вказаним повідомленням та типом модифікатора.
     *
     * @param message повідомлення про помилку
     * @param providedType тип модифікатора, який викликав помилку
     */
    public InvalidModifierTypeException(String message, ModifierType providedType) {
        super(message);
        this.providedType = providedType;
    }

    /**
     * Повертає тип модифікатора, який викликав помилку.
     *
     * @return тип модифікатора
     */
    public ModifierType getProvidedType() {
        return providedType;
    }
}
