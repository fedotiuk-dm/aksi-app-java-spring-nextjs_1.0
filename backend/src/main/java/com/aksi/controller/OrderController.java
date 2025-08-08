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
import com.aksi.api.order.dto.SaveSignatureRequest;
import com.aksi.api.order.dto.SortOrder;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;
import com.aksi.service.order.OrderService;

import lombok.RequiredArgsConstructor;

/** REST controller for order management operations. Thin HTTP layer between OpenAPI and service. */
@RestController
@RequiredArgsConstructor
public class OrderController implements OrdersApi {

  private final OrderService orderService;

  @Override
  public ResponseEntity<OrderListResponse> listOrders(
      Integer page,
      Integer size,
      String sortBy,
      SortOrder sortOrder,
      @Nullable UUID customerId,
      @Nullable OrderStatus status,
      @Nullable UUID branchId,
      @Nullable Instant dateFrom,
      @Nullable Instant dateTo) {
    OrderListResponse response =
        orderService.listOrders(
            page,
            size,
            sortBy,
            sortOrder.getValue(),
            customerId,
            status,
            branchId,
            dateFrom,
            dateTo);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<OrderInfo> createOrder(CreateOrderRequest createOrderRequest) {
    OrderInfo order = orderService.createOrder(createOrderRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(order);
  }

  @Override
  public ResponseEntity<OrderInfo> getOrderById(UUID orderId) {
    OrderInfo order = orderService.getOrder(orderId);
    return ResponseEntity.ok(order);
  }

  @Override
  public ResponseEntity<OrderInfo> updateOrderStatus(
      UUID orderId, UpdateOrderStatusRequest updateOrderStatusRequest) {
    OrderInfo updatedOrder = orderService.updateOrderStatus(orderId, updateOrderStatusRequest);
    return ResponseEntity.ok(updatedOrder);
  }

  @Override
  public ResponseEntity<OrderItemInfo> updateItemCharacteristics(
      UUID orderId,
      UUID itemId,
      UpdateItemCharacteristicsRequest updateItemCharacteristicsRequest) {
    OrderItemInfo updatedItem =
        orderService.updateItemCharacteristics(orderId, itemId, updateItemCharacteristicsRequest);
    return ResponseEntity.ok(updatedItem);
  }

  @Override
  public ResponseEntity<ItemPhotoInfo> uploadItemPhoto(
      UUID orderId,
      UUID itemId,
      MultipartFile file,
      @Nullable PhotoType photoType,
      @Nullable String photoDescription) {
    ItemPhotoInfo photo =
        orderService.uploadItemPhoto(orderId, itemId, file, photoType, photoDescription);
    return ResponseEntity.status(HttpStatus.CREATED).body(photo);
  }

  @Override
  public ResponseEntity<Void> deleteItemPhoto(UUID orderId, UUID itemId, UUID photoId) {
    orderService.deleteItemPhoto(orderId, itemId, photoId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<org.springframework.core.io.Resource> getOrderReceipt(UUID orderId) {
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
    PaymentInfo payment = orderService.addOrderPayment(orderId, addPaymentRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(payment);
  }

  @Override
  public ResponseEntity<OrderInfo> getOrderByNumber(String orderNumber) {
    OrderInfo order = orderService.getOrderByNumber(orderNumber);
    return ResponseEntity.ok(order);
  }

  @Override
  public ResponseEntity<OrderListResponse> getCustomerOrderHistory(
      UUID customerId, Integer page, Integer size, String sortBy, SortOrder sortOrder) {
    OrderListResponse response =
        orderService.getCustomerOrderHistory(customerId, page, size, sortBy, sortOrder.getValue());
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<List<OrderInfo>> getCustomerRecentOrders(UUID customerId, Integer limit) {
    List<OrderInfo> orders = orderService.getCustomerRecentOrders(customerId, limit);
    return ResponseEntity.ok(orders);
  }

  @Override
  public ResponseEntity<OrderListResponse> getOrdersDueForCompletion(
      Integer days, Integer page, Integer size, String sortBy, SortOrder sortOrder) {
    OrderListResponse response =
        orderService.getOrdersDueForCompletion(days, page, size, sortBy, sortOrder.getValue());
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<OrderListResponse> getOverdueOrders(
      Integer page, Integer size, String sortBy, SortOrder sortOrder) {
    OrderListResponse response =
        orderService.getOverdueOrders(page, size, sortBy, sortOrder.getValue());
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<List<OrderInfo>> getOrdersByStatus(
      OrderStatus status, @Nullable UUID branchId) {
    List<OrderInfo> orders = orderService.getOrdersByStatus(status, branchId);
    return ResponseEntity.ok(orders);
  }

  @Override
  public ResponseEntity<List<OrderItemInfo>> getOrderItems(UUID orderId) {
    List<OrderItemInfo> items = orderService.getOrderItems(orderId);
    return ResponseEntity.ok(items);
  }

  @Override
  public ResponseEntity<List<PaymentInfo>> getOrderPayments(UUID orderId) {
    List<PaymentInfo> payments = orderService.getOrderPayments(orderId);
    return ResponseEntity.ok(payments);
  }

  @Override
  public ResponseEntity<OrderInfo> saveCustomerSignature(
      UUID orderId, SaveSignatureRequest saveSignatureRequest) {
    OrderInfo updatedOrder =
        orderService.saveCustomerSignature(orderId, saveSignatureRequest.getSignature());
    return ResponseEntity.ok(updatedOrder);
  }
}
