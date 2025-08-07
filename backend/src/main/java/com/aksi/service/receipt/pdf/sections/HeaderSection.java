package com.aksi.service.receipt.pdf.sections;

import java.util.Locale;

import org.springframework.stereotype.Component;

import com.aksi.api.receipt.dto.ReceiptOrderData;
import com.aksi.service.receipt.ReceiptFormatter;
import com.aksi.service.receipt.pdf.PdfConstants;
import com.aksi.service.receipt.pdf.PdfDocumentBuilder;

import lombok.RequiredArgsConstructor;

/** Header section of the receipt Displays branch info and receipt title */
@Component
@RequiredArgsConstructor
public class HeaderSection implements ReceiptSection {

  private final ReceiptFormatter formatter;
  private final ReceiptMessages messages;

  @Override
  public float draw(
      PdfDocumentBuilder builder, ReceiptOrderData orderData, float startY, Locale locale) {
    float y = startY;

    // Company name
    String branchName = formatter.safeString(orderData.getBranchName(), "AKSI");
    builder
        .beginText()
        .setBoldFont(PdfConstants.FONT_SIZE_TITLE)
        .setPosition(PdfConstants.MARGIN_LEFT, y)
        .drawText(branchName)
        .endText();
    y = builder.nextLine(PdfConstants.LINE_HEIGHT_LARGE).getCurrentY();

    // Branch address
    if (orderData.getBranchAddress() != null) {
      builder.drawTextAt(orderData.getBranchAddress(), PdfConstants.MARGIN_LEFT, y);
      y = builder.nextLine().getCurrentY();
    }

    // Branch phone
    if (orderData.getBranchPhone() != null) {
      String phone = formatter.formatPhone(orderData.getBranchPhone());
      builder.drawTextAt(phone, PdfConstants.MARGIN_LEFT, y);
      builder.nextLine();
    }

    // Extra space before title
    y = builder.nextLine().getCurrentY();

    // Receipt title
    builder
        .beginText()
        .setBoldFont(PdfConstants.FONT_SIZE_SUBTITLE)
        .setPosition(PdfConstants.MARGIN_LEFT, y)
        .drawText(messages.getReceiptTitle(locale) + orderData.getOrderNumber())
        .endText();
    y = builder.nextLine().getCurrentY();

    // Date
    String dateText =
        messages.getFromDate(locale) + formatter.formatDateTime(orderData.getCreatedAt());
    builder.drawTextAt(dateText, PdfConstants.MARGIN_LEFT, y);
    y = builder.nextLine(PdfConstants.LINE_HEIGHT_LARGE * 2).getCurrentY();

    return y;
  }
}
