package com.aksi.domain.document.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.document.enums.SignatureType;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * JPA Entity для цифрових підписів з business методами. Базується на OpenAPI схемі:
 * DigitalSignatureResponse
 */
@Entity
@Table(
    name = "digital_signatures",
    indexes = {
      @Index(name = "idx_signature_document_id", columnList = "documentId"),
      @Index(name = "idx_signature_type", columnList = "type"),
      @Index(name = "idx_signature_signer_name", columnList = "signerName"),
      @Index(name = "idx_signature_signed_at", columnList = "signedAt"),
      @Index(name = "idx_signature_valid", columnList = "isValid")
    })
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DigitalSignatureEntity extends BaseEntity {

  @Column(name = "document_id")
  private UUID documentId;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private SignatureType type;

  @Column(name = "signer_name", length = 200)
  private String signerName;

  @Column(name = "signer_role", length = 100)
  private String signerRole;

  @Column(name = "signed_at")
  private LocalDateTime signedAt;

  @Column(name = "ip_address", length = 45)
  private String ipAddress;

  @Column(name = "image_url", length = 500)
  private String imageUrl;

  // Metadata as JSON column - буде мапитися через MapStruct
  @Column(name = "metadata", columnDefinition = "JSON")
  private String metadata;

  @Column(name = "is_valid")
  @Builder.Default
  private Boolean isValid = true;

  // Relationship with Receipt
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "receipt_id")
  private ReceiptEntity receipt;

  // Business methods
  public boolean isValid() {
    return Boolean.TRUE.equals(isValid);
  }

  public boolean isClientHandoverSignature() {
    return type != null && type.isClientHandover();
  }

  public boolean isClientPickupSignature() {
    return type != null && type.isClientPickup();
  }

  public boolean isOperatorSignature() {
    return type != null && type.isOperatorSignature();
  }

  public boolean isDigitalSignature() {
    return type != null && type.isDigital();
  }

  public boolean isClientSignature() {
    return type != null && type.isClientSignature();
  }

  public boolean requiresPhysicalPresence() {
    return type != null && type.requiresPhysicalPresence();
  }

  public boolean hasImage() {
    return imageUrl != null && !imageUrl.trim().isEmpty();
  }

  public boolean hasMetadata() {
    return metadata != null && !metadata.trim().isEmpty();
  }

  public boolean isTransactionRelated() {
    return type != null && type.isTransactionRelated();
  }

  public boolean canBeStoredAsImage() {
    return type != null && type.canBeStoredAsImage();
  }

  public boolean isSigned() {
    return signedAt != null;
  }

  public boolean isExpired() {
    // Business rule: підпис вважається протермінованим через 1 рік
    return signedAt != null && signedAt.isBefore(LocalDateTime.now().minusYears(1));
  }

  public void invalidate(String reason) {
    this.isValid = false;
    // Можна додати reason до metadata
  }

  public void markAsSigned() {
    if (this.signedAt == null) {
      this.signedAt = LocalDateTime.now();
    }
  }

  public void setSignerInfo(String name, String role) {
    this.signerName = name;
    this.signerRole = role;
  }
}
