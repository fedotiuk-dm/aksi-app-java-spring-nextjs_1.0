package com.aksi.domain.order.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для детальної інформації про предмет замовлення.
 * Містить повну інформацію про предмет з розрахунком вартості.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Детальна інформація про предмет замовлення з розрахунком вартості")
public class OrderItemDetailedDTO {

    /**
     * ID предмета замовлення.
     */
    @Schema(description = "ID предмета замовлення", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    /**
     * Найменування предмета.
     */
    @Schema(description = "Найменування предмета", example = "Пальто")
    private String name;

    /**
     * Категорія послуги.
     */
    @Schema(description = "Категорія послуги", example = "Чистка одягу та текстилю")
    private String category;

    /**
     * Кількість.
     */
    @Schema(description = "Кількість", example = "1.00")
    private BigDecimal quantity;

    /**
     * Одиниця виміру.
     */
    @Schema(description = "Одиниця виміру", example = "шт")
    private String unitOfMeasure;

    /**
     * Матеріал предмета.
     */
    @Schema(description = "Матеріал предмета", example = "Шерсть")
    private String material;

    /**
     * Колір предмета.
     */
    @Schema(description = "Колір предмета", example = "Чорний")
    private String color;

    /**
     * Наповнювач предмета (якщо є).
     */
    @Schema(description = "Наповнювач предмета", example = "Пух")
    private String filler;

    /**
     * Прапорець, що вказує, чи є наповнювач збитим.
     */
    @Schema(description = "Прапорець, що вказує, чи є наповнювач збитим", example = "true")
    private boolean fillerClumped;

    /**
     * Ступінь зносу (у відсотках).
     */
    @Schema(description = "Ступінь зносу (у відсотках)", example = "30")
    private Integer wearPercentage;

    /**
     * Список виявлених плям на предметі.
     */
    @Schema(description = "Список виявлених плям на предметі")
    private List<String> stains;

    /**
     * Список виявлених дефектів та ризиків.
     */
    @Schema(description = "Список виявлених дефектів та ризиків")
    private List<String> defects;

    /**
     * Примітки щодо дефектів.
     */
    @Schema(description = "Примітки щодо дефектів", example = "Потертості на рукавах")
    private String defectNotes;

    /**
     * Базова ціна предмета.
     */
    @Schema(description = "Базова ціна предмета", example = "250.00")
    private BigDecimal basePrice;

    /**
     * Список застосованих модифікаторів ціни.
     */
    @Schema(description = "Список застосованих модифікаторів ціни")
    private List<PriceModifierDTO> priceModifiers;

    /**
     * Фінальна ціна предмета.
     */
    @Schema(description = "Фінальна ціна предмета", example = "300.00")
    private BigDecimal finalPrice;

    /**
     * Фотографії предмета.
     */
    @Schema(description = "Фотографії предмета")
    private List<OrderItemPhotoDTO> photos;
}
