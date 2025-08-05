package com.aksi.controller;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import com.aksi.api.order.dto.OrderStatus;
import com.aksi.api.order.dto.OrdersResponse;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.api.order.dto.PhotoType;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;
import com.aksi.domain.order.Order;
import com.aksi.service.order.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** REST controller for order management operations */
@Slf4j
@RestController
@RequiredArgsConstructor
public class OrderController implements OrdersApi {

  private final OrderService orderService;

  @Override
  public ResponseEntity<OrdersResponse> listOrders(
      Integer offset,
      Integer limit,
      @Nullable UUID customerId,
      @Nullable OrderStatus status,
      @Nullable UUID branchId,
      @Nullable Instant dateFrom,
      @Nullable Instant dateTo) {

    log.debug(
        "Listing orders with filters - customer: {}, status: {}, branch: {}",
        customerId,
        status,
        branchId);

    // Create pageable with sorting by creation date descending
    Pageable pageable =
        PageRequest.of(
            offset != null ? offset / (limit != null ? limit : 20) : 0,
            limit != null ? limit : 20,
            Sort.by(Sort.Direction.DESC, "createdAt"));

    // Convert OrderStatus DTO to domain enum
    Order.OrderStatus orderStatus =
        status != null ? Order.OrderStatus.valueOf(status.getValue()) : null;

    Page<OrderInfo> orders =
        orderService.listOrders(
            customerId, orderStatus, branchId, dateFrom, dateTo, null, pageable);

    OrdersResponse response = new OrdersResponse();
    response.setOrders(orders.getContent());
    response.setTotalItems((int) orders.getTotalElements());
    response.setHasMore(orders.hasNext());

    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<OrderInfo> createOrder(CreateOrderRequest createOrderRequest) {
    log.debug("Creating order from cart: {}", createOrderRequest.getCartId());

    OrderInfo order = orderService.createOrder(createOrderRequest);

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

    return ResponseEntity.status(HttpStatus.CREATED).body(photo);
  }

  @Override
  public ResponseEntity<Void> deleteItemPhoto(UUID orderId, UUID itemId, UUID photoId) {
    log.debug("Deleting photo {} from item {} in order {}", photoId, itemId, orderId);

    orderService.deleteItemPhoto(orderId, itemId, photoId);

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

    return ResponseEntity.status(HttpStatus.CREATED).body(payment);
  }
}
