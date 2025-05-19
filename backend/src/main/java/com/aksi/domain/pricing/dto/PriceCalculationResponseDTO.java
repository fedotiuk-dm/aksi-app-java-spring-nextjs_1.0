package com.aksi.domain.pricing.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді на запит розрахунку ціни.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceCalculationResponseDTO {

    /**
     * Початкова базова ціна за одиницю з прайс-листа.
     */
    private BigDecimal baseUnitPrice;

    /**
     * Кількість предметів.
     */
    private Integer quantity;

    /**
     * Сума базових цін за всі предмети без модифікаторів.
     */
    private BigDecimal baseTotalPrice;

    /**
     * Одиниця виміру (шт, кг, кв.м, пара).
     */
    private String unitOfMeasure;

    /**
     * Кінцева ціна за одиницю з урахуванням всіх модифікаторів.
     */
    private BigDecimal finalUnitPrice;

    /**
     * Загальна кінцева ціна за всі предмети з урахуванням всіх модифікаторів.
     */
    private BigDecimal finalTotalPrice;

    /**
     * Список деталей розрахунку для кожного кроку обчислення.
     */
    private List<CalculationDetailsDTO> calculationDetails;
}
