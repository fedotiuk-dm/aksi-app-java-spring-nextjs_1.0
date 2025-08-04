package com.aksi.repository.order;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.aksi.domain.order.Order;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

/** Specifications for Order entity queries */
public class OrderSpecification {

  private OrderSpecification() {}

  /** Filter by customer ID */
  public static Specification<Order> hasCustomerId(UUID customerId) {
    return (root, query, cb) -> {
      if (customerId == null) {
        return cb.conjunction();
      }
      return cb.equal(root.get("customer").get("id"), customerId);
    };
  }

  /** Filter by branch ID */
  public static Specification<Order> hasBranchId(UUID branchId) {
    return (root, query, cb) -> {
      if (branchId == null) {
        return cb.conjunction();
      }
      return cb.equal(root.get("branch").get("id"), branchId);
    };
  }

  /** Filter by order status */
  public static Specification<Order> hasStatus(Order.OrderStatus status) {
    return (root, query, cb) -> {
      if (status == null) {
        return cb.conjunction();
      }
      return cb.equal(root.get("status"), status);
    };
  }

  /** Filter by order number (exact match) */
  public static Specification<Order> hasOrderNumber(String orderNumber) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(orderNumber)) {
        return cb.conjunction();
      }
      return cb.equal(root.get("orderNumber"), orderNumber);
    };
  }

  /** Search by order number pattern */
  public static Specification<Order> searchByOrderNumber(String orderNumber) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(orderNumber)) {
        return cb.conjunction();
      }
      String pattern = "%" + orderNumber.toLowerCase() + "%";
      return cb.like(cb.lower(root.get("orderNumber")), pattern);
    };
  }

  /** Filter by customer name or phone */
  public static Specification<Order> searchByCustomer(String customerSearch) {
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
          cb.like(cb.lower(customer.get("email")), pattern)
      );
    };
  }

  /** Filter by unique label (QR code) */
  public static Specification<Order> hasUniqueLabel(String uniqueLabel) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(uniqueLabel)) {
        return cb.conjunction();
      }
      return cb.equal(root.get("uniqueLabel"), uniqueLabel);
    };
  }

  /** Filter by creation date from */
  public static Specification<Order> createdFrom(LocalDate dateFrom) {
    return (root, query, cb) -> {
      if (dateFrom == null) {
        return cb.conjunction();
      }
      Instant from = dateFrom.atStartOfDay().toInstant(ZoneOffset.UTC);
      return cb.greaterThanOrEqualTo(root.get("createdAt"), from);
    };
  }

  /** Filter by creation date to */
  public static Specification<Order> createdTo(LocalDate dateTo) {
    return (root, query, cb) -> {
      if (dateTo == null) {
        return cb.conjunction();
      }
      Instant to = dateTo.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
      return cb.lessThan(root.get("createdAt"), to);
    };
  }

  /** Filter by expected completion date from */
  public static Specification<Order> expectedCompletionFrom(LocalDate dateFrom) {
    return (root, query, cb) -> {
      if (dateFrom == null) {
        return cb.conjunction();
      }
      Instant from = dateFrom.atStartOfDay().toInstant(ZoneOffset.UTC);
      return cb.greaterThanOrEqualTo(root.get("expectedCompletionDate"), from);
    };
  }

  /** Filter by expected completion date to */
  public static Specification<Order> expectedCompletionTo(LocalDate dateTo) {
    return (root, query, cb) -> {
      if (dateTo == null) {
        return cb.conjunction();
      }
      Instant to = dateTo.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
      return cb.lessThan(root.get("expectedCompletionDate"), to);
    };
  }

  /** Filter orders with balance due */
  public static Specification<Order> hasBalanceDue() {
    return (root, query, cb) -> {
      // Orders where totalAmount > sum of payments
      var paymentsSubquery = query.subquery(Long.class);
      var paymentsRoot = paymentsSubquery.from(root.getJavaType());
      var paymentsJoin = paymentsRoot.join("payments", JoinType.LEFT);
      
      paymentsSubquery.select(cb.coalesce(cb.sum(paymentsJoin.get("amount")), 0L))
                     .where(cb.equal(paymentsRoot.get("id"), root.get("id")));
      
      return cb.greaterThan(root.get("totalAmount"), paymentsSubquery);
    };
  }

  /** Filter overdue orders */
  public static Specification<Order> isOverdue(Instant now) {
    return (root, query, cb) -> {
      if (now == null) {
        now = Instant.now();
      }
      return cb.and(
          cb.lessThan(root.get("expectedCompletionDate"), now),
          root.get("status").in(Order.OrderStatus.ACCEPTED, Order.OrderStatus.IN_PROGRESS)
      );
    };
  }

  /** Filter completed orders */
  public static Specification<Order> isCompleted() {
    return (root, query, cb) -> cb.equal(root.get("status"), Order.OrderStatus.COMPLETED);
  }

  /** Filter active orders (not completed or cancelled) */
  public static Specification<Order> isActive() {
    return (root, query, cb) -> cb.not(
        root.get("status").in(Order.OrderStatus.COMPLETED, Order.OrderStatus.CANCELLED)
    );
  }

  /** General text search (order number, customer name, phone, unique label) */
  public static Specification<Order> searchByText(String search) {
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
          cb.like(customer.get("phonePrimary"), pattern)
      );
    };
  }

  /** Combine all search criteria for order listing */
  public static Specification<Order> searchOrders(
      UUID customerId, 
      UUID branchId, 
      Order.OrderStatus status,
      LocalDate dateFrom, 
      LocalDate dateTo, 
      String search) {
    
    return Specification.allOf(
        hasCustomerId(customerId),
        hasBranchId(branchId),
        hasStatus(status),
        createdFrom(dateFrom),
        createdTo(dateTo),
        searchByText(search)
    );
  }
}