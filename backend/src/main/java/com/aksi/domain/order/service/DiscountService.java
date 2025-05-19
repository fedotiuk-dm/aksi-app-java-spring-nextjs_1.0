package com.aksi.domain.order.service;

import java.math.BigDecimal;

import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;

/**
 * Сервіс для роботи зі знижками
 */
public interface DiscountService {

    /**
     * Застосувати знижку до замовлення
     *
     * @param request дані про знижку
     * @return інформація про застосовану знижку
     */
    OrderDiscountResponse applyDiscount(OrderDiscountRequest request);

    /**
     * Отримати інформацію про поточну знижку для замовлення
     *
     * @param orderId ідентифікатор замовлення
     * @return інформація про поточну знижку
     */
    OrderDiscountResponse getOrderDiscount(String orderId);

    /**
     * Скасувати знижку для замовлення
     *
     * @param orderId ідентифікатор замовлення
     * @return оновлена інформація про замовлення без знижки
     */
    OrderDiscountResponse removeDiscount(String orderId);

    /**
     * Перевіряє, чи можна застосувати знижку до категорії послуг
     *
     * @param categoryCode код категорії послуг
     * @return true, якщо знижка може бути застосована, false - інакше
     */
    boolean isDiscountApplicable(String categoryCode);

    /**
     * Застосовує знижку до ціни, якщо це можливо для категорії
     *
     * @param price ціна без знижки
     * @param discountPercent відсоток знижки
     * @param categoryCode код категорії
     * @return ціна зі знижкою або початкова ціна, якщо знижка не застосовується до категорії
     */
    BigDecimal applyDiscountIfApplicable(BigDecimal price, BigDecimal discountPercent, String categoryCode);
}
