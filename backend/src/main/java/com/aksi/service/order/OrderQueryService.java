package com.aksi.service.order;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.OrderListResponse;
import com.aksi.api.order.dto.OrderStatus;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.domain.order.OrderEntity;
import com.aksi.mapper.OrderMapper;
import com.aksi.repository.OrderRepository;
import com.aksi.repository.OrderSpecification;
import com.aksi.service.order.guard.OrderGuard;
import com.aksi.service.order.util.OrderQueryUtils;
import com.aksi.service.receipt.ReceiptService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for read-only order operations Follows CQRS pattern - handles all queries without
 * side effects
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class OrderQueryService {

  private final OrderRepository orderRepository;

  private final OrderGuard orderGuard;
  private final OrderMapper orderMapper;
  private final OrderQueryUtils queryUtils;
  private final ReceiptService receiptService;

  /**
   * Get order by ID
   *
   * @param orderId order ID
   * @return order information
   */
  public OrderInfo getOrder(UUID orderId) {
    log.debug("Getting order by ID: {}", orderId);

    // Step 1: Load entity
    OrderEntity order = orderGuard.ensureExists(orderId);

    // Step 2: Map to DTO and enrich with calculated fields
    return enrichOrderInfo(order);
  }

  /**
   * Get order by order number
   *
   * @param orderNumber order number
   * @return order information
   */
  public OrderInfo getOrderByNumber(String orderNumber) {
    log.debug("Getting order by number: {}", orderNumber);

    // Step 1: Load entity
    OrderEntity order = orderGuard.ensureExistsByNumber(orderNumber);

    // Step 2: Map to DTO and enrich with calculated fields
    return enrichOrderInfo(order);
  }

  /** List orders with filters and pagination */
  public OrderListResponse listOrders(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      UUID customerId,
      OrderStatus status,
      UUID branchId,
      Instant dateFrom,
      Instant dateTo) {

    log.debug(
        "Listing orders - page: {}, size: {}, sortBy: {}, sortOrder: {}",
        page,
        size,
        sortBy,
        sortOrder);

    Pageable pageable = queryUtils.buildPageable(page, size, sortBy, sortOrder);
    String statusString = valueOf(status);
    Specification<OrderEntity> spec =
        OrderSpecification.searchOrders(customerId, branchId, statusString, dateFrom, dateTo, null);
    return fetchToResponse(spec, pageable);
  }

  /** Get customer order history */
  public OrderListResponse getCustomerOrderHistory(
      UUID customerId, Integer page, Integer size, String sortBy, String sortOrder) {

    log.debug("Getting order history for customer {} - page: {}, size: {}", customerId, page, size);

    Pageable pageable = queryUtils.buildPageable(page, size, sortBy, sortOrder);
    Specification<OrderEntity> spec =
        OrderSpecification.searchOrders(customerId, null, null, null, null, null);
    return fetchToResponse(spec, pageable);
  }

  /** Get orders due for completion */
  public OrderListResponse getOrdersDueForCompletion(
      Integer days, Integer page, Integer size, String sortBy, String sortOrder) {

    log.debug(
        "Getting orders due for completion in {} days - page: {}, size: {}", days, page, size);

    Pageable pageable =
        queryUtils.buildPageable(page, size, sortBy, sortOrder, "expectedCompletionDate");
    Instant targetDate = queryUtils.calculateDueDate(days);
    return fetchToResponse(OrderSpecification.isDueForCompletion(targetDate), pageable);
  }

  /** Get overdue orders */
  public OrderListResponse getOverdueOrders(
      Integer page, Integer size, String sortBy, String sortOrder) {

    log.debug("Getting overdue orders - page: {}, size: {}", page, size);

    Pageable pageable =
        queryUtils.buildPageable(page, size, sortBy, sortOrder, "expectedCompletionDate");
    return fetchToResponse(OrderSpecification.isOverdue(Instant.now()), pageable);
  }

  /** Get customer recent orders */
  public List<OrderInfo> getCustomerRecentOrders(UUID customerId, int limit) {
    log.debug("Getting {} recent orders for customer {}", limit, customerId);

    // Step 1: Build pageable
    Pageable pageable = queryUtils.buildPageable(0, limit, "createdAt", "desc");

    // Step 2: Execute query
    Page<OrderEntity> ordersPage =
        orderRepository.findByCustomerEntityIdOrderByCreatedAtDesc(customerId, pageable);

    // Step 3: Map to DTOs and enrich with calculated fields
    return ordersPage.getContent().stream().map(this::enrichOrderInfo).toList();
  }

  /** Get order items */
  public List<OrderItemInfo> getOrderItems(UUID orderId) {
    log.debug("Getting order items for order {}", orderId);

    // Step 1: Load order
    OrderEntity order = orderGuard.ensureExists(orderId);

    // Step 2: Map items
    return order.getItems().stream().map(orderMapper::toOrderItemInfo).toList();
  }

  /** Get order payments */
  public List<PaymentInfo> getOrderPayments(UUID orderId) {
    log.debug("Getting payments for order {}", orderId);

    // Step 1: Load order
    OrderEntity order = orderGuard.ensureExists(orderId);

    // Step 2: Map payments
    return order.getPayments().stream().map(orderMapper::toPaymentInfo).toList();
  }

  /** Get orders by status and branch */
  public List<OrderInfo> getOrdersByStatus(OrderStatus status, UUID branchId) {
    log.debug("Getting orders with status {} for branch {}", status, branchId);

    String statusString = valueOf(status);
    Specification<OrderEntity> spec =
        OrderSpecification.searchOrders(null, branchId, statusString, null, null, null);
    Pageable pageable = queryUtils.buildPageable(0, Integer.MAX_VALUE, "createdAt", "desc");
    return fetchToResponse(spec, pageable).getData();
  }

  /** Check if order exists */
  public boolean existsById(UUID orderId) {
    return orderRepository.existsById(orderId);
  }

  /** Get order receipt (placeholder) */
  public byte[] getOrderReceipt(UUID orderId) {
    log.debug("Preparing receipt for order {}", orderId);

    try {
      // Delegate to dedicated receipt service (PDF generation implemented there)
      var resource = receiptService.generateOrderReceipt(orderId, "uk");
      return resource.getInputStream().readAllBytes();
    } catch (IOException e) {
      throw new RuntimeException("Failed to generate receipt PDF", e);
    }
  }

  /** Build order list response from page */
  private OrderListResponse buildOrderListResponse(Page<OrderEntity> ordersPage) {
    var response = new OrderListResponse();
    response.setData(ordersPage.map(this::enrichOrderInfo).getContent());
    response.setTotalElements(ordersPage.getTotalElements());
    response.setTotalPages(ordersPage.getTotalPages());
    response.setSize(ordersPage.getSize());
    response.setNumber(ordersPage.getNumber());
    response.setNumberOfElements(ordersPage.getNumberOfElements());
    response.setFirst(ordersPage.isFirst());
    response.setLast(ordersPage.isLast());
    response.setEmpty(ordersPage.isEmpty());
    return response;
  }

  private OrderListResponse fetchToResponse(
      Specification<OrderEntity> specification, Pageable pageable) {
    Page<OrderEntity> page = orderRepository.findAll(specification, pageable);
    return buildOrderListResponse(page);
  }

  private String valueOf(OrderStatus status) {
    return status != null ? status.getValue() : null;
  }

  /**
   * Enrich OrderInfo with calculated fields
   *
   * @param order order entity
   * @return enriched order info
   */
  private OrderInfo enrichOrderInfo(OrderEntity order) {
    // Step 1: Map entity to DTO
    OrderInfo orderInfo = orderMapper.toOrderInfo(order);

    // Step 2: Calculate and set pricing fields
    Integer paidAmount = queryUtils.calculatePaidAmount(order);
    Integer balanceDue = queryUtils.calculateBalanceDue(order);
    orderInfo.getPricing().setPaidAmount(paidAmount);
    orderInfo.getPricing().setBalanceDue(balanceDue);

    return orderInfo;
  }
}
