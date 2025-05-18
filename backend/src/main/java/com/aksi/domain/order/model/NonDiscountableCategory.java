package com.aksi.domain.order.model;

/**
 * Категорії послуг, на які не поширюються знижки
 */
public enum NonDiscountableCategory implements RestrictedCategory {
    /**
     * Прасування (не підлягає знижкам)
     */
    IRONING("IRONING"),
    
    /**
     * Прання (не підлягає знижкам)
     */
    WASHING("WASHING"),
    
    /**
     * Фарбування текстилю (не підлягає знижкам)
     */
    DYEING("DYEING");
    
    private final String code;
    
    NonDiscountableCategory(String code) {
        this.code = code;
    }
    
    public String getCode() {
        return code;
    }
    
    /**
     * Перевіряє, чи входить категорія у список тих, що не піддаються знижкам
     *
     * @param categoryCode код категорії послуги
     * @return true, якщо категорія не піддається знижкам
     */
    public static boolean isNonDiscountable(String categoryCode) {
        return RESTRICTED_CATEGORY_CODES.contains(categoryCode);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public boolean isRestricted(String categoryCode) {
        return isNonDiscountable(categoryCode);
    }
} 