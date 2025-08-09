package com.aksi.service.receipt.pdf;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.core.io.ClassPathResource;

import com.aksi.config.ReceiptConfiguration;

import lombok.extern.slf4j.Slf4j;

/** PDFBox implementation of PdfDocumentBuilder */
@Slf4j
@SuppressWarnings(
    "resource") // This is a builder pattern, not a resource that needs closing in each method
public class PdfBoxDocumentBuilder implements PdfDocumentBuilder {

  private static final float DEFAULT_LINE_HEIGHT = 15;
  private static final float DEFAULT_MARGIN = 20;

  private final PDDocument document;
  private final PDPage page;
  private final PDPageContentStream contentStream;
  private final ReceiptConfiguration config;
  private PDFont currentFont;
  private PDFont regularFont;
  private PDFont boldFont;
  private float currentY;
  private boolean inTextBlock = false;
  private boolean closed = false;

  public PdfBoxDocumentBuilder(ReceiptConfiguration config) throws IOException {
    this.config = config;
    this.document = new PDDocument();
    this.page = new PDPage(PDRectangle.A4);
    this.document.addPage(page);
    this.contentStream = new PDPageContentStream(document, page);
    this.currentY = page.getMediaBox().getHeight() - DEFAULT_MARGIN;

    initializeFonts();
  }

  private void initializeFonts() {
    try {
      // Load regular font
      String regularFontPath = config.getFont().getDirectory() + config.getFont().getRegular();
      ClassPathResource regularResource = new ClassPathResource(regularFontPath);
      if (regularResource.exists()) {
        try (InputStream fontStream = regularResource.getInputStream()) {
          this.regularFont = PDType0Font.load(document, fontStream);
          log.debug("Successfully loaded regular font: {}", regularFontPath);
        }
      } else {
        log.warn("Regular font not found at: {}", regularFontPath);
      }

      // Load bold font
      String boldFontPath = config.getFont().getDirectory() + config.getFont().getBold();
      ClassPathResource boldResource = new ClassPathResource(boldFontPath);
      if (boldResource.exists()) {
        try (InputStream fontStream = boldResource.getInputStream()) {
          this.boldFont = PDType0Font.load(document, fontStream);
          log.debug("Successfully loaded bold font: {}", boldFontPath);
        }
      } else {
        // Fallback to regular font if bold not found
        this.boldFont = this.regularFont;
        log.warn("Bold font not found at {}, using regular font", boldFontPath);
      }
    } catch (Exception e) {
      log.error("Could not load custom fonts, using defaults", e);
      this.regularFont = null;
      this.boldFont = null;
    }

    // Fallback to standard fonts if custom fonts not loaded
    if (this.regularFont == null) {
      log.warn("Using fallback fonts - Ukrainian text may not display correctly");
      this.regularFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
      this.boldFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
    }

    this.currentFont = this.regularFont;
    log.info("Font initialization complete. Regular font type: {}", 
             this.regularFont.getClass().getSimpleName());
  }

  @Override
  public PdfDocumentBuilder beginText() {
    try {
      if (!inTextBlock) {
        contentStream.beginText();
        inTextBlock = true;
      }
    } catch (IOException e) {
      throw new RuntimeException("Failed to begin text", e);
    }
    return this;
  }

  @Override
  public PdfDocumentBuilder endText() {
    try {
      if (inTextBlock) {
        contentStream.endText();
        inTextBlock = false;
      }
    } catch (IOException e) {
      throw new RuntimeException("Failed to end text", e);
    }
    return this;
  }

  @Override
  public PdfDocumentBuilder setFont(String fontName, int size) {
    try {
      if (inTextBlock) {
        contentStream.setFont(currentFont, size);
      }
    } catch (IOException e) {
      throw new RuntimeException("Failed to set font", e);
    }
    return this;
  }

  @Override
  public PdfDocumentBuilder setBoldFont(int size) {
    try {
      currentFont = boldFont;
      if (inTextBlock) {
        contentStream.setFont(boldFont, size);
      }
    } catch (IOException e) {
      throw new RuntimeException("Failed to set bold font", e);
    }
    return this;
  }

  @Override
  public PdfDocumentBuilder setPosition(float x, float y) {
    try {
      if (inTextBlock) {
        contentStream.newLineAtOffset(x, y);
      }
      currentY = y;
    } catch (IOException e) {
      throw new RuntimeException("Failed to set position", e);
    }
    return this;
  }

  @Override
  public PdfDocumentBuilder drawText(String text) {
    try {
      if (inTextBlock && text != null) {
        // Log font info for debugging
        if (log.isDebugEnabled() && text.length() > 0) {
          log.debug("Drawing text with font {}: '{}'", currentFont.getName(), 
                   text.length() > 20 ? text.substring(0, 20) + "..." : text);
        }
        contentStream.showText(text);
      }
    } catch (IOException e) {
      log.error("Failed to draw text: '{}' with font: {}", text, currentFont.getName(), e);
      throw new RuntimeException("Failed to draw text", e);
    }
    return this;
  }

  @Override
  public PdfDocumentBuilder drawTextAt(String text, float x, float y) {
    beginText();
    setFont("regular", 10);
    setPosition(x, y);
    drawText(text);
    endText();
    currentY = y;
    return this;
  }

  @Override
  public PdfDocumentBuilder drawLine(float x1, float y1, float x2, float y2) {
    try {
      endText(); // Ensure we're not in text mode
      contentStream.moveTo(x1, y1);
      contentStream.lineTo(x2, y2);
      contentStream.stroke();
    } catch (IOException e) {
      throw new RuntimeException("Failed to draw line", e);
    }
    return this;
  }

  @Override
  public PdfDocumentBuilder nextLine() {
    return nextLine(DEFAULT_LINE_HEIGHT);
  }

  @Override
  public PdfDocumentBuilder nextLine(float spacing) {
    currentY -= spacing;
    return this;
  }

  @Override
  public float getCurrentY() {
    return currentY;
  }

  @Override
  public PdfDocumentBuilder setCurrentY(float y) {
    this.currentY = y;
    return this;
  }

  @Override
  public float getPageWidth() {
    return page.getMediaBox().getWidth();
  }

  @Override
  public float getPageHeight() {
    return page.getMediaBox().getHeight();
  }

  @Override
  public byte[] build() throws IOException {
    if (closed) {
      throw new IllegalStateException("Document builder is already closed");
    }
    
    try {
      endText(); // Ensure text block is closed
      contentStream.close();

      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      document.save(baos);
      return baos.toByteArray();
    } finally {
      document.close();
      closed = true;
    }
  }

  @Override
  public void close() throws IOException {
    if (closed) {
      return; // Already closed
    }
    
    try {
      endText(); // Ensure text block is properly closed
      if (contentStream != null) {
        contentStream.close();
      }
    } catch (Exception e) {
      log.warn("Error closing content stream", e);
    } finally {
      try {
        if (document != null) {
          document.close();
        }
      } catch (Exception e) {
        log.warn("Error closing document", e);
      } finally {
        closed = true;
      }
    }
  }
}
