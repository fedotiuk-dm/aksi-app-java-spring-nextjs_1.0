package com.aksi.service.receipt.pdf;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Component;

import com.aksi.api.receipt.dto.ReceiptOrderData;
import com.aksi.config.ReceiptConfiguration;
import com.aksi.service.receipt.pdf.sections.CustomerSection;
import com.aksi.service.receipt.pdf.sections.FooterSection;
import com.aksi.service.receipt.pdf.sections.HeaderSection;
import com.aksi.service.receipt.pdf.sections.ItemsTableSection;
import com.aksi.service.receipt.pdf.sections.ReceiptSection;
import com.aksi.service.receipt.pdf.sections.SummarySection;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Main PDF generator for receipts Orchestrates all sections to create complete receipt */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReceiptPdfGenerator {

  private final ReceiptConfiguration config;
  private final HeaderSection headerSection;
  private final CustomerSection customerSection;
  private final ItemsTableSection itemsTableSection;
  private final SummarySection summarySection;
  private final FooterSection footerSection;

  /** Generate PDF receipt from order data with locale */
  public byte[] generatePdf(ReceiptOrderData orderData, Locale locale) throws IOException {
    if (orderData == null) {
      throw new IllegalArgumentException("Order data cannot be null");
    }

    log.debug("Generating PDF for order: {}", orderData.getOrderNumber());

    try (PdfDocumentBuilder builder = createPdfBuilder()) {
      float y = builder.getPageHeight() - PdfConstants.MARGIN_TOP;

      // Draw all sections in order
      List<ReceiptSection> sections =
          List.of(headerSection, customerSection, itemsTableSection, summarySection, footerSection);

      for (ReceiptSection section : sections) {
        y = section.draw(builder, orderData, y, locale);
      }

      return builder.build();
    } catch (Exception e) {
      log.error("Failed to generate PDF for order: {}", orderData.getOrderNumber(), e);
      throw new IOException("PDF generation failed", e);
    }
  }

  /** Create PDF document builder Protected for testing purposes */
  protected PdfDocumentBuilder createPdfBuilder() throws IOException {
    return new PdfBoxDocumentBuilder(config);
  }
}
