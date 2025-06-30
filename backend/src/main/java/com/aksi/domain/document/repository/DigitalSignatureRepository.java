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

import com.aksi.domain.document.entity.DigitalSignatureEntity;
import com.aksi.domain.document.entity.ReceiptEntity;
import com.aksi.domain.document.enums.SignatureType;

/** Repository для роботи з цифровими підписами з JPA Specification підтримкою */
@Repository
public interface DigitalSignatureRepository
    extends JpaRepository<DigitalSignatureEntity, Long>,
        JpaSpecificationExecutor<DigitalSignatureEntity> {

  // Basic finders
  List<DigitalSignatureEntity> findByType(SignatureType type);

  List<DigitalSignatureEntity> findByReceiptId(Long receiptId);

  List<DigitalSignatureEntity> findBySignerName(String signerName);

  Optional<DigitalSignatureEntity> findByReceiptIdAndType(Long receiptId, SignatureType type);

  Optional<DigitalSignatureEntity> findByDocumentIdAndType(UUID documentId, SignatureType type);

  Optional<DigitalSignatureEntity> findByReceiptAndType(ReceiptEntity receipt, SignatureType type);

  // Exists checks
  boolean existsByReceiptIdAndType(Long receiptId, SignatureType type);

  boolean existsBySignerName(String signerName);

  // Validity queries
  List<DigitalSignatureEntity> findByIsValid(boolean isValid);

  // Type-specific queries
  List<DigitalSignatureEntity> findByTypeAndIsValid(SignatureType type, boolean isValid);

  List<DigitalSignatureEntity> findByReceiptIdAndIsValid(Long receiptId, boolean isValid);

  // Pagination queries
  Page<DigitalSignatureEntity> findByType(SignatureType type, Pageable pageable);

  Page<DigitalSignatureEntity> findBySignerName(String signerName, Pageable pageable);

  Page<DigitalSignatureEntity> findByIsValid(boolean isValid, Pageable pageable);

  // Count queries
  long countByType(SignatureType type);

  long countBySignerName(String signerName);

  long countByIsValid(boolean isValid);

  @Query(
      "SELECT COUNT(ds) FROM DigitalSignatureEntity ds WHERE ds.type = :type AND ds.signedAt BETWEEN :from AND :to")
  long countByTypeAndSignedAtBetween(
      @Param("type") SignatureType type,
      @Param("from") LocalDateTime from,
      @Param("to") LocalDateTime to);

  // Maintenance queries
  @Modifying
  @Query(
      "DELETE FROM DigitalSignatureEntity ds WHERE ds.isValid = false AND ds.signedAt < :cleanupDate")
  void deleteInvalidSignaturesOlderThan(@Param("cleanupDate") LocalDateTime cleanupDate);
}
