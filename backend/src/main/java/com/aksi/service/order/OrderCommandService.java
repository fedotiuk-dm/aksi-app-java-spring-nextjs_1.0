package com.aksi.service.order;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.order.dto.AddPaymentRequest;
import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.api.order.dto.PhotoType;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;

import lombok.RequiredArgsConstructor;

/**
 * Command service for write operations on orders Follows CQRS pattern - handles all commands with
 * side effects Acts as a thin facade delegating to specific use-case services
 */
@Service
@RequiredArgsConstructor
public class OrderCommandService {

  // Use-case services
  private final OrderCreationService orderCreationService;
  private final OrderStatusService orderStatusService;
  private final OrderItemService orderItemService;
  private final OrderPhotoService orderPhotoService;
  private final OrderPaymentService orderPaymentService;
  private final OrderSignatureService orderSignatureService;

  /** Create new order from cart */
  public OrderInfo createOrder(CreateOrderRequest request) {
    return orderCreationService.create(request);
  }

  /** Update order status */
  public OrderInfo updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
    return orderStatusService.updateStatus(orderId, request);
  }

  /** Update order item characteristics */
  public OrderItemInfo updateItemCharacteristics(
      UUID orderId, UUID itemId, UpdateItemCharacteristicsRequest request) {
    return orderItemService.updateCharacteristics(orderId, itemId, request);
  }

  /** Upload photo for order item */
  public ItemPhotoInfo uploadItemPhoto(
      UUID orderId, UUID itemId, MultipartFile file, PhotoType photoType, String photoDescription) {
    return orderPhotoService.uploadPhoto(orderId, itemId, file, photoType, photoDescription);
  }

  /** Delete photo from order item */
  public void deleteItemPhoto(UUID orderId, UUID itemId, UUID photoId) {
    orderPhotoService.deletePhoto(orderId, itemId, photoId);
  }

  /** Add payment to order */
  public PaymentInfo addOrderPayment(UUID orderId, AddPaymentRequest request) {
    return orderPaymentService.addPayment(orderId, request);
  }

  /** Save customer signature */
  public OrderInfo saveCustomerSignature(UUID orderId, String signatureBase64) {
    return orderSignatureService.saveSignature(orderId, signatureBase64);
  }
}
