package com.aksi.service.receipt.pdf.sections;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Component;

import com.aksi.api.receipt.dto.ReceiptItem;
import com.aksi.api.receipt.dto.ReceiptOrderData;
import com.aksi.service.receipt.ReceiptFormatter;
import com.aksi.service.receipt.pdf.PdfConstants;
import com.aksi.service.receipt.pdf.PdfDocumentBuilder;
import com.aksi.service.receipt.pdf.TableDrawer;

import lombok.RequiredArgsConstructor;

/** Items table section Displays order items in tabular format */
@Component
@RequiredArgsConstructor
public class ItemsTableSection implements ReceiptSection {

  private final ReceiptFormatter formatter;
  private final ReceiptMessages messages;

  @Override
  public float draw(
      PdfDocumentBuilder builder, ReceiptOrderData orderData, float startY, Locale locale) {
    builder.setCurrentY(startY);

    // Create table columns
    List<TableDrawer.TableColumn> columns =
        Arrays.asList(
            TableDrawer.TableColumn.builder()
                .header(messages.getItemNameHeader(locale))
                .x(PdfConstants.COL_NAME)
                .build(),
            TableDrawer.TableColumn.builder()
                .header(messages.getQuantityHeader(locale))
                .x(PdfConstants.COL_QUANTITY)
                .build(),
            TableDrawer.TableColumn.builder()
                .header(messages.getPriceHeader(locale))
                .x(PdfConstants.COL_PRICE)
                .build(),
            TableDrawer.TableColumn.builder()
                .header(messages.getTotalHeader(locale))
                .x(PdfConstants.COL_TOTAL)
                .build());

    TableDrawer tableDrawer =
        TableDrawer.builder()
            .builder(builder)
            .startY(startY)
            .columns(columns)
            .pageWidth(builder.getPageWidth())
            .build();

    // Draw header
    float y = tableDrawer.drawHeader();
    builder.setCurrentY(y);

    // Draw items
    for (ReceiptItem item : orderData.getItems()) {
      y = drawItem(builder, tableDrawer, item);
      builder.setCurrentY(y);
    }

    // Draw footer line
    y = tableDrawer.drawFooterLine();

    return y;
  }

  private float drawItem(PdfDocumentBuilder builder, TableDrawer tableDrawer, ReceiptItem item) {
    // Draw main item row
    List<String> values =
        Arrays.asList(
            item.getName(),
            String.valueOf(item.getQuantity()),
            formatter.formatMoney(item.getUnitPrice()),
            formatter.formatMoney(item.getTotalPrice()));

    float y = tableDrawer.drawRow(values, PdfConstants.FONT_SIZE_SMALL);
    builder.setCurrentY(y);

    // Draw modifiers if any
    if (item.getModifiers() != null && !item.getModifiers().isEmpty()) {
      String modifiersText = "(" + String.join(", ", item.getModifiers()) + ")";
      builder
          .beginText()
          .setFont("regular", PdfConstants.FONT_SIZE_TINY)
          .setPosition(PdfConstants.COL_NAME + 10, y)
          .drawText(modifiersText)
          .endText();
      y = builder.nextLine(PdfConstants.LINE_HEIGHT_SMALL).getCurrentY();
    }

    return y;
  }
}
