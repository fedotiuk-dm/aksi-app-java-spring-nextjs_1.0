package com.aksi.domain.order.statemachine.stage2.substep1.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для основної інформації про предмет (Підетап 2.1)
 *
 * Містить:
 * - Категорію послуги
 * - Найменування предмета
 * - Кількість та одиницю виміру
 * - Базову ціну
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class BasicInfoDTO {

    /**
     * ID категорії послуги
     */
    @NotBlank(message = "Категорія обов'язкова")
    private String categoryId;

    /**
     * Код категорії послуги
     */
    @NotBlank(message = "Код категорії обов'язковий")
    private String categoryCode;

    /**
     * Назва категорії послуги
     */
    private String categoryName;

    /**
     * ID предмета з прайс-листа
     */
    private String itemId;

    /**
     * Код предмета з прайс-листа
     */
    private String itemCode;

    /**
     * Назва предмета
     */
    @NotBlank(message = "Назва предмета обов'язкова")
    @Size(max = 255, message = "Назва предмета не може перевищувати 255 символів")
    private String itemName;

    /**
     * Опис предмета
     */
    @Size(max = 1000, message = "Опис не може перевищувати 1000 символів")
    private String description;

    /**
     * Кількість предметів
     */
    @NotNull(message = "Кількість обов'язкова")
    @Min(value = 1, message = "Кількість має бути не менше 1")
    private Integer quantity;

    /**
     * Одиниця виміру
     */
    @NotBlank(message = "Одиниця виміру обов'язкова")
    private String unitOfMeasure;

    /**
     * Базова ціна за одиницю (з прайс-листа)
     */
    private BigDecimal basePrice;

    /**
     * Чи валідна основна інформація
     */
    @Builder.Default
    private Boolean isValid = false;

    /**
     * Список помилок валідації
     */
    @Builder.Default
    private List<String> validationErrors = List.of();

    /**
     * Перевіряє чи заповнені всі обов'язкові поля
     */
    public boolean isComplete() {
        return categoryId != null && !categoryId.trim().isEmpty() &&
               categoryCode != null && !categoryCode.trim().isEmpty() &&
               itemName != null && !itemName.trim().isEmpty() &&
               quantity != null && quantity > 0 &&
               unitOfMeasure != null && !unitOfMeasure.trim().isEmpty();
    }

    /**
     * Перевіряє чи вибраний предмет з прайс-листа
     */
    public boolean isPriceListItemSelected() {
        return itemId != null && !itemId.trim().isEmpty();
    }

    /**
     * Перевіряє чи введена кастомна назва предмета
     */
    public boolean isCustomItemName() {
        return !isPriceListItemSelected() &&
               itemName != null && !itemName.trim().isEmpty();
    }
}
