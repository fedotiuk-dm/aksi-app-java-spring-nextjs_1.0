package com.aksi.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for detailed price calculation of an order item.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemCalculationDto {
    /**
     * The base price from the price list.
     */
    private BigDecimal basePrice;
    
    /**
     * Quantity of items.
     */
    private BigDecimal quantity;
    
    /**
     * The price after quantity calculation (basePrice * quantity).
     */
    private BigDecimal quantityPrice;
    
    /**
     * List of calculation steps with detailed information about each modifier.
     */
    @Builder.Default
    private List<CalculationStepDto> calculationSteps = new ArrayList<>();
    
    /**
     * The final price after all modifiers.
     */
    private BigDecimal finalPrice;
    
    /**
     * Add a calculation step.
     *
     * @param step The calculation step to add
     */
    public void addCalculationStep(CalculationStepDto step) {
        calculationSteps.add(step);
    }
    
    /**
     * DTO representing a single calculation step in the price calculation process.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CalculationStepDto {
        /**
         * Name of the modifier.
         */
        private String name;
        
        /**
         * Description of the modifier.
         */
        private String description;
        
        /**
         * Type of the modifier (percentage or fixed amount).
         */
        private String type;
        
        /**
         * Value of the modifier (percentage or fixed amount, depending on the type).
         */
        private BigDecimal value;
        
        /**
         * The price before this modifier was applied.
         */
        private BigDecimal priceBefore;
        
        /**
         * The monetary impact of this modifier.
         */
        private BigDecimal priceImpact;
        
        /**
         * The price after this modifier was applied.
         */
        private BigDecimal priceAfter;
        
        /**
         * Whether this modifier replaces the base price entirely.
         */
        private Boolean replacesBasePrice;
    }
}
