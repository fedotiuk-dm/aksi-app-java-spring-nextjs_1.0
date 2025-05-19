package com.aksi.domain.pricing.constants;

/**
 * Константи для форматування відображення модифікаторів цін.
 */
public final class ModifierFormatConstants {

    private ModifierFormatConstants() {
        // Приватний конструктор для запобігання інстанціюванню
    }

    // Формати для відображення
    public static final String PERCENTAGE_FORMAT = "%s%s%%";
    public static final String PERCENTAGE_PLUS_PREFIX = "+";

    public static final String RANGE_PERCENTAGE_FORMAT = "від +%s%% до +%s%%";

    public static final String FIXED_PRICE_FORMAT = "фіксована ціна %s %s";

    public static final String ADDITION_FORMAT = "додатково %s %s";

    // Валюта за замовчуванням
    public static final String DEFAULT_CURRENCY = "грн";
}
