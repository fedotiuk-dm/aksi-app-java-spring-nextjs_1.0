package com.aksi.repository.order;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.Order;

/** Repository interface for Order entity */
@Repository
public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {

  /** Find order by order number */
  Optional<Order> findByOrderNumber(String orderNumber);

  /** Find orders by customer ID */
  Page<Order> findByCustomerIdOrderByCreatedAtDesc(UUID customerId, Pageable pageable);

  /** Find orders by branch ID */
  Page<Order> findByBranchIdOrderByCreatedAtDesc(UUID branchId, Pageable pageable);

  /** Find orders by status */
  Page<Order> findByStatusOrderByCreatedAtDesc(Order.OrderStatus status, Pageable pageable);

  /** Find orders with balance due */
  @Query("SELECT o FROM Order o WHERE o.totalAmount > " +
         "(SELECT COALESCE(SUM(p.amount), 0) FROM OrderPayment p WHERE p.order = o)")
  List<Order> findOrdersWithBalanceDue();

  /** Find orders due for completion */
  @Query("SELECT o FROM Order o WHERE o.expectedCompletionDate <= :date " +
         "AND o.status IN ('ACCEPTED', 'IN_PROGRESS')")
  List<Order> findOrdersDueForCompletion(@Param("date") Instant date);

  /** Find overdue orders */
  @Query("SELECT o FROM Order o WHERE o.expectedCompletionDate < :now " +
         "AND o.status IN ('ACCEPTED', 'IN_PROGRESS')")
  List<Order> findOverdueOrders(@Param("now") Instant now);

  /** Get count of orders by status */
  long countByStatus(Order.OrderStatus status);

  /** Get count of orders by branch and status */
  long countByBranchIdAndStatus(UUID branchId, Order.OrderStatus status);

  /** Check if order number exists */
  boolean existsByOrderNumber(String orderNumber);

  /** Find orders created between dates */
  @Query("SELECT o FROM Order o WHERE o.createdAt >= :from AND o.createdAt <= :to " +
         "ORDER BY o.createdAt DESC")
  Page<Order> findOrdersCreatedBetween(
      @Param("from") Instant from, 
      @Param("to") Instant to, 
      Pageable pageable);

  /** Find recent orders for customer */
  @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId " +
         "ORDER BY o.createdAt DESC")
  Page<Order> findRecentOrdersByCustomer(
      @Param("customerId") UUID customerId, 
      Pageable pageable);

  /** Get orders statistics for branch */
  @Query("SELECT " +
         "COUNT(*) as totalOrders, " +
         "SUM(CASE WHEN o.status = 'COMPLETED' THEN 1 ELSE 0 END) as completedOrders, " +
         "SUM(CASE WHEN o.status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelledOrders, " +
         "SUM(CASE WHEN o.expectedCompletionDate < :now AND o.status IN ('ACCEPTED', 'IN_PROGRESS') THEN 1 ELSE 0 END) as overdueOrders " +
         "FROM Order o WHERE o.branch.id = :branchId")
  Object[] getOrderStatisticsForBranch(
      @Param("branchId") UUID branchId, 
      @Param("now") Instant now);
}