package com.aksi.domain.order.statemachine.stage2.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для тимчасового зберігання інформації про предмет
 * під час роботи підвізарда предметів (етап 2).
 *
 * Використовується для збереження даних у стані state machine
 * перед остаточним збереженням в базу даних.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TempOrderItemDTO {

    // === Основна інформація (підетап 2.1) ===
    private String category;                // Категорія послуги
    private String name;                    // Найменування виробу
    private String unitOfMeasure;           // Одиниця виміру (шт/кг)
    private Integer quantity;               // Кількість
    private String description;             // Опис

    // === Характеристики (підетап 2.2) ===
    private String material;                // Матеріал
    private String color;                   // Колір
    private String fillerType;              // Наповнювач
    private Boolean fillerCompressed;       // Збитий наповнювач
    private String wearDegree;              // Ступінь зносу

    // === Забруднення, дефекти та ризики (підетап 2.3) ===
    private String stains;                  // Плями (JSON або розділені комою)
    private String otherStains;             // Інші плями (вручну)
    private String defectsAndRisks;         // Дефекти та ризики (JSON або розділені комою)
    private String defectsNotes;            // Примітки щодо дефектів
    private String noGuaranteeReason;       // Причина відсутності гарантій

    // === Ціноутворення (підетап 2.4) ===
    private BigDecimal unitPrice;           // Базова ціна за одиницю
    private BigDecimal totalPrice;          // Фінальна ціна за предмет
    private List<String> appliedModifiers;  // Застосовані модифікатори
    private String priceCalculationDetails; // Деталізація розрахунку

    // === Фотодокументація (підетап 2.5) ===
    private List<String> photoIds;          // Ідентифікатори фотографій
    private List<String> photoUrls;         // URL фотографій
    private Boolean hasPhotos;              // Чи є фотографії

    // === Додаткова інформація ===
    private String specialInstructions;     // Спеціальні інструкції
    private String defects;                 // Загальні дефекти

    // === Службові поля ===
    private Boolean isValid;                // Чи валідний предмет
    private String validationErrors;        // Помилки валідації
    private Integer wizardStep;             // Поточний крок підвізарда (1-5)

    /**
     * Перевіряє, чи заповнена основна інформація про предмет.
     */
    public boolean hasBasicInfo() {
        return category != null && !category.trim().isEmpty() &&
               name != null && !name.trim().isEmpty() &&
               quantity != null && quantity > 0;
    }

    /**
     * Перевіряє, чи заповнені характеристики предмета.
     */
    public boolean hasCharacteristics() {
        return material != null && !material.trim().isEmpty() &&
               color != null && !color.trim().isEmpty();
    }

    /**
     * Перевіряє, чи має предмет ціну.
     */
    public boolean hasPrice() {
        return unitPrice != null && unitPrice.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє, чи має предмет фотографії.
     */
    public boolean hasPhotos() {
        return hasPhotos != null && hasPhotos &&
               photoIds != null && !photoIds.isEmpty();
    }

    /**
     * Перевіряє, чи готовий предмет до додавання в замовлення.
     */
    public boolean isReadyForOrder() {
        return hasBasicInfo() && hasCharacteristics() && hasPrice();
    }

    /**
     * Скидає ціноутворення для перерахунку.
     */
    public void resetPricing() {
        this.unitPrice = null;
        this.totalPrice = null;
        this.appliedModifiers = null;
        this.priceCalculationDetails = null;
    }

    /**
     * Отримує відсоток прогресу заповнення підвізарда (0-100).
     */
    public int getCompletionPercentage() {
        int completed = 0;
        int total = 5; // 5 основних кроків

        if (hasBasicInfo()) completed++;
        if (hasCharacteristics()) completed++;
        if (stains != null || defectsAndRisks != null) completed++;
        if (hasPrice()) completed++;
        if (hasPhotos()) completed++;

        return (completed * 100) / total;
    }
}
