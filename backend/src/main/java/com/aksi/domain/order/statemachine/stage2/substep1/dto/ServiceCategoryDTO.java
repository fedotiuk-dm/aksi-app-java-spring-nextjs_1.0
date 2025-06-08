package com.aksi.domain.order.statemachine.stage2.substep1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для категорії послуг
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCategoryDTO {

    /**
     * ID категорії
     */
    private String id;

    /**
     * Код категорії
     */
    private String code;

    /**
     * Назва категорії
     */
    private String name;

    /**
     * Опис категорії
     */
    private String description;

    /**
     * Чи активна категорія
     */
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Рекомендована одиниця виміру для цієї категорії
     */
    private String recommendedUnitOfMeasure;

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
     * Очікуваний термін виконання (у днях)
     */
    @Builder.Default
    private Integer expectedDeliveryDays = 2;
}
