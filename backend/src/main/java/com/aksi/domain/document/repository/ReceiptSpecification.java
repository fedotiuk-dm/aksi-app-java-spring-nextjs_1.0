package com.aksi.domain.document.repository;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.document.entity.ReceiptEntity;

/** JPA Specifications для ReceiptEntity - type-safe dynamic queries */
public class ReceiptSpecification {

  // Document relationship specifications
  public static Specification<ReceiptEntity> hasDocumentId(Long documentId) {
    return (root, query, criteriaBuilder) ->
        documentId == null
            ? null
            : criteriaBuilder.equal(root.get("document").get("id"), documentId);
  }

  public static Specification<ReceiptEntity> hasOrderId(UUID orderId) {
    return (root, query, criteriaBuilder) ->
        orderId == null ? null : criteriaBuilder.equal(root.get("orderId"), orderId);
  }

  // QR code specifications
  public static Specification<ReceiptEntity> hasQrCodeData(String qrCodeData) {
    return (root, query, criteriaBuilder) ->
        qrCodeData == null ? null : criteriaBuilder.equal(root.get("qrCodeData"), qrCodeData);
  }

  public static Specification<ReceiptEntity> hasQrCode() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.and(
            criteriaBuilder.isNotNull(root.get("qrCodeData")),
            criteriaBuilder.notEqual(root.get("qrCodeData"), ""));
  }

  public static Specification<ReceiptEntity> hasNoQrCode() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.or(
            criteriaBuilder.isNull(root.get("qrCodeData")),
            criteriaBuilder.equal(root.get("qrCodeData"), ""));
  }

  // Print specifications
  public static Specification<ReceiptEntity> isPrinted() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isNotNull(root.get("printedAt"));
  }

  public static Specification<ReceiptEntity> isNotPrinted() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get("printedAt"));
  }

  public static Specification<ReceiptEntity> printedAfter(LocalDateTime dateTime) {
    return (root, query, criteriaBuilder) ->
        dateTime == null
            ? null
            : criteriaBuilder.greaterThanOrEqualTo(root.get("printedAt"), dateTime);
  }

  public static Specification<ReceiptEntity> printedBefore(LocalDateTime dateTime) {
    return (root, query, criteriaBuilder) ->
        dateTime == null ? null : criteriaBuilder.lessThan(root.get("printedAt"), dateTime);
  }

  public static Specification<ReceiptEntity> printedBetween(LocalDateTime from, LocalDateTime to) {
    return (root, query, criteriaBuilder) -> {
      if (from == null && to == null) return null;
      if (from == null) return criteriaBuilder.lessThanOrEqualTo(root.get("printedAt"), to);
      if (to == null) return criteriaBuilder.greaterThanOrEqualTo(root.get("printedAt"), from);
      return criteriaBuilder.between(root.get("printedAt"), from, to);
    };
  }

  // Signature specifications
  public static Specification<ReceiptEntity> hasSigned() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.isNotEmpty(root.get("digitalSignatures"));
  }

  public static Specification<ReceiptEntity> hasNoSignatures() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isEmpty(root.get("digitalSignatures"));
  }

  public static Specification<ReceiptEntity> hasClientSignature() {
    return (root, query, criteriaBuilder) -> {
      if (query == null) return null;

      var signatureJoin = root.join("digitalSignatures");
      return criteriaBuilder.or(
          criteriaBuilder.equal(
              signatureJoin.get("type"),
              com.aksi.domain.document.enums.SignatureType.CLIENT_HANDOVER),
          criteriaBuilder.equal(
              signatureJoin.get("type"),
              com.aksi.domain.document.enums.SignatureType.CLIENT_PICKUP));
    };
  }

  public static Specification<ReceiptEntity> hasOperatorSignature() {
    return (root, query, criteriaBuilder) -> {
      var signatureJoin = root.join("digitalSignatures");
      return criteriaBuilder.equal(
          signatureJoin.get("type"), com.aksi.domain.document.enums.SignatureType.OPERATOR);
    };
  }

  // Template specifications
  public static Specification<ReceiptEntity> hasTemplate(String templateName) {
    return (root, query, criteriaBuilder) ->
        templateName == null ? null : criteriaBuilder.equal(root.get("templateName"), templateName);
  }

  public static Specification<ReceiptEntity> templateNameContains(String templateName) {
    return (root, query, criteriaBuilder) ->
        templateName == null
            ? null
            : criteriaBuilder.like(
                criteriaBuilder.lower(root.get("templateName")),
                "%" + templateName.toLowerCase() + "%");
  }

  // Business logic specifications
  public static Specification<ReceiptEntity> readyForPrinting() {
    return Specification.where(isNotPrinted()).and(hasQrCode()).and(hasSigned());
  }

  public static Specification<ReceiptEntity> readyForSigning() {
    return Specification.where(hasNoSignatures()).and(hasQrCode());
  }

  public static Specification<ReceiptEntity> fullyProcessed() {
    return Specification.where(isPrinted()).and(hasClientSignature()).and(hasOperatorSignature());
  }

  public static Specification<ReceiptEntity> requiresQrCode() {
    return hasNoQrCode();
  }

  // Complex queries
  public static Specification<ReceiptEntity> searchReceipts(
      UUID orderId, String templateName, Boolean isPrinted) {
    return Specification.where(hasOrderId(orderId))
        .and(templateNameContains(templateName))
        .and(isPrinted != null ? (isPrinted ? isPrinted() : isNotPrinted()) : null);
  }

  public static Specification<ReceiptEntity> auditQuery(
      LocalDateTime from, LocalDateTime to, Boolean hasPrintedStatus) {
    Specification<ReceiptEntity> spec = Specification.where(printedBetween(from, to));

    if (hasPrintedStatus != null) {
      spec = spec.and(hasPrintedStatus ? isPrinted() : isNotPrinted());
    }

    return spec;
  }
}
