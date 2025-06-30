package com.aksi.domain.document.validation;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.document.entity.DocumentEntity;
import com.aksi.domain.document.enums.DocumentStatus;
import com.aksi.domain.document.enums.DocumentType;
import com.aksi.domain.document.exception.DocumentValidationException;
import com.aksi.domain.document.repository.DocumentRepository;

import lombok.RequiredArgsConstructor;

/** Validator для business rules документів. */
@Component
@RequiredArgsConstructor
public class DocumentValidator {

  private final DocumentRepository documentRepository;

  /** Валідація для створення документа. */
  public void validateForCreate(DocumentEntity document) {
    validateType(document.getType());
    validateDocumentNumber(document.getDocumentNumber());
    validateRelatedEntity(document.getRelatedEntityId(), document.getType());
    validateCreatedBy(document.getCreatedBy());
  }

  /** Валідація для оновлення документа. */
  public void validateForUpdate(DocumentEntity existing, DocumentEntity updated) {
    validateCanBeModified(existing);

    // Якщо змінюється номер документа
    if (!existing.getDocumentNumber().equals(updated.getDocumentNumber())) {
      validateDocumentNumber(updated.getDocumentNumber());
    }

    // Тип документа не може змінюватися
    if (!existing.getType().equals(updated.getType())) {
      throw DocumentValidationException.invalidStatus(existing.getStatus(), "зміна типу документа");
    }

    validateStatusTransition(existing.getStatus(), updated.getStatus());
  }

  /** Валідація типу документа. */
  private void validateType(DocumentType type) {
    if (type == null) {
      throw new DocumentValidationException("Тип документа є обов'язковим");
    }
  }

  /** Валідація номера документа. */
  private void validateDocumentNumber(String documentNumber) {
    if (documentNumber != null && documentRepository.existsByDocumentNumber(documentNumber)) {
      throw DocumentValidationException.duplicateDocumentNumber(documentNumber);
    }
  }

  /** Валідація пов'язаної сутності. */
  private void validateRelatedEntity(UUID relatedEntityId, DocumentType type) {
    if (relatedEntityId == null && requiresRelatedEntity(type)) {
      throw new DocumentValidationException(
          "Документ типу " + type + " повинен мати пов'язану сутність");
    }
  }

  /** Валідація створювача. */
  private void validateCreatedBy(String createdBy) {
    if (createdBy == null || createdBy.trim().isEmpty()) {
      throw new DocumentValidationException("Поле 'createdBy' є обов'язковим");
    }
  }

  /** Валідація можливості модифікації. */
  private void validateCanBeModified(DocumentEntity document) {
    if (!document.canBeModified()) {
      throw DocumentValidationException.invalidStatus(document.getStatus(), "модифікація");
    }
  }

  /** Валідація переходу статусів. */
  public void validateStatusTransition(DocumentStatus from, DocumentStatus to) {
    if (from == to) return;

    var allowedTransitions = getAllowedTransitions(from);

    if (!allowedTransitions.contains(to)) {
      throw new DocumentValidationException(
          "З статусу " + from + " можна переходити тільки до: " + allowedTransitions);
    }
  }

  private java.util.Set<DocumentStatus> getAllowedTransitions(DocumentStatus from) {
    return switch (from) {
      case DRAFT -> java.util.Set.of(DocumentStatus.GENERATED);
      case GENERATED -> java.util.Set.of(DocumentStatus.SIGNED, DocumentStatus.PRINTED);
      case SIGNED -> java.util.Set.of(DocumentStatus.PRINTED);
      case PRINTED -> java.util.Set.of(DocumentStatus.ARCHIVED);
      case ARCHIVED -> {
        throw new DocumentValidationException("Заархівований документ не може змінювати статус");
      }
    };
  }

  /** Валідація файлу документа. */
  public void validateFile(DocumentEntity document, String operation) {
    if (!document.hasFile()) {
      throw DocumentValidationException.missingFile(operation);
    }

    if (document.isPdf() && document.getFileSize() > getMaxPdfSize()) {
      throw new DocumentValidationException("Розмір PDF файлу перевищує максимально дозволений");
    }

    if (document.isImage() && document.getFileSize() > getMaxImageSize()) {
      throw new DocumentValidationException("Розмір зображення перевищує максимально дозволений");
    }
  }

  /** Валідація можливості підпису. */
  public void validateCanBeSigned(DocumentEntity document) {
    if (!document.canBeSigned()) {
      throw DocumentValidationException.invalidStatus(document.getStatus(), "підпис");
    }

    if (!document.getType().requiresSignature()) {
      throw new DocumentValidationException(
          "Документ типу " + document.getType() + " не потребує підпису");
    }
  }

  /** Валідація можливості друку. */
  public void validateCanBePrinted(DocumentEntity document) {
    if (!document.canBePrinted()) {
      throw DocumentValidationException.invalidStatus(document.getStatus(), "друк");
    }

    validateFile(document, "друк");
  }

  /** Валідація можливості архівування. */
  public void validateCanBeArchived(DocumentEntity document) {
    if (!document.canBeArchived()) {
      throw DocumentValidationException.invalidStatus(document.getStatus(), "архівування");
    }
  }

  // Helper methods
  private boolean requiresRelatedEntity(DocumentType type) {
    return type == DocumentType.RECEIPT || type == DocumentType.INVOICE;
  }

  private long getMaxPdfSize() {
    return 10 * 1024 * 1024; // 10 MB
  }

  private long getMaxImageSize() {
    return 5 * 1024 * 1024; // 5 MB
  }
}
