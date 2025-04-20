package com.aksi.service.order;

import com.aksi.domain.order.entity.*;
import com.aksi.domain.pricing.entity.PriceListItem;
import com.aksi.domain.pricing.entity.ServiceCategory;
import com.aksi.dto.order.OrderItemCalculationDto;
import com.aksi.dto.order.OrderItemModifierCreateRequest;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service interface for price calculations in the order system.
 */
public interface PriceCalculationService {

    /**
     * Calculate the final price for an order item based on its properties and modifiers.
     *
     * @param orderItem The order item to calculate the price for
     * @return The calculated final price
     */
    BigDecimal calculateFinalPrice(OrderItem orderItem);
    
    /**
     * Calculate price for an item during the order wizard process, before the item is saved.
     * This provides a detailed breakdown of the calculation process.
     *
     * @param priceListItem The price list item which serves as the base for calculation
     * @param serviceCategory The service category of the item
     * @param material The material of the item
     * @param color The color of the item
     * @param quantity The quantity of the item
     * @param isChildSized Whether the item is child-sized
     * @param isManualCleaning Whether manual cleaning is required
     * @param isHeavilySoiled Whether the item is heavily soiled
     * @param heavilySoiledPercentage The percentage surcharge for heavily soiled items
     * @param modifiers List of modifiers to apply
     * @return A DTO with the detailed price calculation
     */
    OrderItemCalculationDto calculateItemPrice(
            PriceListItem priceListItem, 
            ServiceCategory serviceCategory,
            String material,
            String color,
            BigDecimal quantity,
            Boolean isChildSized,
            Boolean isManualCleaning,
            Boolean isHeavilySoiled,
            Integer heavilySoiledPercentage,
            List<OrderItemModifierCreateRequest> modifiers);
    
    /**
     * Apply a global discount to an order total, respecting the rules about which items can receive discounts.
     *
     * @param order The order to apply the discount to
     * @param discountType The type of discount to apply
     * @param customDiscountPercentage Custom discount percentage (only used if discountType is CUSTOM)
     * @return The total after discount
     */
    BigDecimal applyOrderDiscount(Order order, DiscountType discountType, Integer customDiscountPercentage);
    
    /**
     * Apply urgency surcharge to an order total.
     *
     * @param order The order to apply the urgency surcharge to
     * @param urgencyType The type of urgency
     * @return The total after urgency surcharge
     */
    BigDecimal applyUrgencySurcharge(Order order, UrgencyType urgencyType);
    
    /**
     * Recalculate all prices for an order, including item prices, discounts, and urgency.
     *
     * @param order The order to recalculate
     */
    void recalculateOrderTotals(Order order);
    
    /**
     * Check if a category is eligible for discounts.
     *
     * @param categoryName The name of the category to check
     * @return true if the category can receive discounts, false otherwise
     */
    boolean isCategoryEligibleForDiscount(String categoryName);
}
