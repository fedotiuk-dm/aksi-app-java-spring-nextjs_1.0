package com.aksi.domain.order.statemachine.stage2.substep4.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;
import com.aksi.domain.pricing.dto.CalculationDetailsDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для результату підетапу 2.4: Знижки та надбавки.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubstepResultDTO {

    /**
     * Поточний стан підетапу.
     */
    private PriceDiscountState currentState;

    /**
     * Дані підетапу (для внутрішнього використання).
     */
    private PriceDiscountDTO data;

    /**
     * Прапорець успішного виконання операції.
     */
    @Builder.Default
    private boolean success = false;

    /**
     * Повідомлення результату операції.
     */
    private String message;

    /**
     * Прапорець наявності помилок.
     */
    @Builder.Default
    private boolean hasErrors = false;

    /**
     * Базова ціна з прайс-листа.
     */
    private BigDecimal basePrice;

    /**
     * Фінальна ціна з усіма модифікаторами.
     */
    private BigDecimal finalPrice;

    /**
     * Кількість предметів.
     */
    private Integer quantity;

    /**
     * Одиниця виміру.
     */
    private String unitOfMeasure;

    /**
     * Список застосованих модифікаторів ID.
     */
    private List<String> appliedModifierIds;

    /**
     * Деталі розрахунку по кроках.
     */
    private List<CalculationDetailsDTO> calculationDetails;

    /**
     * Прапорець успішного завершення підетапу.
     */
    @Builder.Default
    private boolean completed = false;

    /**
     * Прапорець валідності даних.
     */
    @Builder.Default
    private boolean valid = false;

    /**
     * Повідомлення про помилку (якщо є).
     */
    private String errorMessage;

    /**
     * Примітки до розрахунку.
     */
    private String notes;

    /**
     * Перевірка, чи підетап завершено успішно.
     */
    public boolean isCompletedSuccessfully() {
        return completed && valid && currentState == PriceDiscountState.COMPLETED;
    }

    /**
     * Розрахунок різниці в ціні (економії або переплати).
     */
    public BigDecimal getPriceDifference() {
        if (basePrice != null && finalPrice != null) {
            return finalPrice.subtract(basePrice);
        }
        return BigDecimal.ZERO;
    }

    /**
     * Отримання відсотка зміни ціни.
     */
    public BigDecimal getPriceChangePercentage() {
        if (basePrice != null && basePrice.compareTo(BigDecimal.ZERO) > 0 && finalPrice != null) {
            BigDecimal difference = getPriceDifference();
            return difference.divide(basePrice, 4, RoundingMode.HALF_UP)
                           .multiply(new BigDecimal("100"));
        }
        return BigDecimal.ZERO;
    }
}
