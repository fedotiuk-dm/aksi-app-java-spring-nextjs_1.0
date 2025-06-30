package com.aksi.domain.document.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.document.entity.DigitalSignatureEntity;
import com.aksi.domain.document.enums.SignatureType;

/** JPA Specifications для DigitalSignatureEntity - type-safe dynamic queries */
public class DigitalSignatureSpecification {

  // Type specifications
  public static Specification<DigitalSignatureEntity> hasSignatureType(
      SignatureType signatureType) {
    return (root, query, criteriaBuilder) ->
        signatureType == null
            ? null
            : criteriaBuilder.equal(root.get("signatureType"), signatureType);
  }

  public static Specification<DigitalSignatureEntity> hasSignatureTypeIn(
      List<SignatureType> signatureTypes) {
    return (root, query, criteriaBuilder) ->
        signatureTypes == null || signatureTypes.isEmpty()
            ? null
            : root.get("signatureType").in(signatureTypes);
  }

  public static Specification<DigitalSignatureEntity> isClientSignature() {
    return hasSignatureTypeIn(List.of(SignatureType.CLIENT_HANDOVER, SignatureType.CLIENT_PICKUP));
  }

  public static Specification<DigitalSignatureEntity> isOperatorSignature() {
    return hasSignatureType(SignatureType.OPERATOR);
  }

  public static Specification<DigitalSignatureEntity> isDigitalSignature() {
    return hasSignatureType(SignatureType.DIGITAL);
  }

  public static Specification<DigitalSignatureEntity> isHandwrittenSignature() {
    return hasSignatureTypeIn(
        List.of(
            SignatureType.CLIENT_HANDOVER, SignatureType.CLIENT_PICKUP, SignatureType.OPERATOR));
  }

  // Receipt relationship specifications
  public static Specification<DigitalSignatureEntity> hasReceiptId(Long receiptId) {
    return (root, query, criteriaBuilder) ->
        receiptId == null ? null : criteriaBuilder.equal(root.get("receipt").get("id"), receiptId);
  }

  // Signer specifications
  public static Specification<DigitalSignatureEntity> hasSignedBy(String signedBy) {
    return (root, query, criteriaBuilder) ->
        signedBy == null ? null : criteriaBuilder.equal(root.get("signedBy"), signedBy);
  }

  public static Specification<DigitalSignatureEntity> signedByContains(String signedBy) {
    return (root, query, criteriaBuilder) ->
        signedBy == null
            ? null
            : criteriaBuilder.like(
                criteriaBuilder.lower(root.get("signedBy")), "%" + signedBy.toLowerCase() + "%");
  }

  // Time-based specifications
  public static Specification<DigitalSignatureEntity> signedAfter(LocalDateTime dateTime) {
    return (root, query, criteriaBuilder) ->
        dateTime == null
            ? null
            : criteriaBuilder.greaterThanOrEqualTo(root.get("signedAt"), dateTime);
  }

  public static Specification<DigitalSignatureEntity> signedBefore(LocalDateTime dateTime) {
    return (root, query, criteriaBuilder) ->
        dateTime == null ? null : criteriaBuilder.lessThan(root.get("signedAt"), dateTime);
  }

  public static Specification<DigitalSignatureEntity> signedBetween(
      LocalDateTime from, LocalDateTime to) {
    return (root, query, criteriaBuilder) -> {
      if (from == null && to == null) return null;
      if (from == null) return criteriaBuilder.lessThanOrEqualTo(root.get("signedAt"), to);
      if (to == null) return criteriaBuilder.greaterThanOrEqualTo(root.get("signedAt"), from);
      return criteriaBuilder.between(root.get("signedAt"), from, to);
    };
  }

  public static Specification<DigitalSignatureEntity> signedToday() {
    LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
    LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
    return signedBetween(startOfDay, endOfDay);
  }

