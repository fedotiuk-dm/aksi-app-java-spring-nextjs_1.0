package com.aksi.controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.order.OrdersApi;
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
import com.aksi.service.order.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for order management operations. Thin layer between OpenAPI and service with
 * logging.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class OrderController implements OrdersApi {

  private final OrderService orderService;

  @Override
  public ResponseEntity<OrderListResponse> listOrders(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      @Nullable UUID customerId,
      @Nullable OrderStatus status,
      @Nullable UUID branchId,
      @Nullable Instant dateFrom,
      @Nullable Instant dateTo) {
    log.debug("Listing orders - page: {}, size: {}, status: {}", page, size, status);

    OrderListResponse response =
        orderService.listOrders(
            page, size, sortBy, sortOrder, customerId, status, branchId, dateFrom, dateTo);
    log.debug("Retrieved {} orders", response.getTotalElements());
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<OrderInfo> createOrder(CreateOrderRequest createOrderRequest) {
    log.debug("Creating order from cart: {}", createOrderRequest.getCartId());

    OrderInfo order = orderService.createOrder(createOrderRequest);
    log.debug("Order created with id: {}", order.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(order);
  }

  @Override
  public ResponseEntity<OrderInfo> getOrderById(UUID orderId) {
    log.debug("Getting order by ID: {}", orderId);

    OrderInfo order = orderService.getOrder(orderId);
    return ResponseEntity.ok(order);
  }

  @Override
  public ResponseEntity<OrderInfo> updateOrderStatus(
      UUID orderId, UpdateOrderStatusRequest updateOrderStatusRequest) {
    log.debug("Updating order {} status to {}", orderId, updateOrderStatusRequest.getStatus());

    OrderInfo updatedOrder = orderService.updateOrderStatus(orderId, updateOrderStatusRequest);
    log.debug("Order {} status updated", orderId);
    return ResponseEntity.ok(updatedOrder);
  }

  @Override
  public ResponseEntity<OrderItemInfo> updateItemCharacteristics(
      UUID orderId,
      UUID itemId,
      UpdateItemCharacteristicsRequest updateItemCharacteristicsRequest) {
    log.debug("Updating characteristics for item {} in order {}", itemId, orderId);

    OrderItemInfo updatedItem =
        orderService.updateItemCharacteristics(orderId, itemId, updateItemCharacteristicsRequest);
    log.debug("Item {} characteristics updated", itemId);
    return ResponseEntity.ok(updatedItem);
  }

  @Override
  public ResponseEntity<ItemPhotoInfo> uploadItemPhoto(
      UUID orderId,
      UUID itemId,
      MultipartFile file,
      @Nullable PhotoType photoType,
      @Nullable String photoDescription) {
    log.debug("Uploading photo for item {} in order {}", itemId, orderId);

    ItemPhotoInfo photo =
        orderService.uploadItemPhoto(orderId, itemId, file, photoType, photoDescription);
    log.debug("Photo uploaded for item {} (photoId: {})", itemId, photo.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(photo);
  }

  @Override
  public ResponseEntity<Void> deleteItemPhoto(UUID orderId, UUID itemId, UUID photoId) {
    log.debug("Deleting photo {} from item {} in order {}", photoId, itemId, orderId);

    orderService.deleteItemPhoto(orderId, itemId, photoId);
    log.debug("Photo {} deleted", photoId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<org.springframework.core.io.Resource> getOrderReceipt(UUID orderId) {
    log.debug("Generating receipt for order: {}", orderId);

    byte[] pdfContent = orderService.getOrderReceipt(orderId);

    // Create resource from byte array
    org.springframework.core.io.Resource resource =
        new org.springframework.core.io.ByteArrayResource(pdfContent);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.setContentDispositionFormData("attachment", "order-" + orderId + "-receipt.pdf");
    headers.setContentLength(pdfContent.length);

    return ResponseEntity.ok().headers(headers).body(resource);
  }

  @Override
  public ResponseEntity<PaymentInfo> addOrderPayment(
      UUID orderId, AddPaymentRequest addPaymentRequest) {
    log.debug("Adding payment of {} to order {}", addPaymentRequest.getAmount(), orderId);

    PaymentInfo payment = orderService.addOrderPayment(orderId, addPaymentRequest);
    log.debug("Payment added to order {} (paymentId: {})", orderId, payment.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(payment);
  }

  @Override
  public ResponseEntity<OrderInfo> getOrderByNumber(String orderNumber) {
    log.debug("Getting order by number: {}", orderNumber);

    OrderInfo order = orderService.getOrderByNumber(orderNumber);
    return ResponseEntity.ok(order);
  }

  @Override
  public ResponseEntity<OrderListResponse> getCustomerOrderHistory(
      UUID customerId, Integer page, Integer size, String sortBy, String sortOrder) {
    log.debug("Getting order history for customer: {}", customerId);

    OrderListResponse response =
        orderService.getCustomerOrderHistory(customerId, page, size, sortBy, sortOrder);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<List<OrderInfo>> getCustomerRecentOrders(UUID customerId, Integer limit) {
    log.debug("Getting {} recent orders for customer: {}", limit, customerId);

    List<OrderInfo> orders = orderService.getCustomerRecentOrders(customerId, limit);
    return ResponseEntity.ok(orders);
  }

  @Override
  public ResponseEntity<OrderListResponse> getOrdersDueForCompletion(
      Integer days, Integer page, Integer size, String sortBy, String sortOrder) {
    log.debug("Getting orders due for completion in {} days", days);

    OrderListResponse response =
        orderService.getOrdersDueForCompletion(days, page, size, sortBy, sortOrder);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<OrderListResponse> getOverdueOrders(
      Integer page, Integer size, String sortBy, String sortOrder) {
    log.debug("Getting overdue orders");

    OrderListResponse response = orderService.getOverdueOrders(page, size, sortBy, sortOrder);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<List<OrderInfo>> getOrdersByStatus(
      OrderStatus status, @Nullable UUID branchId) {
    log.debug("Getting orders with status: {}", status);

    List<OrderInfo> orders = orderService.getOrdersByStatus(status, branchId);
    return ResponseEntity.ok(orders);
  }

  @Override
  public ResponseEntity<List<OrderItemInfo>> getOrderItems(UUID orderId) {
    log.debug("Getting items for order: {}", orderId);

    List<OrderItemInfo> items = orderService.getOrderItems(orderId);
    return ResponseEntity.ok(items);
  }

  @Override
  public ResponseEntity<List<PaymentInfo>> getOrderPayments(UUID orderId) {
    log.debug("Getting payments for order: {}", orderId);

    List<PaymentInfo> payments = orderService.getOrderPayments(orderId);
    return ResponseEntity.ok(payments);
  }
}
