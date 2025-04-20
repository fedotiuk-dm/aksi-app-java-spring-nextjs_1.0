package com.aksi.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Data Transfer Object for OrderItemModifier entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemModifierDto {
    private UUID id;
    private UUID orderItemId;
    private String name;
    private String description;
    private String type;
    private BigDecimal value;
    private BigDecimal priceImpact;
    private Boolean replacesBasePrice;
    private Integer applicationOrder;
}
