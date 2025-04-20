package com.aksi.service.order.impl;

import com.aksi.domain.order.entity.*;
import com.aksi.domain.pricing.entity.PriceListItem;
import com.aksi.domain.pricing.entity.ServiceCategory;
import com.aksi.dto.order.OrderItemCalculationDto;
import com.aksi.dto.order.OrderItemCalculationDto.CalculationStepDto;
import com.aksi.dto.order.OrderItemModifierCreateRequest;
import com.aksi.service.order.PriceCalculationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Implementation of the PriceCalculationService interface.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceCalculationServiceImpl implements PriceCalculationService {

    /**
     * List of categories not eligible for discounts.
     */
    private static final List<String> CATEGORIES_NOT_ELIGIBLE_FOR_DISCOUNT = Arrays.asList(
            "IRONING", "LAUNDRY", "TEXTILE_DYEING"
    );

    @Override
    public BigDecimal calculateFinalPrice(OrderItem orderItem) {
        if (orderItem == null || orderItem.getBasePrice() == null) {
            return BigDecimal.ZERO;
        }

        // Start with base price * quantity
        BigDecimal price = orderItem.getBasePrice().multiply(orderItem.getQuantity());

        // Get all modifiers and sort them by application order
        List<OrderItemModifier> sortedModifiers = new ArrayList<>(orderItem.getModifiers());
        sortedModifiers.sort(Comparator.comparing(OrderItemModifier::getApplicationOrder));

        // Apply each modifier
        for (OrderItemModifier modifier : sortedModifiers) {
            // Skip if no value or the modifier is somehow invalid
            if (modifier.getValue() == null) {
                continue;
            }

            if (Boolean.TRUE.equals(modifier.getReplacesBasePrice())) {
                // If this modifier replaces the base price entirely
                price = modifier.getValue();
            } else {
                // Calculate the modifier impact based on its type
                BigDecimal modifierImpact;
                if ("PERCENTAGE".equals(modifier.getType())) {
                    modifierImpact = price.multiply(modifier.getValue())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                } else {
                    // Default to FIXED amount
                    modifierImpact = modifier.getValue();
                }

                // Apply the impact
                price = price.add(modifierImpact);
            }
        }

        // Apply child size discount (30% off)
        if (Boolean.TRUE.equals(orderItem.getChildSized())) {
            price = price.multiply(BigDecimal.valueOf(0.7))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        // Apply manual cleaning surcharge (20% extra)
        if (Boolean.TRUE.equals(orderItem.getManualCleaning())) {
            price = price.multiply(BigDecimal.valueOf(1.2))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        // Apply heavily soiled surcharge (variable %)
        if (Boolean.TRUE.equals(orderItem.getHeavilySoiled()) && orderItem.getHeavilySoiledPercentage() != null) {
            price = price.multiply(BigDecimal.ONE.add(BigDecimal.valueOf(orderItem.getHeavilySoiledPercentage())
                            .divide(BigDecimal.valueOf(100))))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        // Make sure the price isn't negative
        if (price.compareTo(BigDecimal.ZERO) < 0) {
            price = BigDecimal.ZERO;
        }

        // Round to 2 decimal places
        return price.setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public OrderItemCalculationDto calculateItemPrice(
            PriceListItem priceListItem,
            ServiceCategory serviceCategory,
            String material,
            String color,
            BigDecimal quantity,
            Boolean isChildSized,
            Boolean isManualCleaning,
            Boolean isHeavilySoiled,
            Integer heavilySoiledPercentage,
            List<OrderItemModifierCreateRequest> modifiers) {

        // Initialize the calculation DTO
        OrderItemCalculationDto calculationDto = new OrderItemCalculationDto();
        
        // Base price from price list
        BigDecimal basePrice = priceListItem.getBasePrice();
        calculationDto.setBasePrice(basePrice);
        calculationDto.setQuantity(quantity);
        
        // Calculate price with quantity
        BigDecimal price = basePrice.multiply(quantity).setScale(2, RoundingMode.HALF_UP);
        calculationDto.setQuantityPrice(price);
        
        // Start with the quantity-adjusted price
        BigDecimal runningTotal = price;
        
        // Sort modifiers by application order
        if (modifiers != null && !modifiers.isEmpty()) {
            modifiers.sort(Comparator.comparing(OrderItemModifierCreateRequest::getApplicationOrder));
            
            // Apply each modifier
            for (OrderItemModifierCreateRequest modifier : modifiers) {
                // Calculate the price impact
                BigDecimal priceBefore = runningTotal;
                BigDecimal priceImpact;
                
                if ("PERCENTAGE".equals(modifier.getType())) {
                    priceImpact = priceBefore.multiply(modifier.getValue())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                } else {
                    // Default to FIXED amount
                    priceImpact = modifier.getValue();
                }
                
                // Update running total
                if (Boolean.TRUE.equals(modifier.getReplacesBasePrice())) {
                    runningTotal = modifier.getValue();
                } else {
                    runningTotal = runningTotal.add(priceImpact);
                }
                
                // Add this step to the calculation history
                CalculationStepDto step = CalculationStepDto.builder()
                        .name(modifier.getName())
                        .description(modifier.getDescription())
                        .type(modifier.getType())
                        .value(modifier.getValue())
                        .priceBefore(priceBefore)
                        .priceImpact(priceImpact)
                        .priceAfter(runningTotal)
                        .replacesBasePrice(modifier.getReplacesBasePrice())
                        .build();
                
                calculationDto.addCalculationStep(step);
            }
        }
        
        // Apply child size discount (30% off)
        if (Boolean.TRUE.equals(isChildSized)) {
            BigDecimal priceBefore = runningTotal;
            BigDecimal priceImpact = priceBefore.multiply(BigDecimal.valueOf(0.3))
                    .setScale(2, RoundingMode.HALF_UP).negate();
            runningTotal = priceBefore.add(priceImpact);
            
            CalculationStepDto step = CalculationStepDto.builder()
                    .name("Дитячі речі")
                    .description("30% знижка для дитячих речей (до 30 розміру)")
                    .type("PERCENTAGE")
                    .value(BigDecimal.valueOf(30).negate())
                    .priceBefore(priceBefore)
                    .priceImpact(priceImpact)
                    .priceAfter(runningTotal)
                    .replacesBasePrice(false)
                    .build();
            
            calculationDto.addCalculationStep(step);
        }
        
        // Apply manual cleaning surcharge (20% extra)
        if (Boolean.TRUE.equals(isManualCleaning)) {
            BigDecimal priceBefore = runningTotal;
            BigDecimal priceImpact = priceBefore.multiply(BigDecimal.valueOf(0.2))
                    .setScale(2, RoundingMode.HALF_UP);
            runningTotal = priceBefore.add(priceImpact);
            
            CalculationStepDto step = CalculationStepDto.builder()
                    .name("Ручна чистка")
                    .description("20% надбавка за ручну чистку")
                    .type("PERCENTAGE")
                    .value(BigDecimal.valueOf(20))
                    .priceBefore(priceBefore)
                    .priceImpact(priceImpact)
                    .priceAfter(runningTotal)
                    .replacesBasePrice(false)
                    .build();
            
            calculationDto.addCalculationStep(step);
        }
        
        // Apply heavily soiled surcharge (variable %)
        if (Boolean.TRUE.equals(isHeavilySoiled) && heavilySoiledPercentage != null) {
            BigDecimal priceBefore = runningTotal;
            BigDecimal priceImpact = priceBefore.multiply(BigDecimal.valueOf(heavilySoiledPercentage)
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP))
                    .setScale(2, RoundingMode.HALF_UP);
            runningTotal = priceBefore.add(priceImpact);
            
            CalculationStepDto step = CalculationStepDto.builder()
                    .name("Дуже забруднені речі")
                    .description(heavilySoiledPercentage + "% надбавка за сильне забруднення")
                    .type("PERCENTAGE")
                    .value(BigDecimal.valueOf(heavilySoiledPercentage))
                    .priceBefore(priceBefore)
                    .priceImpact(priceImpact)
                    .priceAfter(runningTotal)
                    .replacesBasePrice(false)
                    .build();
            
            calculationDto.addCalculationStep(step);
        }
        
        // Make sure the price isn't negative
        if (runningTotal.compareTo(BigDecimal.ZERO) < 0) {
            runningTotal = BigDecimal.ZERO;
        }
        
        // Set the final price
        calculationDto.setFinalPrice(runningTotal.setScale(2, RoundingMode.HALF_UP));
        
        return calculationDto;
    }

    @Override
    public BigDecimal applyOrderDiscount(Order order, DiscountType discountType, Integer customDiscountPercentage) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty()) {
            return BigDecimal.ZERO;
        }

        // Get the discount percentage
        int discountPercentage;
        if (discountType == DiscountType.CUSTOM && customDiscountPercentage != null) {
            discountPercentage = customDiscountPercentage;
        } else {
            discountPercentage = discountType.getPercentage();
        }

        // If there's no discount, just return the total
        if (discountPercentage == 0 || discountType == DiscountType.NONE) {
            return order.getTotalPrice();
        }

        BigDecimal totalEligibleForDiscount = BigDecimal.ZERO;
        BigDecimal totalNotEligibleForDiscount = BigDecimal.ZERO;

        // Calculate eligible and non-eligible totals
        for (OrderItem item : order.getItems()) {
            if (item.getServiceCategory() != null) {
                String categoryName = item.getServiceCategory().getName();
                if (isCategoryEligibleForDiscount(categoryName)) {
                    totalEligibleForDiscount = totalEligibleForDiscount.add(item.getFinalPrice());
                } else {
                    totalNotEligibleForDiscount = totalNotEligibleForDiscount.add(item.getFinalPrice());
                }
            }
        }

        // Apply discount to eligible total
        BigDecimal discountAmount = totalEligibleForDiscount
                .multiply(BigDecimal.valueOf(discountPercentage))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal discountedTotal = totalEligibleForDiscount.subtract(discountAmount);

        // Add back the non-eligible total
        BigDecimal finalTotal = discountedTotal.add(totalNotEligibleForDiscount);

        // Make sure the total isn't negative
        if (finalTotal.compareTo(BigDecimal.ZERO) < 0) {
            finalTotal = BigDecimal.ZERO;
        }

        return finalTotal.setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal applyUrgencySurcharge(Order order, UrgencyType urgencyType) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty() || urgencyType == null) {
            return BigDecimal.ZERO;
        }

        // If there's no urgency surcharge, just return the total
        if (urgencyType == UrgencyType.STANDARD || urgencyType.getPercentage() == 0) {
            return order.getTotalPrice();
        }

        // Get the urgency percentage
        int urgencyPercentage = urgencyType.getPercentage();

        // Apply urgency surcharge to the total
        BigDecimal surchargeAmount = order.getTotalPrice()
                .multiply(BigDecimal.valueOf(urgencyPercentage))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal finalTotal = order.getTotalPrice().add(surchargeAmount);

        return finalTotal.setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public void recalculateOrderTotals(Order order) {
        if (order == null || order.getItems() == null) {
            return;
        }

        // Recalculate each item's final price
        for (OrderItem item : order.getItems()) {
            BigDecimal finalPrice = calculateFinalPrice(item);
            item.setFinalPrice(finalPrice);
        }

        // Calculate the base total (sum of all item final prices)
        BigDecimal baseTotal = order.getItems().stream()
                .map(OrderItem::getFinalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setBasePrice(baseTotal);
        
        // Apply discount and set directly to the order
        applyOrderDiscount(order, order.getDiscountType(), order.getCustomDiscountPercentage());
        
        // Apply urgency surcharge
        BigDecimal finalTotal = applyUrgencySurcharge(order, order.getUrgencyType());
        order.setTotalPrice(finalTotal);
        
        // Recalculate amount due
        if (order.getAmountPaid() != null) {
            order.setAmountDue(finalTotal.subtract(order.getAmountPaid()));
        } else {
            order.setAmountDue(finalTotal);
        }
    }

    @Override
    public boolean isCategoryEligibleForDiscount(String categoryName) {
        if (categoryName == null) {
            return false;
        }
        return !CATEGORIES_NOT_ELIGIBLE_FOR_DISCOUNT.contains(categoryName.toUpperCase());
    }
}
