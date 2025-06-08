package com.aksi.domain.order.statemachine.stage3.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;
import com.aksi.domain.order.model.DiscountType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 3.2 "Знижки (глобальні для замовлення)".
 *
 * Використовує композицію з існуючими DTO для роботи зі знижками:
 * - OrderDiscountRequest для вхідних параметрів
 * - OrderDiscountResponse для результатів розрахунків
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDiscountDTO {

    /**
     * Запит на застосування знижки.
     */
    private OrderDiscountRequest discountRequest;

    /**
     * Відповідь з результатами розрахунку знижки.
     */
    private OrderDiscountResponse discountResponse;

    /**
     * Список категорій в замовленні для аналізу можливості застосування знижки.
     */
    private List<String> orderItemCategories;

    /**
     * Чи має замовлення категорії що не підлягають знижкам.
     */
    @Builder.Default
    private Boolean hasNonDiscountableItems = false;

    /**
     * Чи показувати попередження про неможливість застосування знижки.
     */
    @Builder.Default
    private Boolean showDiscountWarning = false;

    /**
     * Текст попередження про знижку.
     */
    private String discountWarningText;

    /**
     * Чи є помилки у валідації.
     */
    @Builder.Default
    private Boolean hasErrors = false;

    /**
     * Список помилок валідації.
     */
    private List<String> errors;

    /**
     * Час останнього оновлення.
     */
    private LocalDateTime lastUpdated;

    // Utility методи для зручності доступу до полів з композиційних DTO

    /**
     * Отримує тип знижки з discountRequest.
     */
    public DiscountType getDiscountType() {
        return discountRequest != null ? discountRequest.getDiscountType() : DiscountType.NO_DISCOUNT;
    }

    /**
     * Встановлює тип знижки в discountRequest.
     */
    public void setDiscountType(DiscountType discountType) {
        if (discountRequest == null) {
            discountRequest = OrderDiscountRequest.builder().build();
        }
        discountRequest.setDiscountType(discountType);
    }

    /**
     * Отримує відсоток знижки з discountRequest.
     */
    public Integer getDiscountPercentage() {
        return discountRequest != null ? discountRequest.getDiscountPercentage() : null;
    }

    /**
     * Встановлює відсоток знижки в discountRequest.
     */
    public void setDiscountPercentage(Integer percentage) {
        if (discountRequest == null) {
            discountRequest = OrderDiscountRequest.builder().build();
        }
        discountRequest.setDiscountPercentage(percentage);
    }

    /**
     * Отримує опис знижки з discountRequest.
     */
    public String getDiscountDescription() {
        return discountRequest != null ? discountRequest.getDiscountDescription() : null;
    }

    /**
     * Встановлює опис знижки в discountRequest.
     */
    public void setDiscountDescription(String description) {
        if (discountRequest == null) {
            discountRequest = OrderDiscountRequest.builder().build();
        }
        discountRequest.setDiscountDescription(description);
    }

    /**
     * Отримує ID замовлення з discountRequest.
     */
    public UUID getOrderId() {
        return discountRequest != null ? discountRequest.getOrderId() : null;
    }

    /**
     * Встановлює ID замовлення в discountRequest.
     */
    public void setOrderId(UUID orderId) {
        if (discountRequest == null) {
            discountRequest = OrderDiscountRequest.builder().build();
        }
        discountRequest.setOrderId(orderId);
    }

    /**
     * Отримує загальну суму замовлення з discountResponse.
     */
    public BigDecimal getTotalAmount() {
        return discountResponse != null ? discountResponse.getTotalAmount() : null;
    }

    /**
     * Отримує суму знижки з discountResponse.
     */
    public BigDecimal getDiscountAmount() {
        return discountResponse != null ? discountResponse.getDiscountAmount() : null;
    }

    /**
     * Отримує фінальну суму замовлення з discountResponse.
     */
    public BigDecimal getFinalAmount() {
        return discountResponse != null ? discountResponse.getFinalAmount() : null;
    }

    /**
     * Отримує список неприйнятних для знижки категорій з discountResponse.
     */
    public List<String> getNonDiscountableCategories() {
        return discountResponse != null ? discountResponse.getNonDiscountableCategories() : List.of();
    }

    /**
     * Отримує суму неприйнятних для знижки категорій з discountResponse.
     */
    public BigDecimal getNonDiscountableAmount() {
        return discountResponse != null ? discountResponse.getNonDiscountableAmount() : BigDecimal.ZERO;
    }

    /**
     * Перевіряє чи обрана знижка (не NO_DISCOUNT).
     */
    public boolean hasDiscountSelected() {
        return getDiscountType() != null && getDiscountType() != DiscountType.NO_DISCOUNT;
    }

    /**
     * Перевіряє чи є активна знижка з сумою більше нуля.
     */
    public boolean hasActiveDiscount() {
        return hasDiscountSelected() && getDiscountAmount() != null &&
               getDiscountAmount().compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє чи вибраний тип знижки CUSTOM.
     */
    public boolean isCustomDiscount() {
        return getDiscountType() == DiscountType.CUSTOM;
    }
}
