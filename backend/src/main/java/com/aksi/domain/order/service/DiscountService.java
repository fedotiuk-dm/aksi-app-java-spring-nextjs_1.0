package com.aksi.domain.order.service;

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
} 