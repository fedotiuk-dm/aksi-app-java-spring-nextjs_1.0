package com.aksi.domain.pricing.enums;

/**
 * Enum для кодів категорій сервісів хімчистки.
 * Замінює хардкодовані рядки для забезпечення типобезпеки.
 */
public enum ServiceCategoryCode {

    /**
     * Чистка одягу та текстилю.
     */
    CLOTHING_CLEANING("CLOTHING_CLEANING", "Чистка одягу та текстилю"),

    /**
     * Прання білизни.
     */
    LAUNDRY("LAUNDRY", "Прання білизни"),

    /**
     * Прасування.
     */
    IRONING("IRONING", "Прасування"),

    /**
     * Чистка та відновлення шкіряних виробів.
     */
    LEATHER_CLEANING("LEATHER_CLEANING", "Чистка та відновлення шкіряних виробів"),

    /**
     * Дублянки.
     */
    SHEEPSKIN_PRODUCTS("SHEEPSKIN_PRODUCTS", "Дублянки"),

    /**
     * Вироби із натурального хутра.
     */
    FUR_PRODUCTS("FUR_PRODUCTS", "Вироби із натурального хутра"),

    /**
     * Фарбування текстильних виробів.
     */
    TEXTILE_DYEING("TEXTILE_DYEING", "Фарбування текстильних виробів"),

    /**
     * Додаткові послуги.
     */
    ADDITIONAL_SERVICES("ADDITIONAL_SERVICES", "Додаткові послуги"),

    /**
     * Застарілий код для зворотної сумісності.
     * @deprecated Використовуйте {@link #CLOTHING_CLEANING}
     */
    @Deprecated(since = "1.0", forRemoval = true)
    CLOTHING("CLOTHING", "Чистка одягу та текстилю"),

    /**
     * Застарілий код для зворотної сумісності.
     * @deprecated Використовуйте {@link #LEATHER_CLEANING}
     */
    @Deprecated(since = "1.0", forRemoval = true)
    LEATHER("LEATHER", "Чистка та відновлення шкіряних виробів"),

    /**
     * Застарілий код для зворотної сумісності.
     * @deprecated Використовуйте {@link #FUR_PRODUCTS}
     */
    @Deprecated(since = "1.0", forRemoval = true)
    FUR("FUR", "Вироби із натурального хутра"),

    /**
     * Застарілий код для зворотної сумісності.
     * @deprecated Використовуйте {@link #SHEEPSKIN_PRODUCTS}
     */
    @Deprecated(since = "1.0", forRemoval = true)
    PADDING("PADDING", "Дублянки"),

    /**
     * Застарілий код для зворотної сумісності.
     * @deprecated Використовуйте {@link #TEXTILE_DYEING}
     */
    @Deprecated(since = "1.0", forRemoval = true)
    DYEING("DYEING", "Фарбування текстильних виробів");

    private final String code;
    private final String displayName;

    ServiceCategoryCode(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    /**
     * Отримати код категорії.
     *
     * @return код категорії
     */
    public String getCode() {
        return code;
    }

    /**
     * Отримати відображувану назву категорії.
     *
     * @return відображувана назва
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Знайти категорію за кодом.
     *
     * @param code код категорії
     * @return знайдена категорія або null
     */
    public static ServiceCategoryCode fromCode(String code) {
        if (code == null) {
            return null;
        }

        for (ServiceCategoryCode category : values()) {
            if (category.getCode().equals(code)) {
                return category;
            }
        }

        return null;
    }

    /**
     * Перевірити, чи є код валідним.
     *
     * @param code код для перевірки
     * @return true, якщо код валідний
     */
    public static boolean isValidCode(String code) {
        return fromCode(code) != null;
    }

    /**
     * Отримати всі коди категорій.
     *
     * @return масив всіх кодів
     */
    public static String[] getAllCodes() {
        return java.util.Arrays.stream(values())
                .map(ServiceCategoryCode::getCode)
                .toArray(String[]::new);
    }

    /**
     * Отримати всі відображувані назви.
     *
     * @return масив всіх назв
     */
    public static String[] getAllDisplayNames() {
        return java.util.Arrays.stream(values())
                .map(ServiceCategoryCode::getDisplayName)
                .toArray(String[]::new);
    }

    @Override
    public String toString() {
        return code;
    }
}