  // Validity specifications
  public static Specification<DigitalSignatureEntity> isValid() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("isValid"), true);
  }

  public static Specification<DigitalSignatureEntity> isInvalid() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("isValid"), false);
  }

  public static Specification<DigitalSignatureEntity> validUntilAfter(LocalDateTime dateTime) {
    return (root, query, criteriaBuilder) ->
        dateTime == null ? null : criteriaBuilder.greaterThan(root.get("validUntil"), dateTime);
  }

  public static Specification<DigitalSignatureEntity> validUntilBefore(LocalDateTime dateTime) {
    return (root, query, criteriaBuilder) ->
        dateTime == null
            ? null
            : criteriaBuilder.lessThanOrEqualTo(root.get("validUntil"), dateTime);
  }

  public static Specification<DigitalSignatureEntity> isExpired() {
    return validUntilBefore(LocalDateTime.now());
  }

  public static Specification<DigitalSignatureEntity> isNotExpired() {
    return validUntilAfter(LocalDateTime.now());
  }

  // Data specifications
  public static Specification<DigitalSignatureEntity> hasSignatureData() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.and(
            criteriaBuilder.isNotNull(root.get("signatureData")),
            criteriaBuilder.greaterThan(criteriaBuilder.length(root.get("signatureData")), 0));
  }

  public static Specification<DigitalSignatureEntity> hasNoSignatureData() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.or(
            criteriaBuilder.isNull(root.get("signatureData")),
            criteriaBuilder.equal(criteriaBuilder.length(root.get("signatureData")), 0));
  }

  // IP address specifications
  public static Specification<DigitalSignatureEntity> hasIpAddress(String ipAddress) {
    return (root, query, criteriaBuilder) ->
        ipAddress == null ? null : criteriaBuilder.equal(root.get("ipAddress"), ipAddress);
  }

  public static Specification<DigitalSignatureEntity> ipAddressStartsWith(String prefix) {
    return (root, query, criteriaBuilder) ->
        prefix == null ? null : criteriaBuilder.like(root.get("ipAddress"), prefix + "%");
  }

  // Business logic specifications
  public static Specification<DigitalSignatureEntity> isValidAndNotExpired() {
    return Specification.where(isValid()).and(isNotExpired());
  }

  public static Specification<DigitalSignatureEntity> requiresPhysicalPresence() {
    return hasSignatureTypeIn(
        List.of(
            SignatureType.CLIENT_HANDOVER, SignatureType.CLIENT_PICKUP, SignatureType.OPERATOR));
  }

  public static Specification<DigitalSignatureEntity> isDigitalOnly() {
    return hasSignatureType(SignatureType.DIGITAL);
  }

  public static Specification<DigitalSignatureEntity> isTransactionRelated() {
    return hasSignatureTypeIn(List.of(SignatureType.CLIENT_HANDOVER, SignatureType.CLIENT_PICKUP));
  }

  public static Specification<DigitalSignatureEntity> readyForValidation() {
    return Specification.where(hasSignatureData()).and(isValid());
  }

  public static Specification<DigitalSignatureEntity> requiresCleanup() {
    return Specification.where(isInvalid())
        .or(isExpired())
        .and(signedBefore(LocalDateTime.now().minusDays(30))); // старші 30 днів
  }

  // Complex search specification
  public static Specification<DigitalSignatureEntity> searchSignatures(
      SignatureType signatureType,
      String signedBy,
      Boolean isValid,
      LocalDateTime from,
      LocalDateTime to) {
    return Specification.where(hasSignatureType(signatureType))
        .and(signedByContains(signedBy))
        .and(isValid != null ? (isValid ? isValid() : isInvalid()) : null)
        .and(signedBetween(from, to));
  }

  // Audit specifications
  public static Specification<DigitalSignatureEntity> auditQuery(
      String operator, LocalDateTime from, LocalDateTime to) {
    return Specification.where(signedByContains(operator))
        .and(signedBetween(from, to))
        .and(isValidAndNotExpired());
  }
}
