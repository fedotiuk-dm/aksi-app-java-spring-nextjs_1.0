package com.aksi.domain.pricing.dto;

import java.math.BigDecimal;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Результат розрахунку ціни для предмета")
public class PriceCalculationResponseDTO {

    @Schema(
        description = "Початкова базова ціна за одиницю з прайс-листа",
        example = "150.00",
        minimum = "0"
    )
    private BigDecimal baseUnitPrice;

    @Schema(
        description = "Кількість предметів",
        example = "2",
        minimum = "1"
    )
    private Integer quantity;

    @Schema(
        description = "Сума базових цін за всі предмети без модифікаторів",
        example = "300.00",
        minimum = "0"
    )
    private BigDecimal baseTotalPrice;

    @Schema(
        description = "Одиниця виміру",
        example = "шт",
        allowableValues = {"шт", "кг", "кв.м", "пара"}
    )
    private String unitOfMeasure;

    @Schema(
        description = "Кінцева ціна за одиницю з урахуванням всіх модифікаторів",
        example = "180.00",
        minimum = "0"
    )
    private BigDecimal finalUnitPrice;

    @Schema(
        description = "Загальна кінцева ціна за всі предмети з урахуванням всіх модифікаторів",
        example = "360.00",
        minimum = "0"
    )
    private BigDecimal finalTotalPrice;

    @Schema(description = "Список деталей розрахунку для кожного кроку обчислення")
    private List<CalculationDetailsDTO> calculationDetails;
}
