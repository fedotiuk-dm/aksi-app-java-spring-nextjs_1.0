package com.aksi.service.order.util;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.UrgencyType;
import com.aksi.domain.order.OrderEntity;
import com.aksi.domain.order.OrderPaymentEntity;

/** Utility service for order query operations Centralizes common query logic and transformations */
@Component
public class OrderQueryUtils {

  private static final int DEFAULT_DAYS_DUE = 7;
  private static final String DEFAULT_SORT_FIELD = "createdAt";

  /**
   * Build pageable from request parameters
   *
   * @param page page number
   * @param size page size
   * @param sortBy sort field
   * @param sortOrder sort direction
   * @return pageable instance
   */
  public Pageable buildPageable(Integer page, Integer size, String sortBy, String sortOrder) {
    Sort.Direction direction = parseSortDirection(sortOrder);
    String sortField = sortBy != null ? sortBy : DEFAULT_SORT_FIELD;
    return PageRequest.of(page, size, Sort.by(direction, sortField));
  }

  /**
   * Build pageable with custom default sort field
   *
   * @param page page number
   * @param size page size
   * @param sortBy sort field
   * @param sortOrder sort direction
   * @param defaultSortField default sort field if not provided
   * @return pageable instance
   */
  public Pageable buildPageable(
      Integer page, Integer size, String sortBy, String sortOrder, String defaultSortField) {
    Sort.Direction direction = parseSortDirection(sortOrder);
    String sortField = sortBy != null ? sortBy : defaultSortField;
    return PageRequest.of(page, size, Sort.by(direction, sortField));
  }

  /**
   * Calculate target date for due orders
   *
   * @param days days from now
   * @return target instant
   */
  public Instant calculateDueDate(Integer days) {
    int daysValue = days != null ? days : DEFAULT_DAYS_DUE;
    return Instant.now().plus(daysValue, ChronoUnit.DAYS);
  }

  /**
   * Parse sort direction from string
   *
   * @param sortOrder sort order string
   * @return sort direction
   */
  private Sort.Direction parseSortDirection(String sortOrder) {
    return "asc".equalsIgnoreCase(sortOrder) ? Sort.Direction.ASC : Sort.Direction.DESC;
  }

  /**
   * Calculate expected completion date based on urgency type
   *
   * @param urgencyType urgency type
   * @param defaultHours default completion hours
   * @return expected completion instant
   */
  public Instant calculateCompletionDate(UrgencyType urgencyType, int defaultHours) {
    if (urgencyType == null) {
      return Instant.now().plus(defaultHours, ChronoUnit.HOURS);
    }

    return switch (urgencyType) {
      case EXPRESS_24_H -> Instant.now().plus(24, ChronoUnit.HOURS);
      case EXPRESS_48_H -> Instant.now().plus(48, ChronoUnit.HOURS);
      case NORMAL -> Instant.now().plus(defaultHours, ChronoUnit.HOURS);
    };
  }

  /**
   * Calculate total paid amount for order
   *
   * @param order order entity
   * @return total paid amount
   */
  public Integer calculatePaidAmount(OrderEntity order) {
    return order.getPayments().stream().mapToInt(OrderPaymentEntity::getAmount).sum();
  }

  /**
   * Calculate balance due for order
   *
   * @param order order entity
   * @return balance due amount
   */
  public Integer calculateBalanceDue(OrderEntity order) {
    return order.getTotalAmount() - calculatePaidAmount(order);
  }
}
