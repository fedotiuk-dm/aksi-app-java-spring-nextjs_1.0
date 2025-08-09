package com.aksi.service.receipt.pdf;

import java.io.IOException;

/** Interface for building PDF documents Provides abstraction from specific PDF library */
public interface PdfDocumentBuilder extends AutoCloseable {

  @Override
  void close();

  /** Start new text block */
  PdfDocumentBuilder beginText();

  /** End current text block */
  PdfDocumentBuilder endText();

  /** Set font for text */
  PdfDocumentBuilder setFont(String fontName, int size);

  /** Set bold font */
  PdfDocumentBuilder setBoldFont(int size);

  /** Set position for text */
  PdfDocumentBuilder setPosition(float x, float y);

  /** Draw text at current position */
  PdfDocumentBuilder drawText(String text);

  /** Draw text at specific position (convenience method) */
  PdfDocumentBuilder drawTextAt(String text, float x, float y);

  /** Draw horizontal line */
  PdfDocumentBuilder drawLine(float x1, float y1, float x2, float y2);

  /** Move to next line with default spacing */
  PdfDocumentBuilder nextLine();

  /** Move to next line with custom spacing */
  PdfDocumentBuilder nextLine(float spacing);

  /** Get current Y position */
  float getCurrentY();

  /** Set current Y position */
  PdfDocumentBuilder setCurrentY(float y);

  /** Get page width */
  float getPageWidth();

  /** Get page height */
  float getPageHeight();

  /** Build final PDF document */
  byte[] build() throws IOException;
}
