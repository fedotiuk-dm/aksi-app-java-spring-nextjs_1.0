package com.aksi.domain.document.exception;

import java.util.UUID;

/** Exception що викидається коли документ не знайдений */
public class DocumentNotFoundException extends RuntimeException {

  public DocumentNotFoundException(String message) {
    super(message);
  }

  public DocumentNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public DocumentNotFoundException(Long id) {
    super("Документ з ID " + id + " не знайдений");
  }

  public DocumentNotFoundException(String field, String value) {
    super("Документ з " + field + " '" + value + "' не знайдений");
  }

  public DocumentNotFoundException(UUID relatedEntityId) {
    super("Документ для сутності з ID " + relatedEntityId + " не знайдений");
  }

  public static DocumentNotFoundException byDocumentNumber(String documentNumber) {
    return new DocumentNotFoundException("documentNumber", documentNumber);
  }

  public static DocumentNotFoundException byRelatedEntity(UUID relatedEntityId) {
    return new DocumentNotFoundException(relatedEntityId);
  }
}
