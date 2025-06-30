package com.aksi.domain.document.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.document.entity.DocumentEntity;
import com.aksi.domain.document.enums.DocumentStatus;
import com.aksi.domain.document.enums.DocumentType;

/**
 * JPA Specifications для DocumentEntity - type-safe dynamic queries
 */
public class DocumentSpecification {

    // Type specifications
    public static Specification<DocumentEntity> hasType(DocumentType type) {
        return (root, query, criteriaBuilder) ->
            type == null ? null : criteriaBuilder.equal(root.get("type"), type);
    }

    public static Specification<DocumentEntity> hasTypeIn(List<DocumentType> types) {
        return (root, query, criteriaBuilder) ->
            types == null || types.isEmpty() ? null : root.get("type").in(types);
    }

    // Status specifications
    public static Specification<DocumentEntity> hasStatus(DocumentStatus status) {
        return (root, query, criteriaBuilder) ->
            status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<DocumentEntity> hasStatusIn(List<DocumentStatus> statuses) {
        return (root, query, criteriaBuilder) ->
            statuses == null || statuses.isEmpty() ? null : root.get("status").in(statuses);
    }

    public static Specification<DocumentEntity> hasStatusNot(DocumentStatus status) {
        return (root, query, criteriaBuilder) ->
            status == null ? null : criteriaBuilder.notEqual(root.get("status"), status);
    }

    // Related entity specifications
    public static Specification<DocumentEntity> hasRelatedEntityId(UUID relatedEntityId) {
        return (root, query, criteriaBuilder) ->
            relatedEntityId == null ? null : criteriaBuilder.equal(root.get("relatedEntityId"), relatedEntityId);
    }

    // Document number specifications
    public static Specification<DocumentEntity> hasDocumentNumber(String documentNumber) {
        return (root, query, criteriaBuilder) ->
            documentNumber == null ? null : criteriaBuilder.equal(root.get("documentNumber"), documentNumber);
    }

    public static Specification<DocumentEntity> documentNumberContains(String documentNumber) {
        return (root, query, criteriaBuilder) ->
            documentNumber == null ? null :
            criteriaBuilder.like(criteriaBuilder.lower(root.get("documentNumber")),
                               "%" + documentNumber.toLowerCase() + "%");
    }

    // Creator specifications
    public static Specification<DocumentEntity> hasCreatedBy(String createdBy) {
        return (root, query, criteriaBuilder) ->
            createdBy == null ? null : criteriaBuilder.equal(root.get("createdBy"), createdBy);
    }

    public static Specification<DocumentEntity> createdByContains(String createdBy) {
        return (root, query, criteriaBuilder) ->
            createdBy == null ? null :
            criteriaBuilder.like(criteriaBuilder.lower(root.get("createdBy")),
                               "%" + createdBy.toLowerCase() + "%");
    }

    // Time-based specifications
    public static Specification<DocumentEntity> createdAfter(LocalDateTime dateTime) {
        return (root, query, criteriaBuilder) ->
            dateTime == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), dateTime);
    }

    public static Specification<DocumentEntity> createdBefore(LocalDateTime dateTime) {
        return (root, query, criteriaBuilder) ->
            dateTime == null ? null : criteriaBuilder.lessThan(root.get("createdAt"), dateTime);
    }

    public static Specification<DocumentEntity> createdBetween(LocalDateTime from, LocalDateTime to) {
        return (root, query, criteriaBuilder) -> {
            if (from == null && to == null) return null;
            if (from == null) return criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), to);
            if (to == null) return criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), from);
            return criteriaBuilder.between(root.get("createdAt"), from, to);
        };
    }

    // File-related specifications
    public static Specification<DocumentEntity> hasFile() {
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.and(
                criteriaBuilder.isNotNull(root.get("filePath")),
                criteriaBuilder.notEqual(root.get("filePath"), ""),
                criteriaBuilder.isNotNull(root.get("fileSize")),
                criteriaBuilder.greaterThan(root.get("fileSize"), 0L)
            );
    }

    public static Specification<DocumentEntity> hasNoFile() {
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.or(
                criteriaBuilder.isNull(root.get("filePath")),
                criteriaBuilder.equal(root.get("filePath"), ""),
                criteriaBuilder.isNull(root.get("fileSize")),
                criteriaBuilder.equal(root.get("fileSize"), 0L)
            );
    }

    public static Specification<DocumentEntity> hasFileSize(Long minSize, Long maxSize) {
        return (root, query, criteriaBuilder) -> {
            if (minSize == null && maxSize == null) return null;
            if (minSize == null) return criteriaBuilder.lessThanOrEqualTo(root.get("fileSize"), maxSize);
            if (maxSize == null) return criteriaBuilder.greaterThanOrEqualTo(root.get("fileSize"), minSize);
            return criteriaBuilder.between(root.get("fileSize"), minSize, maxSize);
        };
    }

    public static Specification<DocumentEntity> hasMimeType(String mimeType) {
        return (root, query, criteriaBuilder) ->
            mimeType == null ? null : criteriaBuilder.equal(root.get("mimeType"), mimeType);
    }

    public static Specification<DocumentEntity> mimeTypeStartsWith(String prefix) {
        return (root, query, criteriaBuilder) ->
            prefix == null ? null :
            criteriaBuilder.like(root.get("mimeType"), prefix + "%");
    }

    // Business logic specifications
    public static Specification<DocumentEntity> isReceiptType() {
        return hasType(DocumentType.RECEIPT);
    }

    public static Specification<DocumentEntity> isFinancialDocument() {
        return hasTypeIn(List.of(DocumentType.RECEIPT, DocumentType.INVOICE));
    }

    public static Specification<DocumentEntity> isLegalDocument() {
        return hasTypeIn(List.of(DocumentType.CONTRACT, DocumentType.RECEIPT));
    }

    public static Specification<DocumentEntity> isCompleted() {
        return hasStatusIn(List.of(DocumentStatus.SIGNED, DocumentStatus.PRINTED, DocumentStatus.ARCHIVED));
    }

    public static Specification<DocumentEntity> canBeModified() {
        return hasStatusIn(List.of(DocumentStatus.DRAFT, DocumentStatus.GENERATED));
    }

    public static Specification<DocumentEntity> readyForArchiving() {
        return Specification.where(hasStatus(DocumentStatus.PRINTED))
            .and(updatedBefore(LocalDateTime.now().minusDays(30))); // 30 днів після друку
    }

    public static Specification<DocumentEntity> updatedBefore(LocalDateTime dateTime) {
        return (root, query, criteriaBuilder) ->
            dateTime == null ? null : criteriaBuilder.lessThan(root.get("updatedAt"), dateTime);
    }

    // Complex search specification
    public static Specification<DocumentEntity> searchDocuments(String documentNumber,
                                                              DocumentType type,
                                                              DocumentStatus status,
                                                              String createdBy) {
        return Specification.where(documentNumberContains(documentNumber))
            .and(hasType(type))
            .and(hasStatus(status))
            .and(createdByContains(createdBy));
    }
}
