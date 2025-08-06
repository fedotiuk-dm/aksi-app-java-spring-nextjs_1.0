package com.aksi.service.order;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.OrderListResponse;
import com.aksi.api.order.dto.OrderStatus;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.domain.order.OrderEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.OrderMapper;
import com.aksi.repository.OrderRepository;
import com.aksi.repository.OrderSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for read-only order operations Follows CQRS pattern - handles all queries without
 * side effects
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class OrderQueryService {

  private final OrderRepository orderRepository;
  private final OrderMapper orderMapper;

  /**
   * Get order by ID
   *
   * @param orderId order ID
   * @return order information
   */
  public OrderInfo getOrder(UUID orderId) {
    log.debug("Getting order by ID: {}", orderId);
    OrderEntity orderEntity = findOrderById(orderId);
    return orderMapper.toOrderInfo(orderEntity);
  }

  /**
   * Get order by order number
   *
   * @param orderNumber order number
   * @return order information
   */
  public OrderInfo getOrderByNumber(String orderNumber) {
    log.debug("Getting order by number: {}", orderNumber);
    OrderEntity orderEntity = findOrderByNumber(orderNumber);
    return orderMapper.toOrderInfo(orderEntity);
  }

  /** List orders with filters and pagination */
  public Page<OrderInfo> listOrders(
      UUID customerId,
      OrderEntity.OrderStatus status,
      UUID branchId,
      Instant dateFrom,
      Instant dateTo,
      String search,
      Pageable pageable) {

    log.debug(
        "Listing orders with filters - customer: {}, status: {}, branch: {}",
        customerId,
        status,
        branchId);

    var specification =
        OrderSpecification.searchOrders(customerId, branchId, status, dateFrom, dateTo, search);
    return orderRepository.findAll(specification, pageable).map(orderMapper::toOrderInfo);
  }

  /** List orders with page/size parameters and return OrderListResponse */
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

    // Create pageable from page/size/sort parameters
    Sort.Direction direction =
        "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
    Sort sort = Sort.by(direction, sortBy != null ? sortBy : "createdAt");
    Pageable pageable = PageRequest.of(page != null ? page : 0, size != null ? size : 20, sort);

    // Convert OrderStatus DTO to entity enum
    OrderEntity.OrderStatus entityStatus = null;
    if (status != null) {
      entityStatus = OrderEntity.OrderStatus.valueOf(status.name());
    }

    // Get page of orders
    Page<OrderInfo> ordersPage =
        listOrders(customerId, entityStatus, branchId, dateFrom, dateTo, null, pageable);

    // Convert to OrderListResponse
    OrderListResponse response = new OrderListResponse();
    response.setData(ordersPage.getContent());
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

  /** Check if order exists by ID */
  public boolean existsById(UUID orderId) {
    return orderRepository.existsById(orderId);
  }

  /** Check if order can be modified */
  public boolean canModifyOrder(UUID orderId) {
    return orderRepository.findById(orderId).map(OrderEntity::canBeModified).orElse(false);
  }

  /** Calculate order total amount */
  public Integer calculateOrderTotal(UUID orderId) {
    log.debug("Calculating total for order: {}", orderId);
    OrderEntity orderEntity = findOrderById(orderId);
    return orderEntity.getTotalAmount();
  }

  /** Get customer order history with pagination */
  public Page<OrderInfo> getCustomerOrderHistory(UUID customerId, Pageable pageable) {
    log.debug("Getting order history for customer: {}", customerId);
    return orderRepository
        .findByCustomerEntityIdOrderByCreatedAtDesc(customerId, pageable)
        .map(orderMapper::toOrderInfo);
  }

  /** Get orders due for completion within specified days */
  public Page<OrderInfo> getOrdersDueForCompletion(int days, Pageable pageable) {
    log.debug("Getting orders due for completion in {} days", days);
    Instant targetDate = Instant.now().plusSeconds((long) days * 24 * 60 * 60);
    return orderRepository
        .findAll(OrderSpecification.isDueForCompletion(targetDate), pageable)
        .map(orderMapper::toOrderInfo);
  }

  /** Get overdue orders */
  public Page<OrderInfo> getOverdueOrders(Pageable pageable) {
    log.debug("Getting overdue orders");
    return orderRepository
        .findAll(OrderSpecification.isOverdue(Instant.now()), pageable)
        .map(orderMapper::toOrderInfo);
  }

  /** Get customer recent orders with limit */
  public List<OrderInfo> getCustomerRecentOrders(UUID customerId, int limit) {
    log.debug("Getting {} recent orders for customer {}", limit, customerId);

    Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
    List<OrderEntity> orderEntities =
        orderRepository
            .findByCustomerEntityIdOrderByCreatedAtDesc(customerId, pageable)
            .getContent();

    return orderMapper.toOrderInfoList(orderEntities);
  }

  /** Get order items for specific order */
  public List<OrderItemInfo> getOrderItems(UUID orderId) {
    log.debug("Getting order items for order {}", orderId);
    OrderEntity orderEntity = findOrderById(orderId);
    return orderMapper.toOrderItemInfoList(orderEntity.getItems());
  }

  /** Get payments for specific order */
  public List<PaymentInfo> getOrderPayments(UUID orderId) {
    log.debug("Getting payments for order {}", orderId);
    OrderEntity orderEntity = findOrderById(orderId);
    return orderMapper.toPaymentInfoList(orderEntity.getPayments());
  }

  /** Get orders by status and branch */
  public List<OrderInfo> getOrdersByStatus(OrderEntity.OrderStatus status, UUID branchId) {
    log.debug("Getting orders with status {} for branch {}", status, branchId);

    var specification = OrderSpecification.searchOrders(null, branchId, status, null, null, null);
    Pageable pageable =
        PageRequest.of(0, Integer.MAX_VALUE, Sort.by(Sort.Direction.DESC, "createdAt"));

    List<OrderEntity> orderEntities = orderRepository.findAll(specification, pageable).getContent();
    return orderMapper.toOrderInfoList(orderEntities);
  }

  /** Generate receipt data (read-only preparation) */
  public byte[] getOrderReceipt(UUID orderId) {
    log.debug("Preparing receipt for order {}", orderId);
    OrderEntity orderEntity = findOrderById(orderId);

    // TODO: Implement PDF generation service
    log.info("Generating receipt for order {}", orderEntity.getOrderNumber());
    return "PDF content placeholder".getBytes();
  }

  /** Get customer order history with page/size parameters */
  public OrderListResponse getCustomerOrderHistory(
      UUID customerId, Integer page, Integer size, String sortBy, String sortOrder) {
    log.debug("Getting order history for customer {} - page: {}, size: {}", customerId, page, size);

    // Create pageable from parameters
    Sort.Direction direction =
        "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
    Sort sort = Sort.by(direction, sortBy != null ? sortBy : "createdAt");
    Pageable pageable = PageRequest.of(page != null ? page : 0, size != null ? size : 20, sort);

    // Get orders
    Page<OrderInfo> ordersPage = getCustomerOrderHistory(customerId, pageable);

    // Convert to OrderListResponse
    OrderListResponse response = new OrderListResponse();
    response.setData(ordersPage.getContent());
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

  /** Get orders due for completion with page/size parameters */
  public OrderListResponse getOrdersDueForCompletion(
      Integer days, Integer page, Integer size, String sortBy, String sortOrder) {
    log.debug(
        "Getting orders due for completion in {} days - page: {}, size: {}", days, page, size);

    // Create pageable from parameters
    Sort.Direction direction =
        "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
    Sort sort = Sort.by(direction, sortBy != null ? sortBy : "expectedCompletionDate");
    Pageable pageable = PageRequest.of(page != null ? page : 0, size != null ? size : 20, sort);

    // Get orders
    Page<OrderInfo> ordersPage = getOrdersDueForCompletion(days != null ? days : 7, pageable);

    // Convert to OrderListResponse
    OrderListResponse response = new OrderListResponse();
    response.setData(ordersPage.getContent());
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

  /** Get overdue orders with page/size parameters */
  public OrderListResponse getOverdueOrders(
      Integer page, Integer size, String sortBy, String sortOrder) {
    log.debug("Getting overdue orders - page: {}, size: {}", page, size);

    // Create pageable from parameters
    Sort.Direction direction =
        "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
    Sort sort = Sort.by(direction, sortBy != null ? sortBy : "expectedCompletionDate");
    Pageable pageable = PageRequest.of(page != null ? page : 0, size != null ? size : 20, sort);

    // Get orders
    Page<OrderInfo> ordersPage = getOverdueOrders(pageable);

    // Convert to OrderListResponse
    OrderListResponse response = new OrderListResponse();
    response.setData(ordersPage.getContent());
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

  // Private helper methods from OrderFinder

  /** Find order by ID with validation */
  private OrderEntity findOrderById(UUID orderId) {
    return orderRepository
        .findById(orderId)
        .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
  }

  /** Find order by order number with validation */
  private OrderEntity findOrderByNumber(String orderNumber) {
    return orderRepository
        .findByOrderNumber(orderNumber)
        .orElseThrow(() -> new NotFoundException("Order not found: " + orderNumber));
  }
}
