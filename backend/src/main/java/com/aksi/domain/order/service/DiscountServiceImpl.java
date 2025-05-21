package com.aksi.domain.order.service;

import java.math.BigDecimal;
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
import com.aksi.domain.pricing.constants.PriceCalculationConstants;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для роботи зі знижками.
 * Сервіс надає наступні можливості:
 * - Застосування знижок до замовлень з урахуванням обмежень для категорій послуг
 * - Перевірка можливості застосування знижки до категорії
 * - Розрахунок суми знижки та підсумкової вартості
 * - Обробка різних типів знижок (стандартних та користувацьких)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DiscountServiceImpl implements DiscountService {

    private final OrderRepository orderRepository;

    /**
     * Застосовує знижку до замовлення на основі запиту.
     * Встановлює тип знижки, відсоток та опис, а також розраховує суму знижки.
     *
     * @param request дані про знижку, що містить orderId, type, percentage та description
     * @return інформація про застосовану знижку, включаючи категорії, до яких знижка не застосовується
     */
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

    /**
     * Отримує інформацію про поточну знижку для замовлення.
     *
     * @param orderId ідентифікатор замовлення
     * @return деталі поточної знижки та категорії, до яких знижка не застосовується
     */
    @Override
    @Transactional(readOnly = true)
    public OrderDiscountResponse getOrderDiscount(String orderId) {
        log.info("Getting discount for order: {}", orderId);

        OrderEntity order = orderRepository.findById(UUID.fromString(orderId))
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId("Замовлення", orderId));

        return createDiscountResponse(order);
    }

    /**
     * Видаляє знижку із замовлення та перераховує загальну суму.
     *
     * @param orderId ідентифікатор замовлення
     * @return оновлені дані замовлення без знижки
     */
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
     * Розраховує суму знижки для замовлення з урахуванням обмежень на категорії.
     * Знаходить елементи замовлення, до яких можна застосувати знижку,
     * та обчислює загальну суму знижки.
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

        // Розраховуємо суму знижки з використанням констант
        BigDecimal discountAmount = discountableAmount
                .multiply(BigDecimal.valueOf(discountPercentage))
                .divide(PriceCalculationConstants.HUNDRED, PriceCalculationConstants.SCALE, PriceCalculationConstants.ROUNDING_MODE);

        // Встановлюємо суму знижки для замовлення
        order.setDiscountAmount(discountAmount);
    }

    /**
     * Створює відповідь з детальною інформацією про знижку для замовлення.
     * Включає дані про категорії, до яких знижка не застосовується.
     *
     * @param order замовлення
     * @return детальна інформація про знижку та її застосування
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

    /**
     * Перевіряє, чи можна застосувати знижку до категорії послуг.
     * Певні категорії (прання, прасування, фарбування) не підлягають знижкам.
     *
     * @param categoryCode код категорії послуг
     * @return true, якщо знижка може бути застосована, false - інакше
     */
    @Override
    public boolean isDiscountApplicable(String categoryCode) {
        return !NonDiscountableCategory.isNonDiscountable(categoryCode);
    }

    /**
     * Застосовує знижку до ціни, якщо це можливо для категорії.
     * Автоматично перевіряє, чи може категорія мати знижку.
     *
     * @param price ціна без знижки
     * @param discountPercent відсоток знижки
     * @param categoryCode код категорії
     * @return ціна зі знижкою або початкова ціна, якщо знижка не застосовується до категорії
     */
    @Override
    public BigDecimal applyDiscountIfApplicable(BigDecimal price, BigDecimal discountPercent, String categoryCode) {
        if (price == null || discountPercent == null || categoryCode == null) {
            return price;
        }

        // Перевіряємо чи може бути застосована знижка для цієї категорії
        if (NonDiscountableCategory.isNonDiscountable(categoryCode)) {
            return price; // Для категорій, що не підлягають знижкам, повертаємо оригінальну ціну
        }

        // Обчислюємо знижку з використанням констант з PriceCalculationConstants
        BigDecimal discountFactor = discountPercent.divide(
                PriceCalculationConstants.HUNDRED, 
                PriceCalculationConstants.SCALE, 
                PriceCalculationConstants.ROUNDING_MODE);
                
        BigDecimal discountMultiplier = BigDecimal.ONE.subtract(discountFactor);

        // Застосовуємо знижку та округлюємо результат
        return price.multiply(discountMultiplier)
                .setScale(PriceCalculationConstants.SCALE, PriceCalculationConstants.ROUNDING_MODE);
    }
}
