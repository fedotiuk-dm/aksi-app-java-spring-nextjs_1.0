package com.aksi.service.order;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.order.dto.AddPaymentRequest;
import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.OrderListResponse;
import com.aksi.api.order.dto.OrderStatus;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.api.order.dto.PhotoType;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Thin adapter/facade for OrderService Delegates all operations to specialized Query and Command
 * services Follows CQRS pattern - provides unified API while separating read/write concerns
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class OrderServiceImpl implements OrderService {

  private final OrderQueryService queryService;
  private final OrderCommandService commandService;

  // Read operations - delegated to QueryService

  @Override
  public OrderInfo getOrder(UUID orderId) {
    return queryService.getOrder(orderId);
  }

  @Override
  public OrderInfo getOrderByNumber(String orderNumber) {
    return queryService.getOrderByNumber(orderNumber);
  }

  @Override
  public boolean existsById(UUID orderId) {
    return queryService.existsById(orderId);
  }

  @Override
  public List<OrderInfo> getCustomerRecentOrders(UUID customerId, int limit) {
    return queryService.getCustomerRecentOrders(customerId, limit);
  }

  @Override
  public List<OrderItemInfo> getOrderItems(UUID orderId) {
    return queryService.getOrderItems(orderId);
  }

  @Override
  public List<PaymentInfo> getOrderPayments(UUID orderId) {
    return queryService.getOrderPayments(orderId);
  }

  @Override
  public byte[] getOrderReceipt(UUID orderId) {
    return queryService.getOrderReceipt(orderId);
  }

  // Write operations - delegated to CommandService

  @Override
  @Transactional
  public OrderInfo createOrder(CreateOrderRequest request) {
    log.info("Creating order from cart: {}", request.getCartId());
    return commandService.createOrder(request);
  }

  @Override
  @Transactional
  public OrderInfo updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
    log.info("Updating order {} status to {}", orderId, request.getStatus());
    return commandService.updateOrderStatus(orderId, request);
  }

  @Override
  @Transactional
  public OrderItemInfo updateItemCharacteristics(
      UUID orderId, UUID itemId, UpdateItemCharacteristicsRequest request) {
    log.info("Updating characteristics for item {} in order {}", itemId, orderId);
    return commandService.updateItemCharacteristics(orderId, itemId, request);
  }

  @Override
  @Transactional
  public ItemPhotoInfo uploadItemPhoto(
      UUID orderId, UUID itemId, MultipartFile file, PhotoType photoType, String photoDescription) {
    log.info("Uploading photo for item {} in order {}", itemId, orderId);
    return commandService.uploadItemPhoto(orderId, itemId, file, photoType, photoDescription);
  }

  @Override
  @Transactional
  public void deleteItemPhoto(UUID orderId, UUID itemId, UUID photoId) {
    log.info("Deleting photo {} from item {} in order {}", photoId, itemId, orderId);
    commandService.deleteItemPhoto(orderId, itemId, photoId);
  }

  @Override
  @Transactional
  public PaymentInfo addOrderPayment(UUID orderId, AddPaymentRequest request) {
    log.info("Adding payment of {} to order {}", request.getAmount(), orderId);
    return commandService.addOrderPayment(orderId, request);
  }

  @Override
  @Transactional
  public OrderInfo saveCustomerSignature(UUID orderId, String signatureBase64) {
    log.info("Saving customer signature for order: {}", orderId);
    return commandService.saveCustomerSignature(orderId, signatureBase64);
  }

  @Override
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
    return queryService.listOrders(
        page, size, sortBy, sortOrder, customerId, status, branchId, dateFrom, dateTo);
  }

  @Override
  public OrderListResponse getCustomerOrderHistory(
      UUID customerId, Integer page, Integer size, String sortBy, String sortOrder) {
    return queryService.getCustomerOrderHistory(customerId, page, size, sortBy, sortOrder);
  }

  @Override
  public OrderListResponse getOrdersDueForCompletion(
      Integer days, Integer page, Integer size, String sortBy, String sortOrder) {
    return queryService.getOrdersDueForCompletion(days, page, size, sortBy, sortOrder);
  }

  @Override
  public OrderListResponse getOverdueOrders(
      Integer page, Integer size, String sortBy, String sortOrder) {
    return queryService.getOverdueOrders(page, size, sortBy, sortOrder);
  }

  @Override
  public List<OrderInfo> getOrdersByStatus(OrderStatus status, UUID branchId) {
    return queryService.getOrdersByStatus(status, branchId);
  }
}
