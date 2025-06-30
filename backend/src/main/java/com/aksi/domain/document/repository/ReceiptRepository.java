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

import com.aksi.domain.document.entity.ReceiptEntity;

/** Repository для роботи з квитанціями з JPA Specification підтримкою. */
@Repository
public interface ReceiptRepository
    extends JpaRepository<ReceiptEntity, Long>, JpaSpecificationExecutor<ReceiptEntity> {

  // Basic finders
  Optional<ReceiptEntity> findByReceiptNumber(String receiptNumber);

  Optional<ReceiptEntity> findByOrderId(UUID orderId);

  List<ReceiptEntity> findByGeneratedBy(String generatedBy);

  List<ReceiptEntity> findByQrCodeId(UUID qrCodeId);

  // Exists checks
  boolean existsByReceiptNumber(String receiptNumber);

  boolean existsByOrderId(UUID orderId);

  // Print status queries
  List<ReceiptEntity> findByIsPrinted(Boolean isPrinted);

  @Query(
      "SELECT r FROM ReceiptEntity r WHERE r.isPrinted = true AND r.printedAt >= :from AND r.printedAt <= :to")
  List<ReceiptEntity> findPrintedBetween(
      @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

  @Query("SELECT r FROM ReceiptEntity r WHERE r.isPrinted = false AND r.pdfDocument IS NOT NULL")
  List<ReceiptEntity> findReadyForPrinting();

  // Signature-related queries
  @Query("SELECT r FROM ReceiptEntity r WHERE SIZE(r.signatures) > 0")
  List<ReceiptEntity> findWithSignatures();

  @Query("SELECT r FROM ReceiptEntity r WHERE SIZE(r.signatures) = 0")
  List<ReceiptEntity> findWithoutSignatures();

  @Query("SELECT r FROM ReceiptEntity r JOIN r.signatures s WHERE s.type = 'CLIENT_HANDOVER'")
  List<ReceiptEntity> findWithClientHandoverSignature();

  @Query("SELECT r FROM ReceiptEntity r JOIN r.signatures s WHERE s.type = 'CLIENT_PICKUP'")
  List<ReceiptEntity> findWithClientPickupSignature();

  @Query("SELECT r FROM ReceiptEntity r JOIN r.signatures s WHERE s.type = 'OPERATOR'")
  List<ReceiptEntity> findWithOperatorSignature();

  // PDF document queries
  @Query("SELECT r FROM ReceiptEntity r WHERE r.pdfDocument IS NOT NULL")
  List<ReceiptEntity> findWithPdfDocument();

  @Query("SELECT r FROM ReceiptEntity r WHERE r.pdfDocument IS NULL")
  List<ReceiptEntity> findWithoutPdfDocument();

  // QR code queries
  @Query("SELECT r FROM ReceiptEntity r WHERE r.qrCodeId IS NOT NULL")
  List<ReceiptEntity> findWithQrCode();

  @Query("SELECT r FROM ReceiptEntity r WHERE r.qrCodeId IS NULL")
  List<ReceiptEntity> findWithoutQrCode();

  // Business logic queries
  @Query("SELECT r FROM ReceiptEntity r WHERE r.isPrinted = true AND SIZE(r.signatures) >= 2")
  List<ReceiptEntity> findReadyForArchiving();

  @Query("SELECT r FROM ReceiptEntity r WHERE r.pdfDocument IS NOT NULL AND SIZE(r.signatures) > 0")
  List<ReceiptEntity> findReadyForDelivery();

  @Query(
      "SELECT r FROM ReceiptEntity r JOIN r.signatures s WHERE s.type IN ('CLIENT_HANDOVER', 'CLIENT_PICKUP') "
          + "GROUP BY r HAVING COUNT(DISTINCT s.type) = 2")
  List<ReceiptEntity> findFullySignedByClient();

  // Generation tracking
  @Query("SELECT r FROM ReceiptEntity r WHERE r.generatedAt >= :from AND r.generatedAt <= :to")
  List<ReceiptEntity> findGeneratedBetween(
      @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

  @Query(
      "SELECT r FROM ReceiptEntity r WHERE r.generatedBy = :generatedBy AND r.generatedAt >= :from")
  List<ReceiptEntity> findGeneratedByUserSince(
      @Param("generatedBy") String generatedBy, @Param("from") LocalDateTime from);

  // Pagination queries
  Page<ReceiptEntity> findByIsPrinted(Boolean isPrinted, Pageable pageable);

  Page<ReceiptEntity> findByGeneratedBy(String generatedBy, Pageable pageable);

  @Query("SELECT r FROM ReceiptEntity r WHERE r.generatedAt >= :from AND r.generatedAt <= :to")
  Page<ReceiptEntity> findGeneratedBetween(
      @Param("from") LocalDateTime from, @Param("to") LocalDateTime to, Pageable pageable);

  // Count queries
  long countByIsPrinted(Boolean isPrinted);

  long countByGeneratedBy(String generatedBy);

  @Query(
      "SELECT COUNT(r) FROM ReceiptEntity r WHERE r.generatedAt >= :from AND r.generatedAt <= :to")
  long countGeneratedBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

  @Query("SELECT COUNT(r) FROM ReceiptEntity r WHERE SIZE(r.signatures) > 0")
  long countWithSignatures();

  // Advanced search
  @Query(
      "SELECT r FROM ReceiptEntity r WHERE "
          + "(:receiptNumber IS NULL OR r.receiptNumber LIKE CONCAT('%', :receiptNumber, '%')) AND "
          + "(:orderId IS NULL OR r.orderId = :orderId) AND "
          + "(:isPrinted IS NULL OR r.isPrinted = :isPrinted) AND "
          + "(:generatedBy IS NULL OR r.generatedBy LIKE CONCAT('%', :generatedBy, '%'))")
  Page<ReceiptEntity> searchReceipts(
      @Param("receiptNumber") String receiptNumber,
      @Param("orderId") UUID orderId,
      @Param("isPrinted") Boolean isPrinted,
      @Param("generatedBy") String generatedBy,
      Pageable pageable);

  // Maintenance queries
  @Modifying
  @Query("DELETE FROM ReceiptEntity r WHERE r.printedAt IS NULL AND r.createdAt < :cleanupDate")
  void deleteUnprintedReceiptsOlderThan(@Param("cleanupDate") LocalDateTime cleanupDate);
}
