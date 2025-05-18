package com.aksi.domain.order.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.model.DiscountType;
import com.aksi.domain.order.model.NonDiscountableCategory;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для роботи зі знижками
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DiscountServiceImpl implements DiscountService {

    private final OrderRepository orderRepository;
    
    @Override
    @Transactional
    public OrderDiscountResponse applyDiscount(OrderDiscountRequest request) {
        log.info("Applying discount to order: {}", request);
        
        OrderEntity order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId("Замовлення", request.getOrderId().toString()));
        
        // Встановлюємо тип знижки
        order.setDiscountType(request.getDiscountType());
        
        // Для користувацького типу знижки встановлюємо відсоток і опис
        if (request.getDiscountType() == DiscountType.CUSTOM) {
            if (request.getDiscountPercentage() == null) {
                throw new IllegalArgumentException("Для користувацького типу знижки потрібно вказати відсоток");
            }
            order.setDiscountPercentage(request.getDiscountPercentage());
            order.setDiscountDescription(request.getDiscountDescription());
        } else {
            // Для стандартних типів знижок використовуємо фіксований відсоток
            order.setDiscountPercentage(request.getDiscountType().getDefaultPercentage());
            order.setDiscountDescription(null);
        }
        
        // Якщо немає знижки, видаляємо всі дані про знижку
        if (request.getDiscountType() == DiscountType.NO_DISCOUNT) {
            order.setDiscountPercentage(0);
            order.setDiscountAmount(null);
            order.setDiscountDescription(null);
        } else {
            // Розраховуємо суму знижки
            calculateDiscount(order);
        }
        
        // Перераховуємо загальну суму з урахуванням знижки
        order.recalculateTotalAmount();
        
        // Зберігаємо зміни
        orderRepository.save(order);
        
        // Повертаємо детальну інформацію про знижку
        return createDiscountResponse(order);
    }
    
    @Override
    @Transactional(readOnly = true)
    public OrderDiscountResponse getOrderDiscount(String orderId) {
        log.info("Getting discount for order: {}", orderId);
        
        OrderEntity order = orderRepository.findById(UUID.fromString(orderId))
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId("Замовлення", orderId));
        
        return createDiscountResponse(order);
    }
    
    @Override
    @Transactional
    public OrderDiscountResponse removeDiscount(String orderId) {
        log.info("Removing discount from order: {}", orderId);
        
        OrderEntity order = orderRepository.findById(UUID.fromString(orderId))
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId("Замовлення", orderId));
        
        // Скидаємо всі дані про знижку
        order.setDiscountType(DiscountType.NO_DISCOUNT);
        order.setDiscountPercentage(0);
        order.setDiscountAmount(null);
        order.setDiscountDescription(null);
        
        // Перераховуємо загальну суму без знижки
        order.recalculateTotalAmount();
        
        // Зберігаємо зміни
        orderRepository.save(order);
        
        return createDiscountResponse(order);
    }
    
    /**
     * Розрахувати суму знижки для замовлення з урахуванням обмежень на категорії
     * 
     * @param order замовлення
     */
    private void calculateDiscount(OrderEntity order) {
        int discountPercentage = order.getDiscountPercentage();
        
        if (discountPercentage <= 0) {
            order.setDiscountAmount(BigDecimal.ZERO);
            return;
        }
        
        // Знаходимо всі елементи замовлення, до яких можна застосувати знижку
        List<OrderItemEntity> discountableItems = order.getItems().stream()
                .filter(item -> !NonDiscountableCategory.isNonDiscountable(item.getCategory()))
                .collect(Collectors.toList());
        
        // Розраховуємо суму, до якої можна застосувати знижку
        BigDecimal discountableAmount = discountableItems.stream()
                .map(OrderItemEntity::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Розраховуємо суму знижки
        BigDecimal discountAmount = discountableAmount
                .multiply(BigDecimal.valueOf(discountPercentage))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        
        // Встановлюємо суму знижки для замовлення
        order.setDiscountAmount(discountAmount);
    }
    
    /**
     * Створити відповідь з інформацією про знижку
     * 
     * @param order замовлення
     * @return детальна інформація про знижку
     */
    private OrderDiscountResponse createDiscountResponse(OrderEntity order) {
        // Знаходимо елементи, до яких не застосовується знижка
        List<String> nonDiscountableCategories = new ArrayList<>();
        BigDecimal nonDiscountableAmount = BigDecimal.ZERO;
        
        for (OrderItemEntity item : order.getItems()) {
            String categoryCode = item.getCategory();
            if (NonDiscountableCategory.isNonDiscountable(categoryCode)) {
                nonDiscountableCategories.add(categoryCode);
                nonDiscountableAmount = nonDiscountableAmount.add(item.getTotalPrice());
            }
        }
        
        return OrderDiscountResponse.builder()
                .orderId(order.getId())
                .discountType(order.getDiscountType())
                .discountPercentage(order.getDiscountPercentage())
                .discountDescription(order.getDiscountDescription())
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .nonDiscountableCategories(nonDiscountableCategories)
                .nonDiscountableAmount(nonDiscountableAmount)
                .build();
    }
} 