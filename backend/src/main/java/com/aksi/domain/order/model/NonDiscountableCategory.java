package com.aksi.domain.order.model;

/**
 * Категорії послуг, на які не поширюються знижки
 */
public enum NonDiscountableCategory implements RestrictedCategory {
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
    
    /**
     * Перевіряє, чи входить категорія у список тих, що не піддаються знижкам
     *
     * @param categoryCode код категорії послуги
     * @return true, якщо категорія не піддається знижкам
     */
    public static boolean isNonDiscountable(String categoryCode) {
        return RESTRICTED_CATEGORY_CODES.contains(categoryCode);
    }
} 