package com.aksi.domain.order.model;

/**
 * Категорії послуг, на які не поширюється терміновість виконання
 */
public enum NonExpeditableCategory implements RestrictedCategory {
    /**
     * Прасування (не підлягає терміновості)
     */
    IRONING,
    
    /**
     * Прання (не підлягає терміновості)
     */
    WASHING,
    
    /**
     * Фарбування текстилю (не підлягає терміновості)
     */
    DYEING;
    
    /**
     * Перевіряє, чи входить категорія у список тих, що не піддаються терміновості
     *
     * @param categoryCode код категорії послуги
     * @return true, якщо категорія не піддається терміновості
     */
    public static boolean isNonExpeditable(String categoryCode) {
        return RESTRICTED_CATEGORY_CODES.contains(categoryCode);
    }
} 