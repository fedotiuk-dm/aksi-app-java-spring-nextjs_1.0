package com.aksi.service.receipt.pdf.sections;

import java.util.Locale;

import org.springframework.stereotype.Component;

import com.aksi.api.receipt.dto.ReceiptOrderData;
import com.aksi.service.receipt.ReceiptFormatter;
import com.aksi.service.receipt.pdf.PdfConstants;
import com.aksi.service.receipt.pdf.PdfDocumentBuilder;

import lombok.RequiredArgsConstructor;

/** Customer information section */
@Component
@RequiredArgsConstructor
public class CustomerSection implements ReceiptSection {

  private final ReceiptFormatter formatter;
  private final ReceiptMessages messages;

  @Override
  public float draw(
      PdfDocumentBuilder builder, ReceiptOrderData orderData, float startY, Locale locale) {
    float y = startY;

    // Customer name
    String customerText =
        formatter.formatLabelValue(messages.getCustomerLabel(locale), orderData.getCustomerName());
    if (!customerText.isEmpty()) {
      builder.drawTextAt(customerText, PdfConstants.MARGIN_LEFT, y);
      y = builder.nextLine().getCurrentY();
    }

    // Customer phone
    if (orderData.getCustomerPhone() != null) {
      String phoneText =
          formatter.formatLabelValue(messages.getPhoneLabel(locale), orderData.getCustomerPhone());
      builder.drawTextAt(phoneText, PdfConstants.MARGIN_LEFT, y);
      builder.nextLine().getCurrentY();
    }

    // Extra space after customer info
    y = builder.nextLine().getCurrentY();

    return y;
  }
}
