package com.aksi.service.receipt;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.Temporal;

import org.springframework.stereotype.Component;

/** Formatter for receipt data Follows SRP - responsible only for formatting various data types */
@Component
public class ReceiptFormatter {

  private static final String CURRENCY_SUFFIX = " грн";
  private static final String DEFAULT_MONEY_VALUE = "0.00" + CURRENCY_SUFFIX;
  private static final DateTimeFormatter DATE_TIME_FORMATTER =
      DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");

  /** Format money amount from kopiykas to hryvnias */
  public String formatMoney(Integer kopiykas) {
    if (kopiykas == null) {
      return DEFAULT_MONEY_VALUE;
    }

    BigDecimal amount =
        new BigDecimal(kopiykas).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);

    return String.format("%.2f%s", amount, CURRENCY_SUFFIX);
  }

  /** Format money amount with optional negative sign */
  public String formatMoneyWithSign(Integer kopiykas, boolean negative) {
    String formatted = formatMoney(kopiykas);
    return negative ? "-" + formatted : formatted;
  }

  /** Format date and time */
  public String formatDateTime(Temporal temporal) {
    if (temporal == null) {
      return "";
    }
    return DATE_TIME_FORMATTER.format(temporal);
  }

  /** Format date only */
  public String formatDate(LocalDate date) {
    if (date == null) {
      return "";
    }
    return DATE_FORMATTER.format(date);
  }

  /** Format phone number */
  public String formatPhone(String phone) {
    if (phone == null || phone.isEmpty()) {
      return "";
    }
    return "Тел: " + phone;
  }

  /** Format label with value */
  public String formatLabelValue(String label, String value) {
    if (label == null || value == null || value.isEmpty()) {
      return "";
    }
    return label + ": " + value;
  }

  /** Safely get string value with default */
  public String safeString(String value, String defaultValue) {
    return value != null && !value.isEmpty() ? value : defaultValue;
  }
}
