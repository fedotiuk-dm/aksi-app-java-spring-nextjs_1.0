package com.aksi.domain.document.exception;

import java.util.UUID;

import com.aksi.domain.document.enums.SignatureType;

/** Exception що викидається коли цифровий підпис не знайдений */
public class DigitalSignatureNotFoundException extends RuntimeException {

  public DigitalSignatureNotFoundException(String message) {
    super(message);
  }

  public DigitalSignatureNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public DigitalSignatureNotFoundException(Long id) {
    super("Цифровий підпис з ID " + id + " не знайдений");
  }

  public static DigitalSignatureNotFoundException byDocumentIdAndType(
      UUID documentId, SignatureType type) {
    return new DigitalSignatureNotFoundException(
        "Підпис типу " + type + " для документа " + documentId + " не знайдений");
  }

  public static DigitalSignatureNotFoundException byReceiptAndType(
      String receiptNumber, SignatureType type) {
    return new DigitalSignatureNotFoundException(
        "Підпис типу " + type + " для квитанції " + receiptNumber + " не знайдений");
  }
}
