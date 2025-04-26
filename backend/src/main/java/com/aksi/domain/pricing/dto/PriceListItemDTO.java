package com.aksi.domain.pricing.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceListItemDTO {
    private UUID id;
    private UUID categoryId;
    private Integer catalogNumber;
    private String name;
    private String unitOfMeasure;
    private BigDecimal basePrice;
    private BigDecimal priceBlack;
    private BigDecimal priceColor;
    private boolean active; // булеве поле без префіксу 'is' для коректної роботи з JavaBeans
}

