package com.aksi.service.order;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aksi.api.order.dto.AddPaymentRequest;
import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;
import com.aksi.api.order.dto.UploadItemPhotoRequest;
import com.aksi.domain.order.Order;

/** Service interface for managing orders */
public interface OrderService {

  /**
   * Create a new order from cart
   *
   * @param request Create order request
   * @return Created order info
   */
  OrderInfo createOrder(CreateOrderRequest request);

  /**
   * Get order by ID
   *
   * @param orderId Order ID
   * @return Order info
   */
  OrderInfo getOrder(UUID orderId);

  /**
   * Get order by order number
   *
   * @param orderNumber Order number
   * @return Order info
   */
  OrderInfo getOrderByNumber(String orderNumber);

  /**
   * List orders with filtering and pagination
   *
   * @param customerId Customer ID filter (optional)
   * @param status Order status filter (optional)
   * @param branchId Branch ID filter (optional)
   * @param dateFrom Creation date from filter (optional)
   * @param dateTo Creation date to filter (optional)
   * @param search General search query (optional)
   * @param pageable Pagination parameters
   * @return Page of orders
   */
  Page<OrderInfo> listOrders(
      UUID customerId,
      Order.OrderStatus status,
      UUID branchId,
      LocalDate dateFrom,
      LocalDate dateTo,
      String search,
      Pageable pageable);

  /**
   * Update order status
   *
   * @param orderId Order ID
   * @param request Update status request
   * @return Updated order info
   */
  OrderInfo updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request);

  /**
   * Update item characteristics, stains, defects, and risks
   *
   * @param orderId Order ID
   * @param itemId Order item ID
   * @param request Update characteristics request
   * @return Updated order item info
   */
  OrderItemInfo updateItemCharacteristics(
      UUID orderId, UUID itemId, UpdateItemCharacteristicsRequest request);

  /**
   * Upload photo for order item
   *
   * @param orderId Order ID
   * @param itemId Order item ID
   * @param request Upload photo request
   * @return Uploaded photo info
   */
  ItemPhotoInfo uploadItemPhoto(UUID orderId, UUID itemId, UploadItemPhotoRequest request);

  /**
   * Delete photo from order item
   *
   * @param orderId Order ID
   * @param itemId Order item ID
   * @param photoId Photo ID
   */
  void deleteItemPhoto(UUID orderId, UUID itemId, UUID photoId);

  /**
   * Get order receipt as PDF
   *
   * @param orderId Order ID
   * @return PDF content as byte array
   */
  byte[] getOrderReceipt(UUID orderId);

  /**
   * Add payment to order
   *
   * @param orderId Order ID
   * @param request Payment request
   * @return Added payment info
   */
  PaymentInfo addOrderPayment(UUID orderId, AddPaymentRequest request);

  /**
   * Check if order exists
   *
   * @param orderId Order ID
   * @return true if exists
   */
  boolean existsById(UUID orderId);

  /**
   * Generate unique order number
   *
   * @return Unique order number
   */
  String generateOrderNumber();

  /**
   * Check if order can be modified
   *
   * @param orderId Order ID
   * @return true if order can be modified
   */
  boolean canModifyOrder(UUID orderId);

  /**
   * Calculate order total amount
   *
   * @param orderId Order ID
   * @return Total amount in kopiykas
   */
  Integer calculateOrderTotal(UUID orderId);

  /**
   * Get customer's order history
   *
   * @param customerId Customer ID
   * @param pageable Pagination parameters
   * @return Page of customer orders
   */
  Page<OrderInfo> getCustomerOrderHistory(UUID customerId, Pageable pageable);

  /**
   * Get orders due for completion
   *
   * @param days Number of days ahead to check
   * @return List of orders due for completion
   */
  Page<OrderInfo> getOrdersDueForCompletion(int days, Pageable pageable);

  /**
   * Get overdue orders
   *
   * @param pageable Pagination parameters
   * @return Page of overdue orders
   */
  Page<OrderInfo> getOverdueOrders(Pageable pageable);
}