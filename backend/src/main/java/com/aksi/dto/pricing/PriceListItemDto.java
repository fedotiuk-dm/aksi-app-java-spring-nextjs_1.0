package com.aksi.dto.pricing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceListItemDto {
    private UUID id;
    private UUID categoryId;
    private Integer catalogNumber;
    private String name;
    private String unitOfMeasure;
    private BigDecimal basePrice;
    private BigDecimal priceBlack;
    private BigDecimal priceColor;
    private Boolean isActive; // зберігаємо з префіксом 'is' для сумісності з фронтендом
}
