package com.aksi.service.receipt;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Component;

import com.aksi.api.receipt.dto.ReceiptOrderData;
import com.aksi.api.receipt.dto.ReceiptTemplate;
import com.aksi.domain.order.OrderEntity;
import com.aksi.service.receipt.converter.ReceiptDataConverter;
import com.aksi.service.receipt.pdf.ReceiptPdfGenerator;
import com.aksi.service.receipt.pdf.ReceiptTemplateRegistry;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Facade for receipt generation operations Orchestrates the receipt generation process */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReceiptFacade {

  private final ReceiptDataConverter dataConverter;
  private final ReceiptPdfGenerator pdfGenerator;
  private final ReceiptTemplateRegistry templateRegistry;

  /** Generate receipt for an order entity */
  public byte[] generateReceipt(OrderEntity order, String locale) throws IOException {
    ReceiptOrderData orderData = dataConverter.convert(order);
    return generateReceipt(orderData, "default", locale);
  }

  /** Generate receipt preview from data */
  public byte[] generateReceipt(ReceiptOrderData orderData, String templateId, String locale)
      throws IOException {
    validateOrderData(orderData);
    validateTemplate(templateId);

    Locale localeObj = parseLocale(locale);
    return pdfGenerator.generatePdf(orderData, localeObj);
  }

  /** Get all available templates */
  public List<ReceiptTemplate> getTemplates() {
    return templateRegistry.getAllTemplates();
  }

  /** Validate order data */
  private void validateOrderData(ReceiptOrderData orderData) {
    if (orderData == null) {
      throw new IllegalArgumentException("Order data cannot be null");
    }
    if (orderData.getOrderNumber() == null) {
      throw new IllegalArgumentException("Order number is required");
    }
    if (orderData.getItems() == null || orderData.getItems().isEmpty()) {
      throw new IllegalArgumentException("Order must have at least one item");
    }
  }

  /** Validate and resolve template */
  private void validateTemplate(String templateId) {
    String effectiveTemplateId = templateId != null ? templateId : "default";
    templateRegistry
        .getTemplate(effectiveTemplateId)
        .orElseGet(
            () -> {
              log.warn("Template {} not found, using default", effectiveTemplateId);
              return templateRegistry.getDefaultTemplate();
            });
  }

  /** Parse locale string to Locale object */
  private Locale parseLocale(String locale) {
    if (locale == null || locale.isEmpty()) {
      return Locale.forLanguageTag("uk");
    }

    // Support both "uk" and "uk_UA" formats
    // Replace underscore with hyphen for proper language tag format
    String languageTag = locale.replace('_', '-');

    try {
      return Locale.forLanguageTag(languageTag);
    } catch (Exception e) {
      log.warn("Invalid locale format: {}, using default 'uk'", locale);
      return Locale.forLanguageTag("uk");
    }
  }
}
