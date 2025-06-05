package com.aksi.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import static com.aksi.domain.pricing.constants.PricingConstants.CURRENCY_DECIMAL_PLACES;
import static com.aksi.domain.pricing.constants.PricingConstants.DEFAULT_CURRENCY_CODE;
import static com.aksi.domain.pricing.constants.PricingConstants.DEFAULT_CURRENCY_SYMBOL;

import lombok.Data;

/**
 * Конфігурація валюти для локалізації.
 *
 * Реалізовано для OrderSummaryDTO замість хардкодженої валюти:
 * ✅ Налаштування через application.yml (app.currency.*)
 * ✅ Підтримка різних валют та локалей
 * ✅ Гнучкі налаштування форматування (розряди, символи)
 * ✅ Готовність до міжнародного використання
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "app.currency")
public class CurrencyConfiguration {

    /**
     * Код валюти (наприклад, "UAH", "USD").
     */
    private String code = DEFAULT_CURRENCY_CODE;

    /**
     * Символ валюти (наприклад, "грн", "$").
     */
    private String symbol = DEFAULT_CURRENCY_SYMBOL;

    /**
     * Кількість знаків після коми для валюти.
     */
    private int decimalPlaces = CURRENCY_DECIMAL_PLACES;

    /**
     * Локаль для форматування (наприклад, "uk_UA", "en_US").
     */
    private String locale = "uk_UA";

    /**
     * Чи використовувати розділення тисяч (пробіли для ua).
     */
    private boolean useGroupingSeparator = true;

    /**
     * Символ для розділення тисяч.
     */
    private String groupingSeparator = " ";

    /**
     * Символ десяткового розділювача.
     */
    private String decimalSeparator = ".";
}
