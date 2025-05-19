package com.aksi.domain.order.model;

/**
 * Категорії послуг, на які не поширюється терміновість виконання
 */
public enum NonExpeditableCategory implements RestrictedCategory {
    /**
     * Прасування (не підлягає терміновості)
     */
    IRONING("IRONING"),
    
    /**
     * Прання (не підлягає терміновості)
     */
    WASHING("WASHING"),
    
    /**
     * Фарбування текстилю (не підлягає терміновості)
     */
    DYEING("DYEING");
    
    private final String code;
    
    NonExpeditableCategory(String code) {
        this.code = code;
    }
    
    public String getCode() {
        return code;
    }
    
    /**
     * Перевіряє, чи входить категорія у список тих, що не піддаються терміновості
     *
     * @param categoryCode код категорії послуги
     * @return true, якщо категорія не піддається терміновості
     */
    public static boolean isNonExpeditable(String categoryCode) {
        return RESTRICTED_CATEGORY_CODES.contains(categoryCode);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public boolean isRestricted(String categoryCode) {
        return isNonExpeditable(categoryCode);
    }
} 
