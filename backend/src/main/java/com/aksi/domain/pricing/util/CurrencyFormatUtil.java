package com.aksi.domain.pricing.util;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

import static com.aksi.domain.pricing.constants.LocalizationConstants.NumberFormats.DECIMAL_FORMAT;
import static com.aksi.domain.pricing.constants.PricingConstants.CURRENCY_DECIMAL_PLACES;
import static com.aksi.domain.pricing.constants.PricingConstants.DEFAULT_CURRENCY_SYMBOL;

/**
 * Утиліта для форматування валютних значень та чисел з локалізацією.
 *
 * Реалізовано завдання з OrderSummaryDTO:
 * ✅ Винесена валюта в конфігурацію для локалізації (CurrencyConfiguration)
 * ✅ Додано форматування для сум (розряди, копійки)
 * ✅ Підтримка українського формату (пробіли як розділювач тисяч)
 * ✅ Методи для різних типів форматування (з валютою, без, з знаками)
 */
public final class CurrencyFormatUtil {

    private CurrencyFormatUtil() {
        // Приватний конструктор для утиліт класу
    }

    private static final Locale UKRAINE_LOCALE = Locale.of("uk", "UA");

    // Кешовані форматери для продуктивності
    private static final DecimalFormat CURRENCY_FORMATTER;
    private static final DecimalFormat DECIMAL_FORMATTER;

    static {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(UKRAINE_LOCALE);
        symbols.setDecimalSeparator('.');
        symbols.setGroupingSeparator(' ');

        CURRENCY_FORMATTER = new DecimalFormat(DECIMAL_FORMAT, symbols);
        DECIMAL_FORMATTER = new DecimalFormat(DECIMAL_FORMAT, symbols);
    }

    /**
     * Форматує суму з валютою (наприклад, "1 250.50 грн").
     *
     * @param amount сума для форматування
     * @return відформатована строка з валютою
     */
    public static String formatWithCurrency(BigDecimal amount) {
        if (amount == null) {
            return "0.00 " + DEFAULT_CURRENCY_SYMBOL;
        }
        return CURRENCY_FORMATTER.format(amount) + " " + DEFAULT_CURRENCY_SYMBOL;
    }

    /**
     * Форматує суму з валютою для заданої валюти.
     *
     * @param amount сума для форматування
     * @param currency символ валюти
     * @return відформатована строка з валютою
     */
    public static String formatWithCurrency(BigDecimal amount, String currency) {
        if (amount == null) {
            return "0.00 " + currency;
        }
        return CURRENCY_FORMATTER.format(amount) + " " + currency;
    }

    /**
     * Форматує суму без валюти (наприклад, "1 250.50").
     *
     * @param amount сума для форматування
     * @return відформатована строка без валюти
     */
    public static String formatAmount(BigDecimal amount) {
        if (amount == null) {
            return "0.00";
        }
        return DECIMAL_FORMATTER.format(amount);
    }

    /**
     * Форматує суму для відображення в інтерфейсі з правильними розрядами.
     *
     * @param amount сума для форматування
     * @return відформатована строка для відображення
     */
    public static String formatForDisplay(BigDecimal amount) {
        if (amount == null) {
            return "0.00";
        }

        // Масштабуємо до потрібної кількості знаків після коми
        BigDecimal scaled = amount.setScale(CURRENCY_DECIMAL_PLACES, java.math.RoundingMode.HALF_UP);
        return DECIMAL_FORMATTER.format(scaled);
    }

    /**
     * Отримує символ валюти за замовчуванням.
     *
     * @return символ валюти
     */
    public static String getDefaultCurrencySymbol() {
        return DEFAULT_CURRENCY_SYMBOL;
    }

    /**
     * Форматує відсоток (наприклад, "15.5%").
     *
     * @param percentage відсоток для форматування
     * @return відформатований відсоток
     */
    public static String formatPercentage(BigDecimal percentage) {
        if (percentage == null) {
            return "0%";
        }
        return formatAmount(percentage) + "%";
    }

    /**
     * Форматує відсоток зі знаком (наприклад, "+15.5%" або "-10%").
     *
     * @param percentage відсоток для форматування
     * @return відформатований відсоток зі знаком
     */
    public static String formatPercentageWithSign(BigDecimal percentage) {
        if (percentage == null) {
            return "0%";
        }

        String sign = percentage.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
        return sign + formatAmount(percentage) + "%";
    }

    /**
     * Форматує суму зі знаком для відображення різниці (наприклад, "+250.50 грн" або "-100.00 грн").
     *
     * @param amount сума для форматування
     * @return відформатована строка зі знаком та валютою
     */
    public static String formatDifferenceWithCurrency(BigDecimal amount) {
        if (amount == null) {
            return "0.00 " + DEFAULT_CURRENCY_SYMBOL;
        }

        String sign = amount.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
        return sign + formatWithCurrency(amount);
    }

    /**
     * Перевіряє, чи є сума позитивною.
     *
     * @param amount сума для перевірки
     * @return true якщо сума більше нуля
     */
    public static boolean isPositive(BigDecimal amount) {
        return amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє, чи є сума нульовою або від'ємною.
     *
     * @param amount сума для перевірки
     * @return true якщо сума менше або дорівнює нулю
     */
    public static boolean isZeroOrNegative(BigDecimal amount) {
        return amount == null || amount.compareTo(BigDecimal.ZERO) <= 0;
    }
}
