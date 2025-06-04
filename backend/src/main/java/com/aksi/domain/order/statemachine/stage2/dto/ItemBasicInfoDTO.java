package com.aksi.domain.order.statemachine.stage2.dto;

import java.math.BigDecimal;
import java.util.List;

import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 2.1 "Основна інформація про предмет".
 *
 * Відповідає за:
 * - Категорію послуги
 * - Найменування виробу (динамічний список на основі категорії)
 * - Одиницю виміру і кількість
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ItemBasicInfoDTO {

    // === Основна інформація ===

    /**
     * Вибрана категорія послуги
     */
    private ServiceCategoryDTO selectedCategory;

    /**
     * Список доступних категорій послуг
     */
    private List<ServiceCategoryDTO> availableCategories;

    /**
     * Вибране найменування виробу
     */
    private PriceListItemDTO selectedItem;

    /**
     * Список доступних найменувань для вибраної категорії
     */
    private List<PriceListItemDTO> availableItems;

    /**
     * Кількість
     */
    private Integer quantity;

    /**
     * Одиниця виміру (автоматично на основі вибраного виробу)
     */
    private String unitOfMeasure;

    /**
     * Базова ціна за одиницю (автоматично на основі вибраного виробу)
     */
    private BigDecimal basePrice;

    // === Стан UI ===

    /**
     * Чи можна переходити до наступного підетапу
     */
    private Boolean canProceedToNext;

    /**
     * Повідомлення валідації
     */
    private String validationMessage;

    /**
     * Чи завантажуються дані
     */
    private Boolean isLoading;

    /**
     * Чи є помилки валідації
     */
    private Boolean hasErrors;

    /**
     * Повідомлення про помилку
     */
    private String errorMessage;

    // === Допоміжні методи ===

        /**
     * Перевіряє, чи вибрана категорія послуги.
     */
    public boolean hasSelectedCategory() {
        return selectedCategory != null && selectedCategory.getId() != null;
    }

    /**
     * Перевіряє, чи вибране найменування виробу.
     */
    public boolean hasSelectedItem() {
        return selectedItem != null && selectedItem.getId() != null;
    }

    /**
     * Перевіряє, чи вказана кількість.
     */
    public boolean hasValidQuantity() {
        return quantity != null && quantity > 0;
    }

    /**
     * Перевіряє, чи є помилки валідації.
     */
    public boolean hasValidationIssues() {
        return validationMessage != null && !validationMessage.trim().isEmpty();
    }

    /**
     * Перевіряє, чи заповнена вся основна інформація.
     */
    public boolean isCompleted() {
        return hasSelectedCategory() && hasSelectedItem() && hasValidQuantity();
    }


}
