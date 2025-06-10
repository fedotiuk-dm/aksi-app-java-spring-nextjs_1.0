package com.aksi.domain.order.statemachine.stage3.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;
import com.aksi.domain.order.service.DiscountService;

/**
 * Операційний сервіс для роботи зі знижками Stage3.
 * Тонка обгортка навколо доменного сервісу DiscountService.
 *
 * ЕТАП 3.2: Operations Services (тонкі обгортки)
 * Дозволені імпорти: ТІЛЬКИ доменні сервіси, DTO, Spring аннотації, Java стандартні
 * Заборонено: Stage3 Services, Validators, Actions, Guards, Config
 */
@Service
public class Stage3DiscountOperationsService {

    private final DiscountService discountService;

    public Stage3DiscountOperationsService(DiscountService discountService) {
        this.discountService = discountService;
    }

        /**
     * Застосовує знижку для замовлення
     */
    public OrderDiscountResponse applyDiscount(OrderDiscountRequest request) {
        return discountService.applyDiscount(request);
    }

    /**
     * Отримує інформацію про знижку для замовлення
     */
    public OrderDiscountResponse getOrderDiscount(UUID orderId) {
        return discountService.getOrderDiscount(orderId.toString());
    }

    /**
     * Скасовує знижку для замовлення
     */
    public OrderDiscountResponse removeDiscount(UUID orderId) {
        return discountService.removeDiscount(orderId.toString());
    }

    /**
     * Перевіряє застосовність знижки до категорії
     */
    public boolean isDiscountApplicableToCategory(String categoryCode) {
        return discountService.isDiscountApplicable(categoryCode);
    }

        /**
     * Перевіряє чи категорія підтримує знижки
     */
    public boolean canApplyDiscountToCategory(String categoryCode) {
        return discountService.isDiscountApplicable(categoryCode);
    }

    /**
     * Застосовує знижку із заданим відсотком до ціни
     */
    public java.math.BigDecimal applyDiscountToPrice(
            java.math.BigDecimal price,
            java.math.BigDecimal discountPercent,
            String categoryCode) {
        return discountService.applyDiscountIfApplicable(price, discountPercent, categoryCode);
    }
}
