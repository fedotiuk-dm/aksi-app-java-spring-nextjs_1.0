package com.aksi.domain.order.dto.receipt;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для представлення предметів замовлення у квитанції
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptItemDTO {
    /**
     * ID предмета
     */
    private UUID id;

    /**
     * Порядковий номер у квитанції
     */
    private int orderNumber;

    /**
     * Найменування предмета
     */
    private String name;

    /**
     * Категорія послуги
     */
    private String serviceCategory;

    /**
     * Кількість або вага
     */
    private BigDecimal quantity;

    /**
     * Одиниця виміру (шт/кг)
     */
    private String unitOfMeasure;

    /**
     * Матеріал
     */
    private String material;

    /**
     * Колір
     */
    private String color;

    /**
     * Наповнювач (якщо є)
     */
    private String filler;

    /**
     * Ступінь зносу (%)
     */
    private Integer wearPercentage;

    /**
     * Базова вартість
     */
    private BigDecimal basePrice;

    /**
     * Фінальна ціна після модифікаторів
     */
    private BigDecimal finalPrice;

    /**
     * Список модифікаторів ціни
     */
    private List<ReceiptPriceModifierDTO> priceModifiers;

    /**
     * Список забруднень (плям)
     */
    private List<String> stains;

    /**
     * Список дефектів
     */
    private List<String> defects;

    /**
     * Примітки (включаючи "Без гарантій")
     */
    private String notes;
}
