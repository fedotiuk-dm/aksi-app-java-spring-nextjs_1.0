package com.aksi.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request DTO for creating a new order item modifier.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemModifierCreateRequest {
    /**
     * Name of the modifier.
     */
    @NotBlank(message = "Name is required")
    private String name;
    
    /**
     * Description of the modifier.
     */
    private String description;
    
    /**
     * Type of the modifier (percentage or fixed amount).
     */
    @NotBlank(message = "Type is required")
    private String type;
    
    /**
     * Value of the modifier (percentage or fixed amount depending on type).
     */
    @NotNull(message = "Value is required")
    private BigDecimal value;
    
    /**
     * Whether this modifier replaces the base price entirely.
     */
    private Boolean replacesBasePrice;
    
    /**
     * Order of application for this modifier (sequence).
     */
    @NotNull(message = "Application order is required")
    private Integer applicationOrder;
}
