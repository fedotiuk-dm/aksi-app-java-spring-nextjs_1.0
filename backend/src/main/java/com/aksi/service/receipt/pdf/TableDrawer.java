package com.aksi.service.receipt.pdf;

import java.util.List;

import lombok.Builder;

/** Helper class for drawing tables in PDF Follows SRP - responsible only for table drawing logic */
@Builder
public class TableDrawer {

  private final PdfDocumentBuilder builder;
  private final float startY;
  private final List<TableColumn> columns;
  private final float pageWidth;

  /** Draw table header */
  public float drawHeader() {
    float y = startY;

    // Draw column headers
    for (TableColumn column : columns) {
      builder
          .beginText()
          .setFont("regular", PdfConstants.FONT_SIZE_NORMAL)
          .setPosition(column.x(), y)
          .drawText(column.header())
          .endText();
    }

    y = builder.nextLine().getCurrentY();

    // Draw header line
    builder.drawLine(PdfConstants.MARGIN_LEFT, y + 5, pageWidth - PdfConstants.MARGIN_RIGHT, y + 5);

    return builder.nextLine(5).getCurrentY();
  }

  /** Draw table row */
  public float drawRow(List<String> values, int fontSize) {
    if (values.size() != columns.size()) {
      throw new IllegalArgumentException("Values count must match columns count");
    }

    float y = builder.getCurrentY();

    for (int i = 0; i < columns.size(); i++) {
      TableColumn column = columns.get(i);
      String value = values.get(i);

      if (value != null && !value.isEmpty()) {
        builder
            .beginText()
            .setFont("regular", fontSize)
            .setPosition(column.x(), y)
            .drawText(value)
            .endText();
      }
    }

    return builder.nextLine().getCurrentY();
  }

  /** Draw table footer line */
  public float drawFooterLine() {
    float y = builder.getCurrentY() - 5;

    builder.drawLine(PdfConstants.MARGIN_LEFT, y + 5, pageWidth - PdfConstants.MARGIN_RIGHT, y + 5);

    return builder.nextLine().getCurrentY();
  }

  /** Table column definition */
  @Builder
  public record TableColumn(String header, float x, float width) {}
}
