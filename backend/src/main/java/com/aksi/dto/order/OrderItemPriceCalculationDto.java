package com.aksi.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO для детальної інформації про розрахунок ціни предмета замовлення.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemPriceCalculationDto {
    
    /**
     * Базова ціна предмета
     */
    private BigDecimal basePrice;
    
    /**
     * Початкова базова ціна x кількість
     */
    private BigDecimal basePriceWithQuantity;
    
    /**
     * Кількість
     */
    private BigDecimal quantity;
    
    /**
     * Фінальна ціна після всіх модифікаторів
     */
    private BigDecimal finalPrice;
    
    /**
     * Список застосованих модифікаторів з детальною інформацією
     */
    @Builder.Default
    private List<PriceModifierDetailDto> appliedModifiers = new ArrayList<>();
    
    /**
     * Інформація, що коефіцієнт для дитячих речей був застосований (-30%)
     */
    private boolean childSizeDiscountApplied;
    
    /**
     * Інформація, що надбавка за ручну чистку була застосована (+20%)
     */
    private boolean manualCleaningApplied;
    
    /**
     * Інформація, що надбавка за сильне забруднення була застосована
     */
    private boolean heavilySoiledApplied;
    
    /**
     * Відсоток надбавки за сильне забруднення
     */
    private Integer heavilySoiledPercentage;
}
