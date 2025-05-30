package com.aksi.ui.wizard.step2.substeps.pricing_calculator.events;

import java.math.BigDecimal;
import java.util.Set;

import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.ui.wizard.step2.substeps.pricing_calculator.domain.PriceCalculationState;

/**
 * Events для координації між компонентами калькулятора цін.
 * Дотримуємось принципу інверсії залежностей (DIP).
 */
public sealed interface PriceCalculationEvents {

    /**
     * Подія запиту розрахунку ціни.
     */
    record CalculationRequested(
            String itemCategory,
            String itemName,
            BigDecimal basePrice,
            Set<PriceModifierDTO> selectedModifiers
    ) implements PriceCalculationEvents {}

    /**
     * Подія завершення розрахунку ціни.
     */
    record CalculationCompleted(
            PriceCalculationState calculationState
    ) implements PriceCalculationEvents {}

    /**
     * Подія помилки розрахунку.
     */
    record CalculationFailed(
            String errorMessage,
            Throwable cause
    ) implements PriceCalculationEvents {}

    /**
     * Подія зміни вибраних модифікаторів.
     */
    record ModifiersChanged(
            Set<PriceModifierDTO> selectedModifiers
    ) implements PriceCalculationEvents {}

    /**
     * Подія запиту завантаження модифікаторів для категорії.
     */
    record ModifiersLoadRequested(
            String categoryCode
    ) implements PriceCalculationEvents {}

    /**
     * Подія завершення завантаження модифікаторів.
     */
    record ModifiersLoaded(
            String categoryCode,
            java.util.List<PriceModifierDTO> modifiers
    ) implements PriceCalculationEvents {}

    /**
     * Подія запиту базової ціни для предмета.
     */
    record BasePriceRequested(
            String itemCategory,
            String itemName
    ) implements PriceCalculationEvents {}

    /**
     * Подія отримання базової ціни.
     */
    record BasePriceLoaded(
            String itemCategory,
            String itemName,
            BigDecimal basePrice
    ) implements PriceCalculationEvents {}
}
