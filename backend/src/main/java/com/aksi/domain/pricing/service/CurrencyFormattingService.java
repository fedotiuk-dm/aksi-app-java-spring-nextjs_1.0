package com.aksi.domain.pricing.service;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.aksi.config.CurrencyConfiguration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для форматування валютних значень з використанням конфігурації.
 *
 * Розширена версія CurrencyFormatUtil з можливістю динамічного налаштування:
 * ✅ Використовує CurrencyConfiguration для гнучкості налаштувань
 * ✅ Підтримує різні локалі та символи валют
 * ✅ Автоматичне створення форматтерів на основі конфігурації
 * ✅ Fallback до безпечних налаштувань при помилках
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CurrencyFormattingService {

    private final CurrencyConfiguration currencyConfig;

    private DecimalFormat currencyFormatter;
    private DecimalFormat decimalFormatter;

    /**
     * Отримує або створює форматтер валюти на основі конфігурації.
     */
    private DecimalFormat getCurrencyFormatter() {
        if (currencyFormatter == null) {
            createFormatters();
        }
        return currencyFormatter;
    }

    /**
     * Отримує або створює десятковий форматтер на основі конфігурації.
     */
    private DecimalFormat getDecimalFormatter() {
        if (decimalFormatter == null) {
            createFormatters();
        }
        return decimalFormatter;
    }

    /**
     * Створює форматтери на основі поточної конфігурації.
     */
    private void createFormatters() {
                try {
            String[] localeParts = currencyConfig.getLocale().split("_");
            Locale locale = localeParts.length > 1
                ? Locale.of(localeParts[0], localeParts[1])
                : Locale.of(localeParts[0]);

            DecimalFormatSymbols symbols = new DecimalFormatSymbols(locale);
            symbols.setDecimalSeparator(currencyConfig.getDecimalSeparator().charAt(0));

            if (currencyConfig.isUseGroupingSeparator()) {
                symbols.setGroupingSeparator(currencyConfig.getGroupingSeparator().charAt(0));
            }

            // Створюємо паттерн на основі налаштувань
            String pattern = currencyConfig.isUseGroupingSeparator() ? "#,##0" : "#0";
            if (currencyConfig.getDecimalPlaces() > 0) {
                pattern += "." + "0".repeat(currencyConfig.getDecimalPlaces());
            }

            currencyFormatter = new DecimalFormat(pattern, symbols);
            decimalFormatter = new DecimalFormat(pattern, symbols);

            currencyFormatter.setGroupingUsed(currencyConfig.isUseGroupingSeparator());
            decimalFormatter.setGroupingUsed(currencyConfig.isUseGroupingSeparator());

            log.debug("Створено форматтери валюти для локалі: {}, паттерн: {}", locale, pattern);

        } catch (Exception e) {
            log.error("Помилка створення форматтерів валюти: {}", e.getMessage(), e);

            // Fallback до дефолтних налаштувань
            DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.of("uk", "UA"));
            symbols.setDecimalSeparator('.');
            symbols.setGroupingSeparator(' ');

            currencyFormatter = new DecimalFormat("#,##0.00", symbols);
            decimalFormatter = new DecimalFormat("#,##0.00", symbols);
        }
    }

    /**
     * Форматує суму з валютою.
     */
    public String formatWithCurrency(BigDecimal amount) {
        if (amount == null) {
            return "0.00 " + currencyConfig.getSymbol();
        }
        return getCurrencyFormatter().format(amount) + " " + currencyConfig.getSymbol();
    }

    /**
     * Форматує суму без валюти.
     */
    public String formatAmount(BigDecimal amount) {
        if (amount == null) {
            return "0.00";
        }
        return getDecimalFormatter().format(amount);
    }

    /**
     * Форматує суму для відображення з правильним масштабом.
     */
    public String formatForDisplay(BigDecimal amount) {
        if (amount == null) {
            return "0.00";
        }

        BigDecimal scaled = amount.setScale(currencyConfig.getDecimalPlaces(), java.math.RoundingMode.HALF_UP);
        return getDecimalFormatter().format(scaled);
    }

    /**
     * Отримує символ валюти з конфігурації.
     */
    public String getCurrencySymbol() {
        return currencyConfig.getSymbol();
    }

    /**
     * Отримує код валюти з конфігурації.
     */
    public String getCurrencyCode() {
        return currencyConfig.getCode();
    }

    /**
     * Форматує суму зі знаком для відображення різниці.
     */
    public String formatDifferenceWithCurrency(BigDecimal amount) {
        if (amount == null) {
            return "0.00 " + currencyConfig.getSymbol();
        }

        String sign = amount.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
        return sign + formatWithCurrency(amount);
    }

    /**
     * Форматує відсоток.
     */
    public String formatPercentage(BigDecimal percentage) {
        if (percentage == null) {
            return "0%";
        }
        return formatAmount(percentage) + "%";
    }

    /**
     * Форматує відсоток зі знаком.
     */
    public String formatPercentageWithSign(BigDecimal percentage) {
        if (percentage == null) {
            return "0%";
        }

        String sign = percentage.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
        return sign + formatAmount(percentage) + "%";
    }
}
