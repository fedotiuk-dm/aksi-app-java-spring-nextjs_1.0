package com.aksi.service.receipt.pdf.sections;

import java.util.Locale;

import org.springframework.stereotype.Component;

import com.aksi.api.receipt.dto.ReceiptOrderData;
import com.aksi.service.receipt.ReceiptFormatter;
import com.aksi.service.receipt.pdf.PdfConstants;
import com.aksi.service.receipt.pdf.PdfDocumentBuilder;

import lombok.RequiredArgsConstructor;

/** Summary section showing financial totals */
@Component
@RequiredArgsConstructor
public class SummarySection implements ReceiptSection {

  private final ReceiptFormatter formatter;
  private final ReceiptMessages messages;

  @Override
  public float draw(
      PdfDocumentBuilder builder, ReceiptOrderData orderData, float startY, Locale locale) {
    float y = startY;

    // Subtotal
    if (orderData.getSubtotal() != null) {
      y =
          drawSummaryLine(
              builder,
              messages.getSubtotalLabel(locale),
              formatter.formatMoney(orderData.getSubtotal()),
              PdfConstants.FONT_SIZE_NORMAL,
              false,
              y);
    }

    // Discount
    if (orderData.getDiscount() != null && orderData.getDiscount() > 0) {
      y =
          drawSummaryLine(
              builder,
              messages.getDiscountLabel(locale),
              formatter.formatMoneyWithSign(orderData.getDiscount(), true),
              PdfConstants.FONT_SIZE_NORMAL,
              false,
              y);
    }

    // Total
    drawSummaryLine(
        builder,
        messages.getTotalLabel(locale),
        formatter.formatMoney(orderData.getTotalAmount()),
        PdfConstants.FONT_SIZE_NORMAL + 2,
        true,
        y);
    y = builder.nextLine(PdfConstants.LINE_HEIGHT_SMALL).getCurrentY();

    // Prepaid
    if (orderData.getPrepaidAmount() != null && orderData.getPrepaidAmount() > 0) {
      y =
          drawSummaryLine(
              builder,
              messages.getPrepaidLabel(locale),
              formatter.formatMoney(orderData.getPrepaidAmount()),
              PdfConstants.FONT_SIZE_NORMAL,
              false,
              y);
    }

    // Due amount
    if (orderData.getDueAmount() != null && orderData.getDueAmount() > 0) {
      y =
          drawSummaryLine(
              builder,
              messages.getDueLabel(locale),
              formatter.formatMoney(orderData.getDueAmount()),
              PdfConstants.FONT_SIZE_NORMAL,
              true,
              y);
    }

    return y;
  }

  private float drawSummaryLine(
      PdfDocumentBuilder builder, String label, String value, int fontSize, boolean bold, float y) {
    // Draw label
    builder
        .beginText()
        .setFont("regular", fontSize)
        .setPosition(PdfConstants.SUMMARY_LABEL_X, y)
        .drawText(label)
        .endText();

    // Draw value
    builder.beginText();
    if (bold) {
      builder.setBoldFont(fontSize);
    } else {
      builder.setFont("regular", fontSize);
    }
    builder.setPosition(PdfConstants.SUMMARY_VALUE_X, y).drawText(value).endText();

    return builder.nextLine().getCurrentY();
  }
}
