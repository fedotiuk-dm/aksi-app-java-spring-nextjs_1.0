package com.aksi.domain.order.model;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Категорії послуг, на які не поширюються знижки
 */
public enum NonDiscountableCategory {
    /**
     * Прасування (не підлягає знижкам)
     */
    IRONING,
    
    /**
     * Прання (не підлягає знижкам)
     */
    WASHING,
    
    /**
     * Фарбування текстилю (не підлягає знижкам)
     */
    DYEING;
    
    private static final Set<String> NON_DISCOUNTABLE_CATEGORY_CODES = new HashSet<>(
            Arrays.asList("IRONING", "WASHING", "DYEING"));
    
    /**
     * Перевіряє, чи входить категорія у список тих, що не піддаються знижкам
     *
     * @param categoryCode код категорії послуги
     * @return true, якщо категорія не піддається знижкам
     */
    public static boolean isNonDiscountable(String categoryCode) {
        return NON_DISCOUNTABLE_CATEGORY_CODES.contains(categoryCode);
    }
} 