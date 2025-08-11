package com.aksi.service.receipt.pdf.sections;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

/**
 * Centralized message provider for receipt generation Supports internationalization through
 * MessageSource
 */
@Component
@RequiredArgsConstructor
public class ReceiptMessages {

  private final MessageSource messageSource;

  // Header messages
  public String getReceiptTitle(Locale locale) {
    return getMessage("receipt.title", locale);
  }

  public String getFromDate(Locale locale) {
    return getMessage("receipt.from", locale);
  }

  // Customer section
  public String getCustomerLabel(Locale locale) {
    return getMessage("receipt.customer.label", locale);
  }

  public String getPhoneLabel(Locale locale) {
    return getMessage("receipt.customer.phone", locale);
  }

  // Table headers
  public String getItemNameHeader(Locale locale) {
    return getMessage("receipt.table.item", locale);
  }

  public String getQuantityHeader(Locale locale) {
    return getMessage("receipt.table.quantity", locale);
  }

  public String getPriceHeader(Locale locale) {
    return getMessage("receipt.table.price", locale);
  }

  public String getTotalHeader(Locale locale) {
    return getMessage("receipt.table.total", locale);
  }

  // Summary section
  public String getSubtotalLabel(Locale locale) {
    return getMessage("receipt.summary.subtotal", locale);
  }

  public String getDiscountLabel(Locale locale) {
    return getMessage("receipt.summary.discount", locale);
  }

  public String getTotalLabel(Locale locale) {
    return getMessage("receipt.summary.total", locale);
  }

  public String getPrepaidLabel(Locale locale) {
    return getMessage("receipt.summary.prepaid", locale);
  }

  public String getDueLabel(Locale locale) {
    return getMessage("receipt.summary.due", locale);
  }

  // Footer messages
  public String getCompletionDateLabel(Locale locale) {
    return getMessage("receipt.footer.completionDate", locale);
  }

  public String getNotesLabel(Locale locale) {
    return getMessage("receipt.footer.notes", locale);
  }

  public String getThankYouMessage(Locale locale) {
    return getMessage("receipt.footer.thankYou", locale);
  }

  // Utility method
  private String getMessage(String code, Locale locale) {
    return messageSource.getMessage(code, null, getDefaultMessage(code), locale);
  }

  private String getDefaultMessage(String code) {
    return switch (code) {
      case "receipt.title" -> Defaults.RECEIPT_TITLE;
      case "receipt.from" -> Defaults.FROM_DATE;
      case "receipt.customer.label" -> Defaults.CUSTOMER_LABEL;
      case "receipt.customer.phone" -> Defaults.PHONE_LABEL;
      case "receipt.table.item" -> Defaults.ITEM_NAME;
      case "receipt.table.quantity" -> Defaults.QUANTITY;
      case "receipt.table.price" -> Defaults.PRICE;
      case "receipt.table.total" -> Defaults.TOTAL;
      case "receipt.summary.subtotal" -> Defaults.SUBTOTAL;
      case "receipt.summary.discount" -> Defaults.DISCOUNT;
      case "receipt.summary.total" -> Defaults.TOTAL_AMOUNT;
      case "receipt.summary.prepaid" -> Defaults.PREPAID;
      case "receipt.summary.due" -> Defaults.DUE;
      case "receipt.footer.completionDate" -> Defaults.COMPLETION_DATE;
      case "receipt.footer.notes" -> Defaults.NOTES;
      case "receipt.footer.thankYou" -> Defaults.THANK_YOU;
      default -> code;
    };
  }

  /** Default messages for fallback when localization is not available. */
  public static class Defaults {

    /** Receipt title prefix. */
    public static final String RECEIPT_TITLE = "КВИТАНЦІЯ № ";

    /** Date prefix for receipt date. */
    public static final String FROM_DATE = "від ";

    /** Label for customer information. */
    public static final String CUSTOMER_LABEL = "Клієнт";

    /** Label for phone number. */
    public static final String PHONE_LABEL = "Телефон";

    /** Column header for item names. */
    public static final String ITEM_NAME = "Найменування";

    /** Column header for quantity. */
    public static final String QUANTITY = "К-ть";

    /** Column header for price. */
    public static final String PRICE = "Ціна";

    /** Column header for total amount. */
    public static final String TOTAL = "Сума";

    /** Label for subtotal amount. */
    public static final String SUBTOTAL = "Підсумок:";

    /** Label for discount amount. */
    public static final String DISCOUNT = "Знижка:";

    /** Label for total amount. */
    public static final String TOTAL_AMOUNT = "Всього:";

    /** Label for prepaid amount. */
    public static final String PREPAID = "Передплата:";

    /** Label for amount due. */
    public static final String DUE = "До сплати:";

    /** Label for completion date. */
    public static final String COMPLETION_DATE = "Дата готовності";

    /** Label for notes section. */
    public static final String NOTES = "Примітки";

    /** Thank you message. */
    public static final String THANK_YOU = "Дякуємо за ваше замовлення!";
  }
}
