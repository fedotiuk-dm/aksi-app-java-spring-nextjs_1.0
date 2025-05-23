package com.aksi.domain.pricing.constants;

import static com.aksi.domain.pricing.constants.PricingConstants.DEFAULT_CURRENCY_SYMBOL;

/**
 * Константи для форматування відображення модифікаторів цін.
 */
public final class ModifierFormatConstants {

    private ModifierFormatConstants() {
        // Приватний конструктор для запобігання інстанціюванню
    }

    // Формати для відображення відсотків
    public static final String PERCENTAGE_FORMAT = "%s%s%%";
    public static final String PERCENTAGE_PLUS_PREFIX = "+";
    public static final String PERCENTAGE_MINUS_PREFIX = "-";

    public static final String RANGE_PERCENTAGE_FORMAT = "від +%s%% до +%s%%";
    public static final String DISCOUNT_PERCENTAGE_FORMAT = "-%s%%";
    public static final String EXPEDITE_PERCENTAGE_FORMAT = "+%s%% (термінова)";

    // Формати для відображення цін
    public static final String FIXED_PRICE_FORMAT = "фіксована ціна %s %s";
    public static final String ADDITION_FORMAT = "додатково %s %s";
    public static final String PRICE_FORMAT = "%s %s";
    public static final String PRICE_WITH_CURRENCY_FORMAT = "%.2f %s";

    // Валюта за замовчуванням (використовує централізовану константу)
    public static final String DEFAULT_CURRENCY = DEFAULT_CURRENCY_SYMBOL;

    // Формати для часу та термінів
    public static final String EXPEDITE_24H_LABEL = "Термінова обробка (24 години)";
    public static final String EXPEDITE_48H_LABEL = "Термінова обробка (48 годин)";
    public static final String STANDARD_PROCESSING_LABEL = "Стандартна обробка";

    // Формати для статусів
    public static final String STATUS_ACTIVE = "Активний";
    public static final String STATUS_INACTIVE = "Неактивний";
    public static final String STATUS_SEASONAL = "Сезонний";

    // Формати для UI повідомлень
    public static final String MODIFIER_APPLIED_FORMAT = "Застосовано: %s";
    public static final String MODIFIER_REMOVED_FORMAT = "Видалено: %s";
    public static final String TOTAL_DISCOUNT_FORMAT = "Загальна знижка: %s%%";
    public static final String TOTAL_SURCHARGE_FORMAT = "Загальна доплата: %s%%";

    // Константи для іконок та стилізації (для фронтенду)
    public static final class Icons {
        public static final String DISCOUNT = "discount";
        public static final String EXPEDITE = "speed";
        public static final String SURCHARGE = "add_circle";
        public static final String PERCENTAGE = "percent";
        public static final String CURRENCY = "attach_money";
        public static final String WARNING = "warning";
        public static final String INFO = "info";
    }

    // Кольори для різних типів модифікаторів (для UI)
    public static final class Colors {
        public static final String DISCOUNT_COLOR = "#4caf50"; // зелений для знижок
        public static final String SURCHARGE_COLOR = "#f44336"; // червоний для доплат
        public static final String EXPEDITE_COLOR = "#ff9800"; // помаранчевий для термінової обробки
        public static final String NEUTRAL_COLOR = "#757575"; // сірий для нейтральних
    }
}
