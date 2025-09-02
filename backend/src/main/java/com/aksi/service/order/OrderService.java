package com.aksi.service.order;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

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
   * @param file Photo file
   * @param photoType Photo type
   * @param photoDescription Photo description
   * @return Uploaded photo info
   */
  ItemPhotoInfo uploadItemPhoto(
      UUID orderId, UUID itemId, MultipartFile file, PhotoType photoType, String photoDescription);

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
   * Get customer's order history with page/size parameters
   *
   * @param customerId Customer ID
   * @param page Page number
   * @param size Page size
   * @param sortBy Sort field
   * @param sortOrder Sort order
   * @return OrderListResponse with customer orders
   */
  OrderListResponse getCustomerOrderHistory(
      UUID customerId, Integer page, Integer size, String sortBy, String sortOrder);

  /**
   * Get orders due for completion with page/size parameters
   *
   * @param days Number of days ahead to check
   * @param page Page number
   * @param size Page size
   * @param sortBy Sort field
   * @param sortOrder Sort order
   * @return OrderListResponse with orders due for completion
   */
  OrderListResponse getOrdersDueForCompletion(
      Integer days, Integer page, Integer size, String sortBy, String sortOrder);

  /**
   * Get overdue orders with page/size parameters
   *
   * @param page Page number
   * @param size Page size
   * @param sortBy Sort field
   * @param sortOrder Sort order
   * @return OrderListResponse with overdue orders
   */
  OrderListResponse getOverdueOrders(Integer page, Integer size, String sortBy, String sortOrder);

  /**
   * Get customer's recent orders without pagination (for quick access)
   *
   * @param customerId Customer ID
   * @param limit Maximum number of orders to return
   * @return List of recent orders
   */
  List<OrderInfo> getCustomerRecentOrders(UUID customerId, int limit);

  /**
   * Get order items for a specific order
   *
   * @param orderId Order ID
   * @return List of order items with full details
   */
  List<OrderItemInfo> getOrderItems(UUID orderId);

  /**
   * Get payment history for a specific order
   *
   * @param orderId Order ID
   * @return List of payments for the order
   */
  List<PaymentInfo> getOrderPayments(UUID orderId);

  /**
   * Save customer signature for order
   *
   * @param orderId Order ID
   * @param signatureBase64 Signature in base64 format
   * @return Updated order info
   */
  OrderInfo saveCustomerSignature(UUID orderId, String signatureBase64);

  /**
   * Get orders by status without pagination (for reports) - API version
   *
   * @param status Order status from API
   * @param branchId Branch ID (optional)
   * @return List of orders with specified status
   */
  List<OrderInfo> getOrdersByStatus(OrderStatus status, UUID branchId);

  /**
   * List orders with filtering and pagination using page/size
   *
   * @param page Page number (0-based)
   * @param size Page size
   * @param sortBy Field to sort by
   * @param sortOrder Sort order (asc/desc)
   * @param customerId Customer ID filter (optional)
   * @param status Order status filter (optional)
   * @param branchId Branch ID filter (optional)
   * @param dateFrom Creation date from filter (optional)
   * @param dateTo Creation date to filter (optional)
   * @param orderNumber Order number filter (optional)
   * @return OrderListResponse with pagination info
   */
  OrderListResponse listOrders(
      Integer page,
      Integer size,
      String sortBy,
      String sortOrder,
      UUID customerId,
      OrderStatus status,
      UUID branchId,
      Instant dateFrom,
      Instant dateTo,
      String orderNumber);
}
