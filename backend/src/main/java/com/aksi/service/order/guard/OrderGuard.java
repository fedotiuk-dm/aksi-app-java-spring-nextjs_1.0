package com.aksi.service.order.guard;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.branch.BranchEntity;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.order.ItemPhotoEntity;
import com.aksi.domain.order.OrderEntity;
import com.aksi.domain.order.OrderItemEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.repository.BranchRepository;
import com.aksi.repository.CartRepository;
import com.aksi.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

/**
 * Guard service for order domain validations and entity loading Centralizes all order-related
 * guards and entity retrieval
 */
@Service
@RequiredArgsConstructor
public class OrderGuard {

  private final OrderRepository orderRepository;
  private final CartRepository cartRepository;
  private final BranchRepository branchRepository;

  /**
   * Load order by ID or throw NotFoundException
   *
   * @param orderId order ID
   * @return order entity
   * @throws NotFoundException if order not found
   */
  public OrderEntity ensureExists(UUID orderId) {
    return orderRepository
        .findById(orderId)
        .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
  }

  /**
   * Find order item within order or throw NotFoundException
   *
   * @param order order entity
   * @param itemId item ID
   * @return order item entity
   * @throws NotFoundException if item not found
   */
  public OrderItemEntity ensureItemExists(OrderEntity order, UUID itemId) {
    return order.getItems().stream()
        .filter(item -> item.getId().equals(itemId))
        .findFirst()
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Order item " + itemId + " not found in order " + order.getOrderNumber()));
  }

  /**
   * Find photo within order item or throw NotFoundException
   *
   * @param orderItem order item entity
   * @param photoId photo ID
   * @return photo entity
   * @throws NotFoundException if photo not found
   */
  public ItemPhotoEntity ensurePhotoExists(OrderItemEntity orderItem, UUID photoId) {
    return orderItem.getPhotos().stream()
        .filter(photo -> photo.getId().equals(photoId))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Photo " + photoId + " not found in order item"));
  }

  /**
   * Load cart by ID or throw NotFoundException
   *
   * @param cartId cart ID
   * @return cart entity
   * @throws NotFoundException if cart not found
   */
  public CartEntity ensureCartExists(UUID cartId) {
    return cartRepository
        .findById(cartId)
        .orElseThrow(() -> new NotFoundException("Cart not found: " + cartId));
  }

  /**
   * Load branch by ID or throw NotFoundException
   *
   * @param branchId branch ID
   * @return branch entity
   * @throws NotFoundException if branch not found
   */
  public BranchEntity ensureBranchExists(UUID branchId) {
    return branchRepository
        .findById(branchId)
        .orElseThrow(() -> new NotFoundException("Branch not found: " + branchId));
  }

  /**
   * Load order by order number or throw NotFoundException
   *
   * @param orderNumber order number
   * @return order entity
   * @throws NotFoundException if order not found
   */
  public OrderEntity ensureExistsByNumber(String orderNumber) {
    return orderRepository
        .findByOrderNumber(orderNumber)
        .orElseThrow(() -> new NotFoundException("Order not found: " + orderNumber));
  }
}
