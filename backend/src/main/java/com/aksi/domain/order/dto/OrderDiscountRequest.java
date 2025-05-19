package com.aksi.domain.order.dto;

import java.util.UUID;

import com.aksi.domain.order.model.DiscountType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту на застосування знижки до замовлення
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDiscountRequest {

    /**
     * ID замовлення
     */
    @NotNull(message = "ID замовлення обов'язковий")
    private UUID orderId;

    /**
     * Тип знижки
     */
    @NotNull(message = "Тип знижки обов'язковий")
    private DiscountType discountType;

    /**
     * Відсоток знижки (для користувацького типу знижки)
     * Діапазон від 0 до 100
     */
    @Min(value = 0, message = "Відсоток знижки не може бути меншим за 0")
    @Max(value = 100, message = "Відсоток знижки не може бути більшим за 100")
    private Integer discountPercentage;

    /**
     * Опис знижки (для користувацького типу знижки)
     */
    @Size(max = 255, message = "Опис знижки не може перевищувати 255 символів")
    private String discountDescription;
}
