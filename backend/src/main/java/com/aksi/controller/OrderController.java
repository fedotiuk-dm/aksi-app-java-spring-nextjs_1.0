package com.aksi.controller;

import java.time.LocalDate;
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

import com.aksi.api.order.OrderApi;
import com.aksi.api.order.dto.AddPaymentRequest;
import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.OrderStatus;
import com.aksi.api.order.dto.OrdersResponse;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;
import com.aksi.api.order.dto.UploadItemPhotoRequest;
import com.aksi.domain.order.Order;
import com.aksi.service.order.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** REST controller for order management operations */
@Slf4j
@RestController
@RequiredArgsConstructor
public class OrderController implements OrderApi {

  private final OrderService orderService;

  @Override
  public ResponseEntity<OrdersResponse> listOrders(
      @Nullable Integer offset,
      @Nullable Integer limit,
      @Nullable String customerId,
      @Nullable OrderStatus status,
      @Nullable String branchId,
      @Nullable LocalDate dateFrom,
      @Nullable LocalDate dateTo) {

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

    // Convert string parameters to appropriate types
    UUID customerUuid = customerId != null ? UUID.fromString(customerId) : null;
    UUID branchUuid = branchId != null ? UUID.fromString(branchId) : null;
    Order.OrderStatus orderStatus =
        status != null ? Order.OrderStatus.valueOf(status.getValue()) : null;

    Page<OrderInfo> orders =
        orderService.listOrders(
            customerUuid, orderStatus, branchUuid, dateFrom, dateTo, null, pageable);

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
  public ResponseEntity<OrderInfo> getOrderById(String orderId) {
    log.debug("Getting order by ID: {}", orderId);

    UUID orderUuid = UUID.fromString(orderId);
    OrderInfo order = orderService.getOrder(orderUuid);

    return ResponseEntity.ok(order);
  }

  @Override
  public ResponseEntity<OrderInfo> updateOrderStatus(
      String orderId, UpdateOrderStatusRequest updateOrderStatusRequest) {

    log.debug("Updating order {} status to {}", orderId, updateOrderStatusRequest.getStatus());

    UUID orderUuid = UUID.fromString(orderId);
    OrderInfo updatedOrder = orderService.updateOrderStatus(orderUuid, updateOrderStatusRequest);

    return ResponseEntity.ok(updatedOrder);
  }

  @Override
  public ResponseEntity<OrderItemInfo> updateItemCharacteristics(
      String orderId,
      String itemId,
      UpdateItemCharacteristicsRequest updateItemCharacteristicsRequest) {

    log.debug("Updating characteristics for item {} in order {}", itemId, orderId);

    UUID orderUuid = UUID.fromString(orderId);
    UUID itemUuid = UUID.fromString(itemId);

    OrderItemInfo updatedItem =
        orderService.updateItemCharacteristics(
            orderUuid, itemUuid, updateItemCharacteristicsRequest);

    return ResponseEntity.ok(updatedItem);
  }

  @Override
  public ResponseEntity<ItemPhotoInfo> uploadItemPhoto(
      String orderId, String itemId, UploadItemPhotoRequest uploadItemPhotoRequest) {

    log.debug("Uploading photo for item {} in order {}", itemId, orderId);

    UUID orderUuid = UUID.fromString(orderId);
    UUID itemUuid = UUID.fromString(itemId);

    ItemPhotoInfo photo = orderService.uploadItemPhoto(orderUuid, itemUuid, uploadItemPhotoRequest);

    return ResponseEntity.status(HttpStatus.CREATED).body(photo);
  }

  @Override
  public ResponseEntity<Void> deleteItemPhoto(String orderId, String itemId, String photoId) {
    log.debug("Deleting photo {} from item {} in order {}", photoId, itemId, orderId);

    UUID orderUuid = UUID.fromString(orderId);
    UUID itemUuid = UUID.fromString(itemId);
    UUID photoUuid = UUID.fromString(photoId);

    orderService.deleteItemPhoto(orderUuid, itemUuid, photoUuid);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<org.springframework.core.io.Resource> getOrderReceipt(String orderId) {
    log.debug("Generating receipt for order: {}", orderId);

    UUID orderUuid = UUID.fromString(orderId);
    byte[] pdfContent = orderService.getOrderReceipt(orderUuid);

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
      String orderId, AddPaymentRequest addPaymentRequest) {

    log.debug("Adding payment of {} to order {}", addPaymentRequest.getAmount(), orderId);

    UUID orderUuid = UUID.fromString(orderId);
    PaymentInfo payment = orderService.addOrderPayment(orderUuid, addPaymentRequest);

    return ResponseEntity.status(HttpStatus.CREATED).body(payment);
  }
}
