package com.aksi.domain.item.entity;

import java.util.Optional;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Entity для предметів прайс-листа
 */
@Entity
@Table(name = "price_list_items", indexes = {
    @Index(name = "idx_price_list_category", columnList = "category_id"),
    @Index(name = "idx_price_list_catalog", columnList = "catalog_number"),
    @Index(name = "idx_price_list_active", columnList = "is_active"),
    @Index(name = "idx_price_list_name", columnList = "name")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PriceListItemEntity extends BaseEntity {

    @Column(name = "uuid", updatable = false, nullable = false, unique = true)
    @UuidGenerator
    private UUID uuid;

    @NotNull(message = "Категорія обов'язкова")
    @Column(name = "category_id", nullable = false)
    private UUID categoryId;

    @NotNull(message = "Каталожний номер обов'язковий")
    @Min(value = 1, message = "Каталожний номер повинен бути більше 0")
    @Column(name = "catalog_number", nullable = false)
    private Integer catalogNumber;

    @NotBlank(message = "Назва предмета обов'язкова")
    @Size(max = 200, message = "Назва не може бути довше 200 символів")
    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @NotBlank(message = "Одиниця виміру обов'язкова")
    @Size(max = 20, message = "Одиниця виміру не може бути довше 20 символів")
    @Column(name = "unit_of_measure", nullable = false, length = 20)
    private String unitOfMeasure; // використовуємо String замість enum для простоти

    @NotNull(message = "Базова ціна обов'язкова")
    @DecimalMin(value = "0.01", message = "Базова ціна повинна бути більше 0")
    @Column(name = "base_price", nullable = false)
    private Double basePrice;

    @DecimalMin(value = "0.01", message = "Ціна для чорного повинна бути більше 0")
    @Column(name = "price_black")
    private Double priceBlack;

    @DecimalMin(value = "0.01", message = "Ціна для кольорового повинна бути більше 0")
    @Column(name = "price_color")
    private Double priceColor;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // ===== BUSINESS МЕТОДИ =====

    /**
     * Перевірити, чи є предмет активним
     */
    public boolean isActiveItem() {
        return Boolean.TRUE.equals(isActive);
    }

    /**
     * Отримати ціну залежно від кольору
     */
    public Double getPriceByColor(boolean isBlack) {
        if (isBlack && priceBlack != null) {
            return priceBlack;
        }
        if (!isBlack && priceColor != null) {
            return priceColor;
        }
        return basePrice;
    }

    /**
     * Перевірити, чи має різні ціни для кольорів
     */
    public boolean hasColorSpecificPricing() {
        return priceBlack != null || priceColor != null;
    }

    /**
     * Отримати найвищу ціну
     */
    public Double getMaxPrice() {
        double max = basePrice;
        if (priceBlack != null) {
            max = Math.max(max, priceBlack);
        }
        if (priceColor != null) {
            max = Math.max(max, priceColor);
        }
        return max;
    }

    /**
     * Отримати найнижчу ціну
     */
    public Double getMinPrice() {
        double min = basePrice;
        if (priceBlack != null) {
            min = Math.min(min, priceBlack);
        }
        if (priceColor != null) {
            min = Math.min(min, priceColor);
        }
        return min;
    }

    /**
     * Перевірити, чи предмет вимірюється в штуках
     */
    public boolean isMeasuredInPieces() {
        return "шт".equals(unitOfMeasure) || "пара".equals(unitOfMeasure);
    }

    /**
     * Перевірити, чи предмет вимірюється вагою
     */
    public boolean isMeasuredByWeight() {
        return "кг".equals(unitOfMeasure);
    }

    /**
     * Перевірити, чи предмет вимірюється площею
     */
    public boolean isMeasuredByArea() {
        return "кв.м".equals(unitOfMeasure);
    }

    /**
     * Активувати предмет
     */
    public void activate() {
        this.isActive = true;
    }

    /**
     * Деактивувати предмет
     */
    public void deactivate() {
        this.isActive = false;
    }

    /**
     * Перевірити валідність цін
     */
    public boolean hasValidPricing() {
        return basePrice != null && basePrice > 0;
    }

    /**
     * Розрахувати рекомендовану ціну з урахуванням кольору
     */
    public Double calculateRecommendedPrice(boolean isBlack, boolean isColored) {
        if (isBlack) {
            return priceBlack != null ? priceBlack : basePrice;
        }
        if (isColored) {
            return Optional.ofNullable(priceColor).orElse(Optional.ofNullable(basePrice).orElse(0.0) * 1.2); // 20% надбавка за колір
        }
        return basePrice;
    }
}
