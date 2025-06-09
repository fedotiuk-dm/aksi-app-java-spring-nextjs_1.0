package com.aksi.domain.order.statemachine.stage2.substep1.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для основної інформації про предмет (підетап 2.1)
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ItemBasicInfoDTO {

    /**
     * Унікальний ідентифікатор предмета в межах замовлення
     */
    private UUID itemId;

    /**
     * Вибрана категорія послуги
     */
    private ServiceCategoryDTO serviceCategory;

    /**
     * Вибране найменування виробу з прайс-листа
     */
    private PriceListItemDTO priceListItem;

    /**
     * Одиниця виміру (копіюється з прайс-листа для кешування)
     */
    private String unitOfMeasure;

    /**
     * Кількість предметів
     */
    private BigDecimal quantity;

    /**
     * Базова вартість (розраховується як quantity * basePrice)
     */
    private BigDecimal totalBasePrice;

    /**
     * Чи всі обов'язкові поля заповнені
     */
    private boolean isComplete;

    /**
     * Чи пройшла валідація
     */
    private boolean isValid;
}
