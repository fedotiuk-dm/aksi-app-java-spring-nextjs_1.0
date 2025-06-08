package com.aksi.domain.order.statemachine.stage2.substep1.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для предметів з прайс-листа
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceListItemDTO {

    /**
     * ID предмета
     */
    private String id;

    /**
     * Код предмета
     */
    private String code;

    /**
     * Номер у прайс-листі
     */
    private String number;

    /**
     * Назва предмета
     */
    private String name;

    /**
     * Категорія до якої належить предмет
     */
    private String categoryCode;

    /**
     * Базова ціна
     */
    private BigDecimal basePrice;

    /**
     * Одиниця виміру
     */
    private String unitOfMeasure;

    /**
     * Чи активний предмет
     */
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Опис предмета
     */
    private String description;

    /**
     * Примітки
     */
    private String notes;

    /**
     * Чи може мати різну ціну для різних кольорів
     */
    @Builder.Default
    private Boolean hasColorVariants = false;

    /**
     * Альтернативна ціна для чорного кольору
     */
    private BigDecimal blackColorPrice;

    /**
     * Мінімальна кількість для замовлення
     */
    @Builder.Default
    private Integer minQuantity = 1;

    /**
     * Максимальна кількість для замовлення
     */
    private Integer maxQuantity;

    /**
     * Рекомендовані матеріали для цього предмета
     */
    private String recommendedMaterials;

    /**
     * Термін виконання для цього предмета (у днях)
     */
    @Builder.Default
    private Integer deliveryDays = 2;
}
