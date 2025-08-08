package com.aksi.service.order.validator;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.api.order.dto.OrderStatus;
import com.aksi.domain.branch.BranchEntity;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.order.OrderEntity;
import com.aksi.exception.BadRequestException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validator service for order domain business rules Centralizes all order-related business
 * validations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderValidator {

  private static final EnumSet<OrderStatus> SIGNATURE_ALLOWED_STATUSES =
      EnumSet.of(OrderStatus.PENDING, OrderStatus.READY, OrderStatus.COMPLETED);

  private static final EnumSet<OrderStatus> MODIFIABLE_STATUSES =
      EnumSet.of(OrderStatus.PENDING, OrderStatus.ACCEPTED);

  private static final Map<OrderStatus, EnumSet<OrderStatus>> ALLOWED_TRANSITIONS =
      new EnumMap<>(OrderStatus.class);

  static {
    ALLOWED_TRANSITIONS.put(
        OrderStatus.PENDING, EnumSet.of(OrderStatus.ACCEPTED, OrderStatus.CANCELLED));
    ALLOWED_TRANSITIONS.put(
        OrderStatus.ACCEPTED, EnumSet.of(OrderStatus.IN_PROGRESS, OrderStatus.CANCELLED));
    ALLOWED_TRANSITIONS.put(
        OrderStatus.IN_PROGRESS, EnumSet.of(OrderStatus.READY, OrderStatus.CANCELLED));
    ALLOWED_TRANSITIONS.put(OrderStatus.READY, EnumSet.of(OrderStatus.COMPLETED));
    ALLOWED_TRANSITIONS.put(OrderStatus.COMPLETED, EnumSet.noneOf(OrderStatus.class));
    ALLOWED_TRANSITIONS.put(OrderStatus.CANCELLED, EnumSet.noneOf(OrderStatus.class));
  }

  /**
   * Validate cart is suitable for order creation
   *
   * @param cart cart entity
   * @throws BadRequestException if validation fails
   */
  public void validateCartForOrder(CartEntity cart) {
    require(!cart.isExpired(), "Cart has expired");
    require(!cart.getItems().isEmpty(), "Cannot create order from empty cart");
    require(cart.getCustomerEntity() != null, "Cart must have a customer");
    log.debug("Cart {} is valid for order creation", cart.getId());
  }

  /**
   * Validate branch is active and can accept orders
   *
   * @param branch branch entity
   * @throws BadRequestException if validation fails
   */
  public void validateBranchIsActive(BranchEntity branch) {
    require(branch.isActive(), "Branch " + branch.getName() + " is not active");
  }

  /**
   * Validate status transition is allowed
   *
   * @param fromStatus current status
   * @param toStatus target status
   * @throws BadRequestException if transition is not allowed
   */
  public void validateStatusTransition(OrderStatus fromStatus, OrderStatus toStatus) {
    boolean allowed =
        ALLOWED_TRANSITIONS
            .getOrDefault(fromStatus, EnumSet.noneOf(OrderStatus.class))
            .contains(toStatus);
    require(
        allowed, String.format("Invalid status transition from %s to %s", fromStatus, toStatus));
    log.debug("Status transition from {} to {} is valid", fromStatus, toStatus);
  }

  /**
   * Validate payment amount against remaining balance
   *
   * @param paymentAmount payment amount
   * @param remainingBalance remaining balance
   * @throws BadRequestException if payment exceeds balance
   */
  public void validatePaymentAmount(Integer paymentAmount, Integer remainingBalance) {
    if (paymentAmount == null || paymentAmount <= 0) {
      throw new BadRequestException("Payment amount must be positive");
    }
    int balance = remainingBalance != null ? remainingBalance : 0;
    if (paymentAmount > balance) {
      throw new BadRequestException(
          String.format(
              "Payment amount (%d) exceeds remaining balance (%d)", paymentAmount, balance));
    }
  }

  /**
   * Validate order can accept signature in current status
   *
   * @param order order entity
   * @throws BadRequestException if signature not allowed
   */
  public void validateCanAddSignature(OrderEntity order) {
    OrderStatus status = OrderStatus.fromValue(order.getStatus());
    require(
        SIGNATURE_ALLOWED_STATUSES.contains(status),
        "Cannot add signature to order in status: " + status);
    require(order.getCustomerSignature() == null, "Order already has customer signature");
  }

  /**
   * Validate terms acceptance for order creation
   *
   * @param termsAccepted terms acceptance flag
   * @throws BadRequestException if terms not accepted
   */
  public void validateTermsAccepted(Boolean termsAccepted) {
    require(Boolean.TRUE.equals(termsAccepted), "Terms and conditions must be accepted");
  }

  /** Validate order can be modified (characteristics update allowed) */
  public void validateOrderModifiable(OrderEntity order) {
    OrderStatus status = OrderStatus.fromValue(order.getStatus());
    require(
        MODIFIABLE_STATUSES.contains(status),
        "Order " + order.getOrderNumber() + " cannot be modified in status: " + status);
  }

  /** Validate order is not cancelled */
  public void validateNotCancelled(OrderEntity order) {
    OrderStatus status = OrderStatus.fromValue(order.getStatus());
    require(
        status != OrderStatus.CANCELLED,
        "Cannot perform operation on cancelled order: " + order.getOrderNumber());
  }

  private void require(boolean condition, String message) {
    if (!condition) {
      throw new BadRequestException(message);
    }
  }
}
