package com.aksi.domain.catalog.entity;

import com.aksi.domain.order.entity.StainType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Сутність для рекомендацій модифікаторів, які слід застосувати
 * залежно від типу забруднення.
 */
@Entity
@Table(name = "stain_modifier_recommendations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StainModifierRecommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Тип забруднення.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "stain_type", nullable = false)
    private StainType stainType;

    /**
     * Назва рекомендованого модифікатора.
     */
    @Column(name = "modifier_name", nullable = false)
    private String modifierName;

    /**
     * Тип модифікатора (PERCENTAGE або FIXED).
     */
    @Column(name = "modifier_type", nullable = false)
    private String modifierType;

    /**
     * Значення модифікатора.
     */
    @Column(name = "modifier_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal modifierValue;

    /**
     * Опис, який пояснює, чому рекомендується цей модифікатор.
     */
    @Column
    private String description;

    /**
     * Пріоритет для сортування рекомендацій.
     * Рекомендації з вищим пріоритетом відображаються першими.
     */
    @Column(nullable = false)
    private Integer priority;
}
