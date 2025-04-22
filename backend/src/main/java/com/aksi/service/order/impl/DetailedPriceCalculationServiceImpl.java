package com.aksi.service.order.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.entity.Order;
import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemModifier;
import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.dto.order.OrderItemPriceCalculationDto;
import com.aksi.dto.order.PriceModifierDetailDto;
import com.aksi.service.order.DetailedPriceCalculationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу детального розрахунку цін
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DetailedPriceCalculationServiceImpl implements DetailedPriceCalculationService {

    private final OrderItemRepository orderItemRepository;
    // PriceCalculationService не використовується, оскільки ми виконуємо детальні розрахунки в цьому класі
    
    private static final BigDecimal CHILD_SIZE_MULTIPLIER = BigDecimal.valueOf(0.7);
    private static final BigDecimal MANUAL_CLEANING_MULTIPLIER = BigDecimal.valueOf(1.2);
    
    @Override
    @Transactional(readOnly = true)
    public OrderItemPriceCalculationDto getDetailedPriceCalculation(UUID itemId) {
        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Order item not found with id: " + itemId));
        return calculateDetailedPrice(orderItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderItemPriceCalculationDto> getDetailedPriceCalculationsForOrder(UUID orderId) {
        // Отримати замовлення
        Order order = new Order();
        order.setId(orderId);
        
        // Знайти всі предмети для цього замовлення
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
        return orderItems.stream()
                .map(this::calculateDetailedPrice)
                .collect(Collectors.toList());
    }

    @Override
    public OrderItemPriceCalculationDto calculateDetailedPrice(OrderItem orderItem) {
        // Отримати базову ціну
        BigDecimal basePrice = orderItem.getBasePrice() != null ? 
                orderItem.getBasePrice() : 
                BigDecimal.ZERO;
                
        // Отримати кількість
        BigDecimal quantity = BigDecimal.valueOf(orderItem.getQuantity().doubleValue());
        
        // Базова ціна з кількістю
        BigDecimal basePriceWithQuantity = basePrice.multiply(quantity)
                .setScale(2, RoundingMode.HALF_UP);
        
        // Підготувати список деталей модифікаторів
        List<PriceModifierDetailDto> modifierDetails = new ArrayList<>();
        
        // Поточна ціна на кожному етапі
        BigDecimal currentPrice = basePriceWithQuantity;
        
        // Обробка модифікаторів
        if (orderItem.getModifiers() != null && !orderItem.getModifiers().isEmpty()) {
            List<OrderItemModifier> sortedModifiers = orderItem.getModifiers().stream()
                    .sorted(Comparator.comparing(OrderItemModifier::getApplicationOrder))
                    .collect(Collectors.toList());
                    
            for (OrderItemModifier modifier : sortedModifiers) {
                BigDecimal priceBefore = currentPrice;
                BigDecimal impact;
                BigDecimal priceAfter;
                
                if (Boolean.TRUE.equals(modifier.getReplacesBasePrice())) {
                    impact = modifier.getValue().subtract(priceBefore);
                    priceAfter = modifier.getValue();
                } else if ("PERCENTAGE".equals(modifier.getType())) {
                    BigDecimal percentage = modifier.getValue().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
                    impact = priceBefore.multiply(percentage).setScale(2, RoundingMode.HALF_UP);
                    priceAfter = priceBefore.add(impact);
                } else { // FIXED
                    impact = modifier.getValue();
                    priceAfter = priceBefore.add(impact);
                }
                
                currentPrice = priceAfter;
                
                PriceModifierDetailDto detail = PriceModifierDetailDto.builder()
                        .name(modifier.getName())
                        .description(modifier.getDescription())
                        .type(modifier.getType())
                        .value(modifier.getValue())
                        .impact(impact)
                        .priceBefore(priceBefore)
                        .priceAfter(priceAfter)
                        .replacesBasePrice(modifier.getReplacesBasePrice())
                        .applicationOrder(modifier.getApplicationOrder())
                        .build();
                        
                modifierDetails.add(detail);
            }
        }
        
        // Обробка дитячого розміру
        boolean childSizeDiscountApplied = false;
        if (Boolean.TRUE.equals(orderItem.getChildSized())) {
            BigDecimal priceBefore = currentPrice;
            BigDecimal impact = priceBefore.multiply(BigDecimal.ONE.subtract(CHILD_SIZE_MULTIPLIER))
                    .negate()
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal priceAfter = priceBefore.multiply(CHILD_SIZE_MULTIPLIER)
                    .setScale(2, RoundingMode.HALF_UP);
                    
            currentPrice = priceAfter;
            childSizeDiscountApplied = true;
            
            PriceModifierDetailDto detail = PriceModifierDetailDto.builder()
                    .name("Дитячий розмір")
                    .description("Знижка 30% для дитячих речей")
                    .type("PERCENTAGE")
                    .value(BigDecimal.valueOf(-30))
                    .impact(impact)
                    .priceBefore(priceBefore)
                    .priceAfter(priceAfter)
                    .replacesBasePrice(false)
                    .applicationOrder(1000) // Високий пріоритет для системних модифікаторів
                    .build();
                    
            modifierDetails.add(detail);
        }
        
        // Обробка ручної чистки
        boolean manualCleaningApplied = false;
        if (Boolean.TRUE.equals(orderItem.getManualCleaning())) {
            BigDecimal priceBefore = currentPrice;
            BigDecimal impact = priceBefore.multiply(MANUAL_CLEANING_MULTIPLIER.subtract(BigDecimal.ONE))
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal priceAfter = priceBefore.multiply(MANUAL_CLEANING_MULTIPLIER)
                    .setScale(2, RoundingMode.HALF_UP);
                    
            currentPrice = priceAfter;
            manualCleaningApplied = true;
            
            PriceModifierDetailDto detail = PriceModifierDetailDto.builder()
                    .name("Ручна чистка")
                    .description("Надбавка 20% за ручну чистку")
                    .type("PERCENTAGE")
                    .value(BigDecimal.valueOf(20))
                    .impact(impact)
                    .priceBefore(priceBefore)
                    .priceAfter(priceAfter)
                    .replacesBasePrice(false)
                    .applicationOrder(1001) // Високий пріоритет для системних модифікаторів
                    .build();
                    
            modifierDetails.add(detail);
        }
        
        // Обробка сильного забруднення
        boolean heavilySoiledApplied = false;
        Integer heavilySoiledPercentage = null;
        
        if (orderItem.getHeavilySoiledPercentage() != null && orderItem.getHeavilySoiledPercentage() > 0) {
            BigDecimal priceBefore = currentPrice;
            BigDecimal percentage = BigDecimal.valueOf(orderItem.getHeavilySoiledPercentage())
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            BigDecimal impact = priceBefore.multiply(percentage)
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal priceAfter = priceBefore.add(impact);
            
            currentPrice = priceAfter;
            heavilySoiledApplied = true;
            heavilySoiledPercentage = orderItem.getHeavilySoiledPercentage();
            
            PriceModifierDetailDto detail = PriceModifierDetailDto.builder()
                    .name("Сильне забруднення")
                    .description("Надбавка " + orderItem.getHeavilySoiledPercentage() + "% за сильне забруднення")
                    .type("PERCENTAGE")
                    .value(BigDecimal.valueOf(orderItem.getHeavilySoiledPercentage()))
                    .impact(impact)
                    .priceBefore(priceBefore)
                    .priceAfter(priceAfter)
                    .replacesBasePrice(false)
                    .applicationOrder(1002) // Високий пріоритет для системних модифікаторів
                    .build();
                    
            modifierDetails.add(detail);
        }
        
        // Результат розрахунку
        return OrderItemPriceCalculationDto.builder()
                .basePrice(basePrice)
                .basePriceWithQuantity(basePriceWithQuantity)
                .quantity(quantity)
                .finalPrice(currentPrice)
                .appliedModifiers(modifierDetails)
                .childSizeDiscountApplied(childSizeDiscountApplied)
                .manualCleaningApplied(manualCleaningApplied)
                .heavilySoiledApplied(heavilySoiledApplied)
                .heavilySoiledPercentage(heavilySoiledPercentage)
                .build();
    }

    @Override
    public List<OrderItemPriceCalculationDto> calculateDetailedPricesForOrder(Order order) {
        return order.getItems().stream()
                .map(this::calculateDetailedPrice)
                .collect(Collectors.toList());
    }
}
