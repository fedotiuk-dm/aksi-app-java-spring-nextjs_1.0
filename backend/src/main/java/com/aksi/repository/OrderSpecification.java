package com.aksi.repository;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.aksi.domain.order.OrderEntity;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

/** Specifications for Order entity queries */
public class OrderSpecification {

  private OrderSpecification() {}

  /** Filter by customer ID */
  public static Specification<OrderEntity> hasCustomerId(UUID customerId) {
    return (root, query, cb) -> {
      if (customerId == null) {
        return cb.conjunction();
      }
      return cb.equal(root.get("customer").get("id"), customerId);
    };
  }

  /** Filter by branch ID */
  public static Specification<OrderEntity> hasBranchId(UUID branchId) {
    return (root, query, cb) -> {
      if (branchId == null) {
        return cb.conjunction();
      }
      return cb.equal(root.get("branch").get("id"), branchId);
    };
  }

  /** Filter by order status */
  public static Specification<OrderEntity> hasStatus(OrderEntity.OrderStatus status) {
    return (root, query, cb) -> {
      if (status == null) {
        return cb.conjunction();
      }
      return cb.equal(root.get("status"), status);
    };
  }

  /** Filter by order number (exact match) */
  public static Specification<OrderEntity> hasOrderNumber(String orderNumber) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(orderNumber)) {
        return cb.conjunction();
      }
      return cb.equal(root.get("orderNumber"), orderNumber);
    };
  }

  /** Search by order number pattern */
  public static Specification<OrderEntity> searchByOrderNumber(String orderNumber) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(orderNumber)) {
        return cb.conjunction();
      }
      String pattern = "%" + orderNumber.toLowerCase() + "%";
      return cb.like(cb.lower(root.get("orderNumber")), pattern);
    };
  }

  /** Filter by customer name or phone */
  public static Specification<OrderEntity> searchByCustomer(String customerSearch) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(customerSearch)) {
        return cb.conjunction();
      }

      Join<Object, Object> customer = root.join("customer", JoinType.INNER);
      String pattern = "%" + customerSearch.toLowerCase() + "%";

      return cb.or(
          cb.like(cb.lower(customer.get("firstName")), pattern),
          cb.like(cb.lower(customer.get("lastName")), pattern),
          cb.like(customer.get("phonePrimary"), pattern),
          cb.like(cb.lower(customer.get("email")), pattern));
    };
  }

  /** Filter by unique label (QR code) */
  public static Specification<OrderEntity> hasUniqueLabel(String uniqueLabel) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(uniqueLabel)) {
        return cb.conjunction();
      }
      return cb.equal(root.get("uniqueLabel"), uniqueLabel);
    };
  }

  /** Filter by creation date from */
  public static Specification<OrderEntity> createdFrom(Instant dateFrom) {
    return (root, query, cb) -> {
      if (dateFrom == null) {
        return cb.conjunction();
      }
      return cb.greaterThanOrEqualTo(root.get("createdAt"), dateFrom);
    };
  }

  /** Filter by creation date to */
  public static Specification<OrderEntity> createdTo(Instant dateTo) {
    return (root, query, cb) -> {
      if (dateTo == null) {
        return cb.conjunction();
      }
      return cb.lessThan(root.get("createdAt"), dateTo);
    };
  }

  /** Filter by expected completion date from */
  public static Specification<OrderEntity> expectedCompletionFrom(Instant dateFrom) {
    return (root, query, cb) -> {
      if (dateFrom == null) {
        return cb.conjunction();
      }
      return cb.greaterThanOrEqualTo(root.get("expectedCompletionDate"), dateFrom);
    };
  }

  /** Filter by expected completion date to */
  public static Specification<OrderEntity> expectedCompletionTo(Instant dateTo) {
    return (root, query, cb) -> {
      if (dateTo == null) {
        return cb.conjunction();
      }
      return cb.lessThan(root.get("expectedCompletionDate"), dateTo);
    };
  }

  /** Filter orders with balance due */
  public static Specification<OrderEntity> hasBalanceDue() {
    return (root, query, cb) -> {
      // Orders where totalAmount > sum of payments
      assert query != null;
      var paymentsSubquery = query.subquery(Long.class);
      var paymentsRoot = paymentsSubquery.from(root.getJavaType());
      var paymentsJoin = paymentsRoot.join("payments", JoinType.LEFT);

      paymentsSubquery
          .select(cb.coalesce(cb.sum(paymentsJoin.get("amount")), 0L))
          .where(cb.equal(paymentsRoot.get("id"), root.get("id")));

      return cb.greaterThan(root.get("totalAmount"), paymentsSubquery);
    };
  }

  /** Filter overdue orders */
  public static Specification<OrderEntity> isOverdue(Instant now) {
    return (root, query, cb) -> {
      Instant effectiveNow = now != null ? now : Instant.now();
      return cb.and(
          cb.lessThan(root.get("expectedCompletionDate"), effectiveNow),
          root.get("status")
              .in(OrderEntity.OrderStatus.ACCEPTED, OrderEntity.OrderStatus.IN_PROGRESS));
    };
  }

  /** Filter completed orders */
  public static Specification<OrderEntity> isCompleted() {
    return (root, query, cb) -> cb.equal(root.get("status"), OrderEntity.OrderStatus.COMPLETED);
  }

  /** Filter active orders (not completed or cancelled) */
  public static Specification<OrderEntity> isActive() {
    return (root, query, cb) ->
        cb.not(
            root.get("status")
                .in(OrderEntity.OrderStatus.COMPLETED, OrderEntity.OrderStatus.CANCELLED));
  }

  /** General text search (order number, customer name, phone, unique label) */
  public static Specification<OrderEntity> searchByText(String search) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(search)) {
        return cb.conjunction();
      }

      Join<Object, Object> customer = root.join("customer", JoinType.INNER);
      String pattern = "%" + search.toLowerCase() + "%";

      return cb.or(
          cb.like(cb.lower(root.get("orderNumber")), pattern),
          cb.like(cb.lower(root.get("uniqueLabel")), pattern),
          cb.like(cb.lower(customer.get("firstName")), pattern),
          cb.like(cb.lower(customer.get("lastName")), pattern),
          cb.like(customer.get("phonePrimary"), pattern));
    };
  }

  /** Combine all search criteria for order listing */
  public static Specification<OrderEntity> searchOrders(
      UUID customerId,
      UUID branchId,
      OrderEntity.OrderStatus status,
      Instant dateFrom,
      Instant dateTo,
      String search) {

    return Specification.allOf(
        hasCustomerId(customerId),
        hasBranchId(branchId),
        hasStatus(status),
        createdFrom(dateFrom),
        createdTo(dateTo),
        searchByText(search));
  }
}
