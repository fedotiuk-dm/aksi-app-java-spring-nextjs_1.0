package com.aksi.domain.pricing.constants;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Константи для обчислення цін
 */
public final class PriceCalculationConstants {
    private PriceCalculationConstants() {
        // Приватний конструктор для запобігання створенню екземплярів
    }
    
    // Загальні константи для обчислень
    public static final BigDecimal MIN_PRICE = BigDecimal.ONE;
    public static final int SCALE = 2;
    public static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;
    public static final BigDecimal HUNDRED = new BigDecimal("100");
    
    // Константи для кольорів
    public static final String COLOR_BLACK = "чорний";
    public static final String COLOR_WHITE = "білий";
    
    // Константи для модифікаторів цін
    public static final String MODIFIER_EXPEDITE_24H = "expedite_24h";
    public static final String MODIFIER_EXPEDITE_48H = "expedite_48h";
    public static final BigDecimal EXPEDITE_24H_PERCENTAGE = new BigDecimal("100");
    public static final BigDecimal EXPEDITE_48H_PERCENTAGE = new BigDecimal("50");
    
    // Константи для дитячих речей
    public static final BigDecimal KIDS_ITEMS_PERCENTAGE = new BigDecimal("-30");
    
    // Константи для ручної чистки
    public static final BigDecimal MANUAL_CLEANING_PERCENTAGE = new BigDecimal("20");
    
    // Методи-утиліти для обчислень
    public static BigDecimal calculatePercentage(BigDecimal base, BigDecimal percentage) {
        return base.multiply(percentage).divide(HUNDRED, SCALE, ROUNDING_MODE);
    }
    
    public static BigDecimal applyPercentage(BigDecimal base, BigDecimal percentage) {
        return base.add(calculatePercentage(base, percentage));
    }
    
    /**
     * Застосовує знижку до базової ціни.
     * 
     * @deprecated Замініть використання цього методу на {@link com.aksi.domain.order.service.DiscountService#applyDiscountIfApplicable}
     * для правильної перевірки можливості застосування знижки до конкретної категорії
     * 
     * @param base базова ціна
     * @param percentage відсоток знижки
     * @return ціна зі знижкою
     */
    @Deprecated
    public static BigDecimal applyDiscount(BigDecimal base, BigDecimal percentage) {
        return base.subtract(calculatePercentage(base, percentage));
    }
} 