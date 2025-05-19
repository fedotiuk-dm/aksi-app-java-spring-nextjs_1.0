package com.aksi.domain.pricing.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity для зберігання модифікаторів цін.
 * Замість хардкоду констант у коді, модифікатори тепер зберігаються в БД.
 */
@Entity
@Table(name = "price_modifier_definitions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceModifierDefinitionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Унікальний код модифікатора (для програмного використання)
     */
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    /**
     * Назва модифікатора
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Опис модифікатора
     */
    @Column(name = "description", length = 1000)
    private String description;

    /**
     * Тип модифікатора (PERCENTAGE, FIXED, RANGE_PERCENTAGE, ADDITION)
     */
    @Column(name = "modifier_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ModifierType modifierType;

    /**
     * Категорія модифікатора (GENERAL, TEXTILE, LEATHER)
     */
    @Column(name = "category", nullable = false)
    @Enumerated(EnumType.STRING)
    private ModifierCategory category;

    /**
     * Мінімальне значення для модифікаторів з діапазоном
     */
    @Column(name = "min_value", precision = 10, scale = 2)
    private BigDecimal minValue;

    /**
     * Максимальне значення для модифікаторів з діапазоном
     */
    @Column(name = "max_value", precision = 10, scale = 2)
    private BigDecimal maxValue;

    /**
     * Значення для фіксованих модифікаторів або відсоткових
     */
    @Column(name = "value", precision = 10, scale = 2)
    private BigDecimal value;

    /**
     * Активний/неактивний модифікатор
     */
    @Column(name = "active", nullable = false)
    private boolean active;

    /**
     * Порядок сортування для відображення
     */
    @Column(name = "sort_order")
    private Integer sortOrder;

    /**
     * Дата створення запису
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Дата останнього оновлення
     */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Тип модифікатора ціни
     */
    public enum ModifierType {
        /**
         * Відсотковий модифікатор (наприклад, +20% до вартості)
         */
        PERCENTAGE,

        /**
         * Фіксована ціна (наприклад, 10 грн за гудзик)
         */
        FIXED,

        /**
         * Відсотковий модифікатор з діапазоном (наприклад, +20% до +100%)
         */
        RANGE_PERCENTAGE,

        /**
         * Фіксована надбавка до ціни (наприклад, +50 грн)
         */
        ADDITION
    }

    /**
     * Категорія модифікатора ціни
     */
    public enum ModifierCategory {
        /**
         * Загальний модифікатор (застосовується до всіх категорій)
         */
        GENERAL,

        /**
         * Модифікатор для текстильних виробів
         */
        TEXTILE,

        /**
         * Модифікатор для шкіряних виробів
         */
        LEATHER
    }
}
