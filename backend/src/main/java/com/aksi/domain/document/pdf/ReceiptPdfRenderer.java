package com.aksi.domain.document.pdf;

import java.io.ByteArrayOutputStream;

import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfWriter;

import com.aksi.api.document.dto.ReceiptResponse;

/**
 * Інтерфейс для рендерингу PDF-квитанцій. Визначає методи для генерації різних секцій квитанції та
 * повного документа.
 */
public interface ReceiptPdfRenderer {

  /**
   * Генерує документ PDF для квитанції.
   *
   * @param receiptData дані квитанції
   * @param includeSignature включати підпис клієнта
   * @return масив байтів з PDF-документом
   */
  byte[] generatePdfReceipt(ReceiptResponse receiptData, boolean includeSignature);

  /**
   * Ініціалізує документ PDF.
   *
   * @return створений документ PDF та пов'язаний з ним writer
   */
  DocumentWriterPair initializeDocument();

  /**
   * Додає інформацію про замовлення до документа.
   *
   * @param document документ PDF
   * @param writer PDF writer
   * @param receiptData дані квитанції
   */
  void renderOrderInfo(Document document, PdfWriter writer, ReceiptResponse receiptData);

  /**
   * Додає інформацію про філію до документа.
   *
   * @param document документ PDF
   * @param writer PDF writer
   * @param receiptData дані квитанції
   */
  void renderBranchInfo(Document document, PdfWriter writer, ReceiptResponse receiptData);

  /**
   * Додає інформацію про клієнта до документа.
   *
   * @param document документ PDF
   * @param writer PDF writer
   * @param receiptData дані квитанції
   */
  void renderClientInfo(Document document, PdfWriter writer, ReceiptResponse receiptData);

  /**
   * Додає таблицю предметів замовлення до документа.
   *
   * @param document документ PDF
   * @param writer PDF writer
   * @param receiptData дані квитанції
   */
  void renderItemsTable(Document document, PdfWriter writer, ReceiptResponse receiptData);

  /**
   * Додає фінансову інформацію до документа.
   *
   * @param document документ PDF
   * @param writer PDF writer
   * @param receiptData дані квитанції
   */
  void renderFinancialInfo(Document document, PdfWriter writer, ReceiptResponse receiptData);

  /**
   * Додає юридичну інформацію до документа.
   *
   * @param document документ PDF
   * @param writer PDF writer
   * @param receiptData дані квитанції
   */
  void renderLegalInfo(Document document, PdfWriter writer, ReceiptResponse receiptData);

  /**
   * Додає підпис клієнта до документа.
   *
   * @param document документ PDF
   * @param writer PDF writer
   * @param receiptData дані квитанції
   * @param includeSignature включати електронний підпис, якщо доступний
   */
  void renderSignature(
      Document document, PdfWriter writer, ReceiptResponse receiptData, boolean includeSignature);

  /** Клас для повернення пари документ/writer. */
  class DocumentWriterPair {
    private final Document document;
    private final PdfWriter writer;
    private final ByteArrayOutputStream outputStream;

    public DocumentWriterPair(
        Document document, PdfWriter writer, ByteArrayOutputStream outputStream) {
      this.document = document;
      this.writer = writer;
      this.outputStream = outputStream;
    }

    public Document getDocument() {
      return document;
    }

    public PdfWriter getWriter() {
      return writer;
    }

    public ByteArrayOutputStream getOutputStream() {
      return outputStream;
    }
  }
}
