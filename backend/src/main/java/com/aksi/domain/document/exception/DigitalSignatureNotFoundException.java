package com.aksi.domain.document.exception;

import java.util.UUID;

import com.aksi.domain.document.enums.SignatureType;

/** Exception що викидається коли цифровий підпис не знайдений. */
public class DigitalSignatureNotFoundException extends RuntimeException {

  public DigitalSignatureNotFoundException(String message) {
    super(message);
  }

  public DigitalSignatureNotFoundException(UUID id) {
    super("Цифровий підпис не знайдений з ID: " + id);
  }

  public DigitalSignatureNotFoundException(String field, String value) {
    super("Цифровий підпис не знайдений з " + field + ": " + value);
  }

  public DigitalSignatureNotFoundException(String message, Throwable cause) {
    super(message, cause);
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
