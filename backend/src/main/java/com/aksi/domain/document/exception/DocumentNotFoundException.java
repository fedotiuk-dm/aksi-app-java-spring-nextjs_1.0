package com.aksi.domain.document.exception;

import java.util.UUID;

/** Виняток коли документ не знайдений Специфічний для Document domain RuntimeException. */
public class DocumentNotFoundException extends RuntimeException {

  public DocumentNotFoundException(String message) {
    super(message);
  }

  public DocumentNotFoundException(UUID id) {
    super("Документ не знайдений з ID: " + id);
  }

  public DocumentNotFoundException(String field, String value) {
    super("Документ не знайдений з " + field + ": " + value);
  }

  public DocumentNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  // Static factory methods для різних сценаріїв

  public static DocumentNotFoundException byDocumentNumber(String documentNumber) {
    return new DocumentNotFoundException("documentNumber", documentNumber);
  }

  public static DocumentNotFoundException byRelatedEntityId(UUID relatedEntityId) {
    return new DocumentNotFoundException("relatedEntityId", relatedEntityId.toString());
  }
}
