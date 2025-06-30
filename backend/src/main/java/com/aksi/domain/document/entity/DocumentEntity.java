package com.aksi.domain.document.entity;

import java.util.UUID;

import com.aksi.domain.document.enums.DocumentStatus;
import com.aksi.domain.document.enums.DocumentType;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/** JPA Entity для документів з business методами. Базується на OpenAPI схемі: DocumentResponse */
@Entity
@Table(
    name = "documents",
    indexes = {
      @Index(name = "idx_document_type", columnList = "type"),
      @Index(name = "idx_document_status", columnList = "status"),
      @Index(name = "idx_document_related_entity", columnList = "relatedEntityId"),
      @Index(name = "idx_document_number", columnList = "documentNumber"),
      @Index(name = "idx_document_created_by", columnList = "createdBy")
    })
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentEntity extends BaseEntity {

  @Column(name = "document_number", length = 100)
  private String documentNumber;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private DocumentType type;

  @Column(name = "related_entity_id")
  private UUID relatedEntityId;

  @Column(name = "file_name", length = 255)
  private String fileName;

  @Column(name = "file_path", length = 500)
  private String filePath;

  @Column(name = "file_size")
  private Long fileSize;

  @Column(name = "mime_type", length = 100)
  private String mimeType;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  @Builder.Default
  private DocumentStatus status = DocumentStatus.DRAFT;

  @Column(name = "download_url", length = 500)
  private String downloadUrl;

  @Column(name = "created_by", length = 100)
  private String createdBy;

  // Metadata as JSON column - буде мапитися через MapStruct
  @Column(name = "metadata", columnDefinition = "JSON")
  private String metadata;

  // Business methods
  public boolean isReceipt() {
    return type != null && type.isReceiptType();
  }

  public boolean canBeModified() {
    return status != null && status.canBeModified();
  }

  public boolean canBeDownloaded() {
    return type != null && type.canBeDownloaded() && filePath != null && !filePath.trim().isEmpty();
  }

  public boolean canBeSigned() {
    return status != null && status.canBeSignated() && type != null && type.requiresSignature();
  }

  public boolean canBePrinted() {
    return status != null
        && status.canBePrinted()
        && filePath != null
        && !filePath.trim().isEmpty();
  }

  public boolean canBeArchived() {
    return status != null && status.canBeArchived();
  }

  public boolean isCompleted() {
    return status != null && status.isCompleted();
  }

  public boolean hasFile() {
    return filePath != null && !filePath.trim().isEmpty() && fileSize != null && fileSize > 0;
  }

  public boolean isImage() {
    return mimeType != null && mimeType.startsWith("image/");
  }

  public boolean isPdf() {
    return "application/pdf".equals(mimeType);
  }

  public boolean isFinancial() {
    return type != null && type.isFinancialDocument();
  }

  public boolean isLegal() {
    return type != null && type.isLegalDocument();
  }

  public void markAsGenerated(String filePath, String fileName, Long fileSize, String mimeType) {
    this.status = DocumentStatus.GENERATED;
    this.filePath = filePath;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.mimeType = mimeType;
  }

  public void markAsSigned() {
    if (!canBeSigned()) {
      throw new IllegalStateException(
          "Документ не може бути підписаний у поточному стані: " + status);
    }
    this.status = DocumentStatus.SIGNED;
  }

  public void markAsPrinted() {
    if (!canBePrinted()) {
      throw new IllegalStateException(
          "Документ не може бути роздрукований у поточному стані: " + status);
    }
    this.status = DocumentStatus.PRINTED;
  }

  public void markAsArchived() {
    if (!canBeArchived()) {
      throw new IllegalStateException(
          "Документ не може бути заархівований у поточному стані: " + status);
    }
    this.status = DocumentStatus.ARCHIVED;
  }
}
