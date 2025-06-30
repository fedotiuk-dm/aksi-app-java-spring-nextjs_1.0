package com.aksi.domain.order.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.enums.OrderStatus;

/** Repository для роботи з замовленнями */
@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {

  /** Знаходить замовлення за номером квитанції */
  Optional<OrderEntity> findByReceiptNumber(String receiptNumber);

  /** Перевіряє чи існує замовлення з таким номером квитанції */
  boolean existsByReceiptNumber(String receiptNumber);

  /** Знаходить замовлення за унікальною міткою */
  Optional<OrderEntity> findByUniqueTag(String uniqueTag);

  /** Перевіряє чи існує замовлення з такою унікальною міткою */
  boolean existsByUniqueTag(String uniqueTag);

  /** Знаходить замовлення клієнта */
  Page<OrderEntity> findByClientId(UUID clientId, Pageable pageable);

  /** Знаходить замовлення філії */
  Page<OrderEntity> findByBranchId(UUID branchId, Pageable pageable);

  /** Знаходить замовлення за статусом */
  Page<OrderEntity> findByStatus(OrderStatus status, Pageable pageable);

  /** Знаходить замовлення клієнта за статусом */
  Page<OrderEntity> findByClientIdAndStatus(UUID clientId, OrderStatus status, Pageable pageable);

  /** Знаходить активні замовлення клієнта (DRAFT, NEW, IN_PROGRESS) */
  @Query("SELECT o FROM OrderEntity o WHERE o.clientId = :clientId AND o.status IN (:statuses)")
  List<OrderEntity> findActiveOrdersByClientId(
      @Param("clientId") UUID clientId, @Param("statuses") List<OrderStatus> statuses);

  /** Знаходить замовлення за періодом створення */
  @Query("SELECT o FROM OrderEntity o WHERE o.createdAt BETWEEN :startDate AND :endDate")
  Page<OrderEntity> findByCreatedAtBetween(
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate,
      Pageable pageable);

  /** Знаходить прострочені замовлення (execution_date < now() AND status != COMPLETED) */
  @Query(
      "SELECT o FROM OrderEntity o WHERE o.executionDate < :currentDate AND o.status != :completedStatus")
  List<OrderEntity> findOverdueOrders(
      @Param("currentDate") LocalDateTime currentDate,
      @Param("completedStatus") OrderStatus completedStatus);

  /** Знаходить термінові замовлення що потребують уваги */
  @Query(
      "SELECT o FROM OrderEntity o WHERE o.urgency IN (:urgentTypes) AND o.status IN (:activeStatuses)")
  List<OrderEntity> findUrgentOrders(
      @Param("urgentTypes") List<String> urgentTypes,
      @Param("activeStatuses") List<OrderStatus> activeStatuses);

  /** Пошук замовлень за різними критеріями */
  @Query(
      "SELECT o FROM OrderEntity o WHERE "
          + "(:receiptNumber IS NULL OR o.receiptNumber LIKE %:receiptNumber%) AND "
          + "(:uniqueTag IS NULL OR o.uniqueTag LIKE %:uniqueTag%) AND "
          + "(:clientId IS NULL OR o.clientId = :clientId) AND "
          + "(:branchId IS NULL OR o.branchId = :branchId) AND "
          + "(:status IS NULL OR o.status = :status)")
  Page<OrderEntity> searchOrders(
      @Param("receiptNumber") String receiptNumber,
      @Param("uniqueTag") String uniqueTag,
      @Param("clientId") UUID clientId,
      @Param("branchId") UUID branchId,
      @Param("status") OrderStatus status,
      Pageable pageable);

  /** Рахує кількість замовлень за статусом */
  long countByStatus(OrderStatus status);

  /** Рахує кількість замовлень клієнта */
  long countByClientId(UUID clientId);

  /** Рахує кількість замовлень філії за період */
  @Query(
      "SELECT COUNT(o) FROM OrderEntity o WHERE o.branchId = :branchId AND o.createdAt BETWEEN :startDate AND :endDate")
  long countByBranchIdAndPeriod(
      @Param("branchId") UUID branchId,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);

  /** Знаходить топ клієнтів за кількістю замовлень */
  @Query(
      "SELECT o.clientId, COUNT(o) as orderCount FROM OrderEntity o "
          + "WHERE o.createdAt BETWEEN :startDate AND :endDate "
          + "GROUP BY o.clientId ORDER BY orderCount DESC")
  List<Object[]> findTopClientsByOrderCount(
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate,
      Pageable pageable);

  /** Знаходить замовлення що потребують підпису клієнта */
  @Query("SELECT o FROM OrderEntity o WHERE o.status = :readyStatus AND o.clientSignature IS NULL")
  List<OrderEntity> findOrdersRequiringSignature(@Param("readyStatus") OrderStatus readyStatus);

  /** Знаходить замовлення з критичними дефектами предметів */
  @Query(
      "SELECT DISTINCT o FROM OrderEntity o JOIN o.items i JOIN i.defects d "
          + "WHERE d IN (:criticalDefects) AND o.status IN (:activeStatuses)")
  List<OrderEntity> findOrdersWithCriticalDefects(
      @Param("criticalDefects") List<String> criticalDefects,
      @Param("activeStatuses") List<OrderStatus> activeStatuses);

  /** Знаходить замовлення за діапазоном сум */
  @Query(
      "SELECT o FROM OrderEntity o WHERE o.calculation.totalAmount BETWEEN :minAmount AND :maxAmount")
  Page<OrderEntity> findByTotalAmountBetween(
      @Param("minAmount") java.math.BigDecimal minAmount,
      @Param("maxAmount") java.math.BigDecimal maxAmount,
      Pageable pageable);

  /** Отримує статистику замовлень за період */
  @Query(
      "SELECT o.status, COUNT(o), SUM(o.calculation.totalAmount) FROM OrderEntity o "
          + "WHERE o.createdAt BETWEEN :startDate AND :endDate "
          + "GROUP BY o.status")
  List<Object[]> getOrderStatistics(
      @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
