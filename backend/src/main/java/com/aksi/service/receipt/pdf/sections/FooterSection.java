package com.aksi.service.receipt.pdf.sections;

import java.util.Locale;

import org.springframework.stereotype.Component;

import com.aksi.api.receipt.dto.ReceiptOrderData;
import com.aksi.service.receipt.ReceiptFormatter;
import com.aksi.service.receipt.pdf.PdfConstants;
import com.aksi.service.receipt.pdf.PdfDocumentBuilder;

import lombok.RequiredArgsConstructor;

/** Footer section with additional info */
@Component
@RequiredArgsConstructor
public class FooterSection implements ReceiptSection {

  private final ReceiptFormatter formatter;
  private final ReceiptMessages messages;

  @Override
  public float draw(
      PdfDocumentBuilder builder, ReceiptOrderData orderData, float startY, Locale locale) {
    float y = builder.nextLine().getCurrentY();

    // Completion date
    if (orderData.getCompletionDate() != null) {
      String completionText =
          formatter.formatLabelValue(
              messages.getCompletionDateLabel(locale),
              formatter.formatDate(orderData.getCompletionDate()));
      builder.drawTextAt(completionText, PdfConstants.MARGIN_LEFT, y);
      y = builder.nextLine().getCurrentY();
    }

    // Notes
    if (orderData.getNotes() != null && !orderData.getNotes().isEmpty()) {
      String notesText =
          formatter.formatLabelValue(messages.getNotesLabel(locale), orderData.getNotes());
      builder
          .beginText()
          .setFont("regular", PdfConstants.FONT_SIZE_SMALL)
          .setPosition(PdfConstants.MARGIN_LEFT, y)
          .drawText(notesText)
          .endText();
      y = builder.nextLine().getCurrentY();
    }

    // Thank you message
    builder.drawTextAt(messages.getThankYouMessage(locale), PdfConstants.MARGIN_LEFT, y);
    y = builder.nextLine().getCurrentY();

    return y;
  }
}
