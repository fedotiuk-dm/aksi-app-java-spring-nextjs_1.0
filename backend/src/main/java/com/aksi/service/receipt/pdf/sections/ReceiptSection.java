package com.aksi.service.receipt.pdf.sections;

import java.util.Locale;

import com.aksi.api.receipt.dto.ReceiptOrderData;
import com.aksi.service.receipt.pdf.PdfDocumentBuilder;

/**
 * Base interface for receipt sections Each section is responsible for drawing its part of the
 * receipt
 */
public interface ReceiptSection {

  /**
   * Draw this section on the PDF document
   *
   * @param builder PDF document builder
   * @param orderData Order data to display
   * @param startY Starting Y position
   * @param locale Locale for messages
   * @return New Y position after drawing
   */
  float draw(PdfDocumentBuilder builder, ReceiptOrderData orderData, float startY, Locale locale);
}
