package com.aksi.domain.order.statemachine.stage2.substep4.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 2.4: Знижки та надбавки (калькулятор ціни).
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class PriceDiscountDTO {

    /**
     * Запит на розрахунок ціни з модифікаторами.
     */
    private PriceCalculationRequestDTO calculationRequest;

    /**
     * Результат розрахунку ціни.
     */
    private PriceCalculationResponseDTO calculationResponse;

    /**
     * Список обраних модифікаторів ID.
     */
    @Builder.Default
    private List<String> selectedModifierIds = new ArrayList<>();

    /**
     * Значення для модифікаторів діапазону.
     */
    @Builder.Default
    private List<PriceCalculationRequestDTO.RangeModifierValueDTO> rangeModifierValues = new ArrayList<>();

    /**
     * Кількості для модифікаторів з фіксованою ціною.
     */
    @Builder.Default
    private List<PriceCalculationRequestDTO.FixedModifierQuantityDTO> fixedModifierQuantities = new ArrayList<>();

    /**
     * Додаткові примітки до розрахунку.
     */
    private String calculationNotes;

    /**
     * Прапорець, що вказує чи розрахунок завершено.
     */
    @Builder.Default
    private boolean calculationCompleted = false;

    /**
     * Прапорець, що вказує чи є помилки в розрахунку.
     */
    @Builder.Default
    private boolean hasCalculationErrors = false;

    /**
     * Повідомлення про помилку (якщо є).
     */
    private String errorMessage;

    /**
     * Отримання базової ціни (базова ціна з результату розрахунку).
     */
    public BigDecimal getBasePrice() {
        return calculationResponse != null ? calculationResponse.getBaseUnitPrice() : null;
    }

    /**
     * Отримання фінальної ціни (фінальна ціна з результату розрахунку).
     */
    public BigDecimal getFinalPrice() {
        return calculationResponse != null ? calculationResponse.getFinalTotalPrice() : null;
    }

    /**
     * Отримання деталей розрахунку.
     */
    public List<CalculationDetailsDTO> getCalculationDetails() {
        return calculationResponse != null ? calculationResponse.getCalculationDetails() : new ArrayList<>();
    }

    /**
     * Перевірка, чи є модифікатори в розрахунку.
     */
    public boolean hasModifiers() {
        return !selectedModifierIds.isEmpty() ||
               !rangeModifierValues.isEmpty() ||
               !fixedModifierQuantities.isEmpty();
    }

    /**
     * Отримання кількості застосованих модифікаторів.
     */
    public int getModifiersCount() {
        return selectedModifierIds.size() +
               rangeModifierValues.size() +
               fixedModifierQuantities.size();
    }
}
