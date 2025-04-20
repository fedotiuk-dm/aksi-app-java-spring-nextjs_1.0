package com.aksi.service.order;

import com.aksi.domain.order.entity.DiscountType;
import com.aksi.domain.order.entity.OrderStatus;
import com.aksi.domain.order.entity.UrgencyType;
import com.aksi.dto.order.OrderCreateRequest;
import com.aksi.dto.order.OrderDto;
import com.aksi.dto.order.OrderItemCreateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service interface for operations with orders.
 */
public interface OrderService {

    /**
     * Create a new order.
     *
     * @param request The order creation request
     * @return The created order DTO
     */
    OrderDto createOrder(OrderCreateRequest request);
    
    /**
     * Update an existing order.
     *
     * @param id The ID of the order to update
     * @param request The order update request
     * @return The updated order DTO
     */
    OrderDto updateOrder(UUID id, OrderCreateRequest request);
    
    /**
     * Get an order by ID.
     *
     * @param id The ID of the order
     * @return The order DTO
     */
    OrderDto getOrderById(UUID id);
    
    /**
     * Get an order by receipt number.
     *
     * @param receiptNumber The receipt number
     * @return The order DTO
     */
    OrderDto getOrderByReceiptNumber(String receiptNumber);
    
    /**
     * Get an order by unique tag.
     *
     * @param uniqueTag The unique tag
     * @return The order DTO
     */
    OrderDto getOrderByUniqueTag(String uniqueTag);
    
    /**
     * Get a page of orders.
     *
     * @param pageable Pagination information
     * @return A page of order DTOs
     */
    Page<OrderDto> getAllOrders(Pageable pageable);
    
    /**
     * Search for orders by client name or receipt number.
     *
     * @param searchTerm The search term
     * @param pageable Pagination information
     * @return A page of order DTOs
     */
    Page<OrderDto> searchOrders(String searchTerm, Pageable pageable);
    
    /**
     * Get orders for a specific client.
     *
     * @param clientId The client ID
     * @param pageable Pagination information
     * @return A page of order DTOs
     */
    Page<OrderDto> getOrdersByClient(UUID clientId, Pageable pageable);
    
    /**
     * Get orders with a specific status.
     *
     * @param status The status
     * @param pageable Pagination information
     * @return A page of order DTOs
     */
    Page<OrderDto> getOrdersByStatus(OrderStatus status, Pageable pageable);
    
    /**
     * Get orders by client and status.
     *
     * @param clientId The client ID
     * @param status The status
     * @param pageable Pagination information
     * @return A page of order DTOs
     */
    Page<OrderDto> getOrdersByClientAndStatus(UUID clientId, OrderStatus status, Pageable pageable);
    
    /**
     * Get orders created between two dates.
     *
     * @param startDate The start date
     * @param endDate The end date
     * @param pageable Pagination information
     * @return A page of order DTOs
     */
    Page<OrderDto> getOrdersByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    /**
     * Get orders expected to be completed on a specific date.
     *
     * @param date The expected completion date
     * @param pageable Pagination information
     * @return A page of order DTOs
     */
    Page<OrderDto> getOrdersByExpectedCompletionDate(LocalDate date, Pageable pageable);
    
    /**
     * Update the status of an order.
     *
     * @param id The ID of the order
     * @param status The new status
     * @return The updated order DTO
     */
    OrderDto updateOrderStatus(UUID id, OrderStatus status);
    
    /**
     * Update the urgency type of an order.
     *
     * @param id The ID of the order
     * @param urgencyType The new urgency type
     * @return The updated order DTO
     */
    OrderDto updateOrderUrgency(UUID id, UrgencyType urgencyType);
    
    /**
     * Update the discount type of an order.
     *
     * @param id The ID of the order
     * @param discountType The new discount type
     * @param customDiscountPercentage The custom discount percentage (only for CUSTOM discount type)
     * @return The updated order DTO
     */
    OrderDto updateOrderDiscount(UUID id, DiscountType discountType, Integer customDiscountPercentage);
    
    /**
     * Update the amount paid for an order.
     *
     * @param id The ID of the order
     * @param amountPaid The new amount paid
     * @return The updated order DTO
     */
    OrderDto updateOrderAmountPaid(UUID id, BigDecimal amountPaid);
    
    /**
     * Add an item to an order.
     *
     * @param orderId The ID of the order
     * @param request The item creation request
     * @return The updated order DTO
     */
    OrderDto addItemToOrder(UUID orderId, OrderItemCreateRequest request);
    
    /**
     * Update an item in an order.
     *
     * @param orderId The ID of the order
     * @param itemId The ID of the item
     * @param request The item update request
     * @return The updated order DTO
     */
    OrderDto updateOrderItem(UUID orderId, UUID itemId, OrderItemCreateRequest request);
    
    /**
     * Remove an item from an order.
     *
     * @param orderId The ID of the order
     * @param itemId The ID of the item
     * @return The updated order DTO
     */
    OrderDto removeItemFromOrder(UUID orderId, UUID itemId);
    
    /**
     * Generate a receipt number for a new order.
     *
     * @return A unique receipt number
     */
    String generateReceiptNumber();
    
    /**
     * Add a client signature to an order.
     *
     * @param id The ID of the order
     * @param signatureBase64 The client signature as a Base64 encoded string
     * @return The updated order DTO
     */
    OrderDto addClientSignature(UUID id, String signatureBase64);
    
    /**
     * Delete an order.
     *
     * @param id The ID of the order to delete
     */
    void deleteOrder(UUID id);
}
