package com.aksi.domain.document.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.document.entity.DocumentEntity;
import com.aksi.domain.document.enums.DocumentStatus;
import com.aksi.domain.document.enums.DocumentType;

/** Repository для роботи з документами з JPA Specification підтримкою. */
@Repository
public interface DocumentRepository
    extends JpaRepository<DocumentEntity, Long>, JpaSpecificationExecutor<DocumentEntity> {

  // Basic finders
  Optional<DocumentEntity> findByDocumentNumber(String documentNumber);

  List<DocumentEntity> findByType(DocumentType type);

  List<DocumentEntity> findByStatus(DocumentStatus status);

  List<DocumentEntity> findByRelatedEntityId(UUID relatedEntityId);

  List<DocumentEntity> findByCreatedBy(String createdBy);

  // Exists checks
  boolean existsByDocumentNumber(String documentNumber);

  boolean existsByRelatedEntityId(UUID relatedEntityId);

  // Type-specific queries
  List<DocumentEntity> findByTypeAndStatus(DocumentType type, DocumentStatus status);

  List<DocumentEntity> findByTypeAndRelatedEntityId(DocumentType type, UUID relatedEntityId);

  // Pagination queries
  Page<DocumentEntity> findByType(DocumentType type, Pageable pageable);

  Page<DocumentEntity> findByStatus(DocumentStatus status, Pageable pageable);

  Page<DocumentEntity> findByRelatedEntityId(UUID relatedEntityId, Pageable pageable);

  Page<DocumentEntity> findByCreatedBy(String createdBy, Pageable pageable);

  // Count queries
  long countByType(DocumentType type);

  long countByStatus(DocumentStatus status);

  long countByTypeAndStatus(DocumentType type, DocumentStatus status);

  @Query(
      "SELECT COUNT(d) FROM DocumentEntity d WHERE d.type = :type AND d.createdAt >= :from AND d.createdAt <= :to")
  long countByTypeAndCreatedAtBetween(
      @Param("type") DocumentType type,
      @Param("from") LocalDateTime from,
      @Param("to") LocalDateTime to);

  // Maintenance queries
  @Modifying
  @Query("DELETE FROM DocumentEntity d WHERE d.status = 'DRAFT' AND d.createdAt < :cleanupDate")
  void deleteDraftDocumentsOlderThan(@Param("cleanupDate") LocalDateTime cleanupDate);
}
