package com.aksi.service.order.factory;

import java.time.Instant;
import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.file.dto.FileUploadResponse;
import com.aksi.api.order.dto.AddPaymentRequest;
import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.OrderStatus;
import com.aksi.api.order.dto.PhotoType;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.domain.branch.BranchEntity;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.order.ItemCharacteristicsEntity;
import com.aksi.domain.order.ItemPhotoEntity;
import com.aksi.domain.order.OrderEntity;
import com.aksi.domain.order.OrderItemEntity;
import com.aksi.domain.order.OrderPaymentEntity;
import com.aksi.domain.user.UserEntity;
import com.aksi.mapper.OrderMapper;
import com.aksi.service.order.OrderNumberGenerator;
import com.aksi.service.order.OrderPricingCalculator;

import lombok.RequiredArgsConstructor;

/** Factory for creating Order entities Centralizes order creation logic and ensures consistency */
@Component
@RequiredArgsConstructor
public class OrderFactory {

  private final OrderNumberGenerator numberGenerator;
  private final OrderPricingCalculator pricingCalculator;
  private final OrderMapper orderMapper;

  private static final String DEFAULT_PHOTO_DESCRIPTION = "Uploaded photo";

  /**
   * Create new order entity from cart
   *
   * @param request create order request
   * @param cart source cart
   * @param branch target branch
   * @param currentUser user creating the order
   * @param pricing calculated pricing
   * @return new order entity with items
   */
  public OrderEntity createOrder(
      CreateOrderRequest request,
      CartEntity cart,
      BranchEntity branch,
      UserEntity currentUser,
      PriceCalculationResponse pricing) {

    // Create order entity
    OrderEntity order = new OrderEntity();

    // Set core fields
    order.setOrderNumber(numberGenerator.generateOrderNumber());
    order.setCustomerEntity(cart.getCustomerEntity());
    order.setBranchEntity(branch);
    order.setStatus(OrderStatus.PENDING.getValue());
    order.setCreatedBy(currentUser);
    order.setExpectedCompletionDate(pricingCalculator.calculateExpectedCompletionDate(cart));

    // Apply request fields and pricing via mapper
    orderMapper.applyCreateRequest(request, order);
    orderMapper.applyPricingSnapshot(pricing, order);

    // Convert cart items to order items
    for (CartItem cartItem : cart.getItems()) {
      OrderItemEntity orderItem = createOrderItem(cartItem, pricing);
      orderItem.setOrderEntity(order);
      order.getItems().add(orderItem);
    }

    return order;
  }

  /**
   * Create order item from cart item
   *
   * @param cartItem source cart item
   * @param pricing calculated pricing
   * @return new order item entity
   */
  private OrderItemEntity createOrderItem(CartItem cartItem, PriceCalculationResponse pricing) {
    // Create order item via mapper
    OrderItemEntity orderItem = orderMapper.toOrderItemEntity(cartItem);

    // Apply calculated price
    var calculatedPrice = pricingCalculator.findCalculatedPriceForItem(cartItem, pricing);
    orderMapper.applyCalculatedPrice(calculatedPrice, orderItem);

    // Map characteristics if present
    if (cartItem.getCharacteristics() != null) {
      ItemCharacteristicsEntity characteristics = orderMapper.toItemCharacteristicsEntity(cartItem);
      characteristics.setId(null); // Ensure it's a new entity
      orderItem.setCharacteristics(characteristics);
      characteristics.setOrderItemEntity(orderItem);
    }

    return orderItem;
  }

  /**
   * Create payment entity for order
   *
   * @param order target order
   * @param request payment request
   * @param paidBy user making the payment
   * @return new payment entity
   */
  public OrderPaymentEntity createPayment(
      OrderEntity order, AddPaymentRequest request, UserEntity paidBy) {

    var payment = new OrderPaymentEntity();
    payment.setOrderEntity(order);
    payment.setAmount(request.getAmount());
    payment.setMethod(request.getMethod());
    payment.setPaidBy(paidBy);
    payment.setPaidAt(Instant.now());

    return payment;
  }

  /**
   * Create photo entity for order item
   *
   * @param orderItem target order item
   * @param file uploaded file
   * @param uploadResponse file upload result
   * @param photoType type of photo
   * @param description photo description
   * @param uploadedBy user uploading the photo
   * @return new photo entity
   */
  public ItemPhotoEntity createPhoto(
      OrderItemEntity orderItem,
      MultipartFile file,
      FileUploadResponse uploadResponse,
      PhotoType photoType,
      String description,
      UserEntity uploadedBy) {

    var photo = new ItemPhotoEntity();
    photo.setOrderItemEntity(orderItem);
    photo.setUrl(uploadResponse.getFileUrl());
    photo.setType(photoType != null ? photoType : PhotoType.GENERAL);
    photo.setDescription(Objects.requireNonNullElse(description, DEFAULT_PHOTO_DESCRIPTION));
    photo.setUploadedBy(uploadedBy);
    photo.setUploadedAt(Instant.now());
    photo.setOriginalFilename(file.getOriginalFilename());
    photo.setContentType(file.getContentType());
    photo.setFileSize(file.getSize());

    return photo;
  }
}
