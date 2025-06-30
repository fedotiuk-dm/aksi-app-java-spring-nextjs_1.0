package com.aksi.domain.document.exception;

import com.aksi.domain.document.enums.DocumentType;

/** Exception що викидається при помилках генерації документів */
public class DocumentGenerationException extends RuntimeException {

  public DocumentGenerationException(String message) {
    super(message);
  }

  public DocumentGenerationException(String message, Throwable cause) {
    super(message, cause);
  }

  public DocumentGenerationException(DocumentType documentType, String reason) {
    super("Не вдалося згенерувати документ типу " + documentType + ": " + reason);
  }

  public static DocumentGenerationException pdfGeneration(String reason) {
    return new DocumentGenerationException(DocumentType.RECEIPT, reason);
  }

  public static DocumentGenerationException qrCodeGeneration(String reason) {
    return new DocumentGenerationException(DocumentType.QR_CODE, reason);
  }

  public static DocumentGenerationException fileStorage(String reason) {
    return new DocumentGenerationException("Помилка збереження файлу: " + reason);
  }
}
