package com.aksi.domain.document.exception;

import com.aksi.domain.document.enums.DocumentStatus;
import com.aksi.domain.document.enums.DocumentType;

/** Exception що викидається при порушенні бізнес-правил документів */
public class DocumentValidationException extends RuntimeException {

  public DocumentValidationException(String message) {
    super(message);
  }

  public DocumentValidationException(String message, Throwable cause) {
    super(message, cause);
  }

  public static DocumentValidationException invalidStatus(
      DocumentStatus currentStatus, String operation) {
    return new DocumentValidationException(
        "Неможливо виконати операцію '" + operation + "' для документа у статусі " + currentStatus);
  }

  public static DocumentValidationException missingFile(String operation) {
    return new DocumentValidationException(
        "Неможливо виконати операцію '" + operation + "' - відсутній файл документа");
  }

  public static DocumentValidationException duplicateDocumentNumber(String documentNumber) {
    return new DocumentValidationException("Документ з номером '" + documentNumber + "' вже існує");
  }

  public static DocumentValidationException missingSignature(DocumentType documentType) {
    return new DocumentValidationException("Документ типу " + documentType + " потребує підпису");
  }

  public static DocumentValidationException invalidFileFormat(
      String expectedFormat, String actualFormat) {
    return new DocumentValidationException(
        "Неправильний формат файлу. Очікується: " + expectedFormat + ", отримано: " + actualFormat);
  }
}
