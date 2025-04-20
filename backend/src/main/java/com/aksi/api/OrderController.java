package com.aksi.api;

import com.aksi.domain.order.entity.DiscountType;
import com.aksi.domain.order.entity.OrderStatus;
import com.aksi.domain.order.entity.UrgencyType;
import com.aksi.dto.order.OrderCreateRequest;
import com.aksi.dto.order.OrderDto;
import com.aksi.dto.order.OrderItemCreateRequest;
import com.aksi.dto.order.ReceptionPointDTO;
import com.aksi.service.order.OrderService;
import com.aksi.service.order.ReceiptNumberGenerator;
import com.aksi.service.order.ReceptionPointService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * REST controller for Order operations.
 */
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Orders", description = "API for managing orders in the dry cleaning system")
public class OrderController {

    private final OrderService orderService;
    private final ReceiptNumberGenerator receiptNumberGenerator;
    private final ReceptionPointService receptionPointService;

    @PostMapping
    @Operation(summary = "Create a new order", description = "Creates a new order with the given details")
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderCreateRequest request) {
        log.info("REST request to create a new order for client");
        OrderDto result = orderService.createOrder(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    @Operation(summary = "Get all orders", description = "Returns a page of orders")
    public ResponseEntity<Page<OrderDto>> getAllOrders(Pageable pageable) {
        log.info("REST request to get all orders");
        Page<OrderDto> result = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Returns the order with the given ID")
    public ResponseEntity<OrderDto> getOrderById(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID id) {
        log.info("REST request to get order with ID: {}", id);
        OrderDto result = orderService.getOrderById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/receipt/{receiptNumber}")
    @Operation(summary = "Get order by receipt number", description = "Returns the order with the given receipt number")
    public ResponseEntity<OrderDto> getOrderByReceiptNumber(
            @Parameter(description = "Receipt number of the order", required = true)
            @PathVariable String receiptNumber) {
        log.info("REST request to get order with receipt number: {}", receiptNumber);
        OrderDto result = orderService.getOrderByReceiptNumber(receiptNumber);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/tag/{uniqueTag}")
    @Operation(summary = "Get order by unique tag", description = "Returns the order with the given unique tag")
    public ResponseEntity<OrderDto> getOrderByUniqueTag(
            @Parameter(description = "Unique tag of the order", required = true)
            @PathVariable String uniqueTag) {
        log.info("REST request to get order with unique tag: {}", uniqueTag);
        OrderDto result = orderService.getOrderByUniqueTag(uniqueTag);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    @Operation(summary = "Search for orders", description = "Returns a page of orders matching the search term")
    public ResponseEntity<Page<OrderDto>> searchOrders(
            @Parameter(description = "Search term")
            @RequestParam String term,
            Pageable pageable) {
        log.info("REST request to search orders with term: {}", term);
        Page<OrderDto> result = orderService.searchOrders(term, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Get orders by client", description = "Returns a page of orders for the given client")
    public ResponseEntity<Page<OrderDto>> getOrdersByClient(
            @Parameter(description = "ID of the client", required = true)
            @PathVariable UUID clientId,
            Pageable pageable) {
        log.info("REST request to get orders for client ID: {}", clientId);
        Page<OrderDto> result = orderService.getOrdersByClient(clientId, pageable);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Генерувати новий номер квитанції
     * @return номер квитанції у форматі YYMMDD-XXXX
     */
    @GetMapping("/generate-receipt-number")
    @Operation(summary = "Генерувати номер квитанції", 
              description = "Генерує унікальний номер квитанції у форматі YYMMDD-XXXX")
    public ResponseEntity<String> generateReceiptNumber() {
        log.info("REST запит на генерацію номера квитанції");
        String receiptNumber = receiptNumberGenerator.generateReceiptNumber();
        return ResponseEntity.ok(receiptNumber);
    }
    
    /**
     * Отримати всі активні пункти прийому замовлень
     * @return список активних пунктів прийому
     */
    @GetMapping("/reception-points")
    @Operation(summary = "Отримати активні пункти прийому", 
              description = "Повертає список активних пунктів прийому замовлень")
    public ResponseEntity<List<ReceptionPointDTO>> getActiveReceptionPoints() {
        log.info("REST запит на отримання активних пунктів прийому");
        List<ReceptionPointDTO> result = receptionPointService.getActiveReceptionPoints();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get orders by status", description = "Returns a page of orders with the given status")
    public ResponseEntity<Page<OrderDto>> getOrdersByStatus(
            @Parameter(description = "Status of the orders", required = true)
            @PathVariable OrderStatus status,
            Pageable pageable) {
        log.info("REST request to get orders with status: {}", status);
        Page<OrderDto> result = orderService.getOrdersByStatus(status, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/client/{clientId}/status/{status}")
    @Operation(summary = "Get orders by client and status", description = "Returns a page of orders for the given client with the given status")
    public ResponseEntity<Page<OrderDto>> getOrdersByClientAndStatus(
            @Parameter(description = "ID of the client", required = true)
            @PathVariable UUID clientId,
            @Parameter(description = "Status of the orders", required = true)
            @PathVariable OrderStatus status,
            Pageable pageable) {
        log.info("REST request to get orders for client ID: {} with status: {}", clientId, status);
        Page<OrderDto> result = orderService.getOrdersByClientAndStatus(clientId, status, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/period")
    @Operation(summary = "Get orders by date range", description = "Returns a page of orders created between the given dates")
    public ResponseEntity<Page<OrderDto>> getOrdersByPeriod(
            @Parameter(description = "Start date", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        log.info("REST request to get orders between {} and {}", startDate, endDate);
        Page<OrderDto> result = orderService.getOrdersByCreatedAtBetween(startDate, endDate, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/completion-date/{date}")
    @Operation(summary = "Get orders by expected completion date", description = "Returns a page of orders expected to be completed on the given date")
    public ResponseEntity<Page<OrderDto>> getOrdersByExpectedCompletionDate(
            @Parameter(description = "Expected completion date", required = true)
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Pageable pageable) {
        log.info("REST request to get orders with expected completion date: {}", date);
        Page<OrderDto> result = orderService.getOrdersByExpectedCompletionDate(date, pageable);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an order", description = "Updates the order with the given ID")
    public ResponseEntity<OrderDto> updateOrder(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID id,
            @Valid @RequestBody OrderCreateRequest request) {
        log.info("REST request to update order with ID: {}", id);
        OrderDto result = orderService.updateOrder(id, request);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/status/{status}")
    @Operation(summary = "Update order status", description = "Updates the status of the order with the given ID")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID id,
            @Parameter(description = "New status", required = true)
            @PathVariable OrderStatus status) {
        log.info("REST request to update status of order ID: {} to {}", id, status);
        OrderDto result = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/urgency/{urgencyType}")
    @Operation(summary = "Update order urgency", description = "Updates the urgency of the order with the given ID")
    public ResponseEntity<OrderDto> updateOrderUrgency(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID id,
            @Parameter(description = "New urgency type", required = true)
            @PathVariable UrgencyType urgencyType) {
        log.info("REST request to update urgency of order ID: {} to {}", id, urgencyType);
        OrderDto result = orderService.updateOrderUrgency(id, urgencyType);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/discount/{discountType}")
    @Operation(summary = "Update order discount", description = "Updates the discount of the order with the given ID")
    public ResponseEntity<OrderDto> updateOrderDiscount(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID id,
            @Parameter(description = "New discount type", required = true)
            @PathVariable DiscountType discountType,
            @Parameter(description = "Custom discount percentage (only for CUSTOM discount type)")
            @RequestParam(required = false) Integer customDiscountPercentage) {
        log.info("REST request to update discount of order ID: {} to {} with custom percentage: {}", 
                id, discountType, customDiscountPercentage);
        OrderDto result = orderService.updateOrderDiscount(id, discountType, customDiscountPercentage);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/payment/{amountPaid}")
    @Operation(summary = "Update order payment", description = "Updates the amount paid for the order with the given ID")
    public ResponseEntity<OrderDto> updateOrderPayment(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID id,
            @Parameter(description = "New amount paid", required = true)
            @PathVariable BigDecimal amountPaid) {
        log.info("REST request to update payment of order ID: {} to {}", id, amountPaid);
        OrderDto result = orderService.updateOrderAmountPaid(id, amountPaid);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/items")
    @Operation(summary = "Add item to order", description = "Adds an item to the order with the given ID")
    public ResponseEntity<OrderDto> addItemToOrder(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID id,
            @Valid @RequestBody OrderItemCreateRequest request) {
        log.info("REST request to add item to order ID: {}", id);
        OrderDto result = orderService.addItemToOrder(id, request);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{orderId}/items/{itemId}")
    @Operation(summary = "Update order item", description = "Updates an item in the order")
    public ResponseEntity<OrderDto> updateOrderItem(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID orderId,
            @Parameter(description = "ID of the item", required = true)
            @PathVariable UUID itemId,
            @Valid @RequestBody OrderItemCreateRequest request) {
        log.info("REST request to update item ID: {} in order ID: {}", itemId, orderId);
        OrderDto result = orderService.updateOrderItem(orderId, itemId, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{orderId}/items/{itemId}")
    @Operation(summary = "Remove item from order", description = "Removes an item from the order")
    public ResponseEntity<OrderDto> removeItemFromOrder(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID orderId,
            @Parameter(description = "ID of the item", required = true)
            @PathVariable UUID itemId) {
        log.info("REST request to remove item ID: {} from order ID: {}", itemId, orderId);
        OrderDto result = orderService.removeItemFromOrder(orderId, itemId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/signature")
    @Operation(summary = "Add client signature", description = "Adds a client signature to the order")
    public ResponseEntity<OrderDto> addClientSignature(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID id,
            @RequestBody String signatureBase64) {
        log.info("REST request to add client signature to order ID: {}", id);
        OrderDto result = orderService.addClientSignature(id, signatureBase64);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete order", description = "Deletes the order with the given ID")
    public ResponseEntity<Void> deleteOrder(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable UUID id) {
        log.info("REST request to delete order with ID: {}", id);
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }
}
