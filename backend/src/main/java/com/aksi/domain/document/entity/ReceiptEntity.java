package com.aksi.domain.document.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/** JPA Entity для квитанцій з business методами. Базується на OpenAPI схемі: ReceiptResponse. */
@Entity
@Table(
    name = "receipts",
    indexes = {
      @Index(name = "idx_receipt_order_id", columnList = "orderId"),
      @Index(name = "idx_receipt_number", columnList = "receiptNumber", unique = true),
      @Index(name = "idx_receipt_printed", columnList = "isPrinted"),
      @Index(name = "idx_receipt_generated_by", columnList = "generatedBy")
    })
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptEntity extends BaseEntity {

  @Column(name = "order_id", nullable = false)
  private UUID orderId;

  @Column(name = "receipt_number", nullable = false, unique = true, length = 50)
  private String receiptNumber;

  // Receipt data as JSON column - буде мапитися через MapStruct
  @Column(name = "data", nullable = false, columnDefinition = "JSON")
  private String data;

  // Relationships
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "pdf_document_id")
  private DocumentEntity pdfDocument;

  @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @Builder.Default
  private List<DigitalSignatureEntity> signatures = new ArrayList<>();

  // QR Code reference
  @Column(name = "qr_code_id")
  private UUID qrCodeId;

  @Column(name = "is_printed", nullable = false)
  @Builder.Default
  private Boolean isPrinted = false;

  @Column(name = "printed_at", nullable = false)
  private LocalDateTime printedAt;

  @Column(name = "generated_at", nullable = false)
  private LocalDateTime generatedAt;

  @Column(name = "generated_by", nullable = false, length = 100)
  private String generatedBy;

  // Business methods
  public boolean isPrinted() {
    return Boolean.TRUE.equals(isPrinted);
  }

  public boolean canBePrinted() {
    return !isPrinted() && hasPdfDocument();
  }

  public boolean hasPdfDocument() {
    return pdfDocument != null && pdfDocument.hasFile();
  }

  public boolean hasQrCode() {
    return qrCodeId != null;
  }

  public boolean hasSignatures() {
    return signatures != null && !signatures.isEmpty();
  }

  public boolean hasClientSignature() {
    return signatures != null
        && signatures.stream()
            .anyMatch(sig -> sig.getType() != null && sig.getType().isClientSignature());
  }

  public boolean hasOperatorSignature() {
    return signatures != null
        && signatures.stream()
            .anyMatch(sig -> sig.getType() != null && sig.getType().isOperatorSignature());
  }

  public boolean isFullySigned() {
    return hasClientSignature() && hasOperatorSignature();
  }

  public boolean canBeArchived() {
    return isPrinted() && isFullySigned();
  }

  public boolean isReadyForDelivery() {
    return hasPdfDocument() && hasSignatures();
  }

  public int getSignatureCount() {
    return signatures != null ? signatures.size() : 0;
  }

  public void markAsPrinted() {
    if (!canBePrinted()) {
      throw new IllegalStateException("Квитанція не може бути роздрукована без PDF документа");
    }
    this.isPrinted = true;
    this.printedAt = LocalDateTime.now();
  }

  public void addSignature(DigitalSignatureEntity signature) {
    if (signatures == null) {
      signatures = new ArrayList<>();
    }
    signature.setReceipt(this);
    signatures.add(signature);
  }

  public void removeSignature(DigitalSignatureEntity signature) {
    if (signatures != null) {
      signatures.remove(signature);
      signature.setReceipt(null);
    }
  }
}
