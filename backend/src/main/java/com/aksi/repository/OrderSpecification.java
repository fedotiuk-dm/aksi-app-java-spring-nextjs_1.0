package com.aksi.repository;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.aksi.domain.order.OrderEntity;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

/** Specifications for Order entity queries - only used methods */
public class OrderSpecification {

  private OrderSpecification() {}

  /** Filter by customer ID */
  public static Specification<OrderEntity> hasCustomerId(UUID customerId) {
    return (root, query, cb) -> {
      if (customerId == null) {
        return cb.conjunction();
      }
      return cb.equal(root.get("customerEntity").get("id"), customerId);
    };
  }

  /** Filter by branch ID */
  public static Specification<OrderEntity> hasBranchId(UUID branchId) {
    return (root, query, cb) -> {
      if (branchId == null) {
        return cb.conjunction();
      }
      return cb.equal(root.get("branchEntity").get("id"), branchId);
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

  /** General text search (order number, customer name, phone, unique label) */
  public static Specification<OrderEntity> searchByText(String search) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(search)) {
        return cb.conjunction();
      }

      Join<Object, Object> customer = root.join("customerEntity", JoinType.INNER);
      String pattern = "%" + search.toLowerCase() + "%";

      return cb.or(
          cb.like(cb.lower(root.get("orderNumber")), pattern),
          cb.like(cb.lower(root.get("uniqueLabel")), pattern),
          cb.like(cb.lower(customer.get("firstName")), pattern),
          cb.like(cb.lower(customer.get("lastName")), pattern),
          cb.like(customer.get("phonePrimary"), pattern));
    };
  }

  /** Filter orders due for completion */
  public static Specification<OrderEntity> isDueForCompletion(Instant date) {
    return (root, query, cb) -> {
      Instant effectiveDate = date != null ? date : Instant.now();
      return cb.and(
          cb.lessThanOrEqualTo(root.get("expectedCompletionDate"), effectiveDate),
          root.get("status")
              .in(OrderEntity.OrderStatus.ACCEPTED, OrderEntity.OrderStatus.IN_PROGRESS));
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
