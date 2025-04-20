package com.aksi.service.order.impl;

import com.aksi.domain.client.entity.Client;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.order.entity.*;
import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.domain.pricing.entity.PriceListItem;
import com.aksi.domain.pricing.entity.ServiceCategory;
import com.aksi.domain.pricing.repository.PriceListItemRepository;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.dto.order.OrderCreateRequest;
import com.aksi.dto.order.OrderDto;
import com.aksi.dto.order.OrderItemCreateRequest;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.mapper.OrderItemMapper;
import com.aksi.mapper.OrderMapper;
import com.aksi.service.order.OrderService;
import com.aksi.service.order.PriceCalculationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

/**
 * Implementation of the OrderService interface.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ClientRepository clientRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PriceListItemRepository priceListItemRepository;
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final PriceCalculationService priceCalculationService;

    @Override
    @Transactional
    public OrderDto createOrder(OrderCreateRequest request) {
        log.info("Creating new order for client ID: {}", request.getClientId());
        
        // Find the client
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + request.getClientId()));
        
        // Create the order
        Order order = orderMapper.toEntity(request, client);
        
        // Generate a receipt number
        order.setReceiptNumber(generateReceiptNumber());
        
        // Set initial status
        order.setStatus(OrderStatus.CREATED);
        
        // Save the order
        order = orderRepository.save(order);
        log.info("Order created with ID: {} and receipt number: {}", order.getId(), order.getReceiptNumber());
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto updateOrder(UUID id, OrderCreateRequest request) {
        log.info("Updating order with ID: {}", id);
        
        // Find the order
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));
        
        // Find the client
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + request.getClientId()));
        
        // Update the order
        order = orderMapper.updateOrderFromRequest(request, order, client);
        
        // Recalculate totals
        priceCalculationService.recalculateOrderTotals(order);
        
        // Save the updated order
        order = orderRepository.save(order);
        log.info("Order updated with ID: {}", order.getId());
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderById(UUID id) {
        log.info("Getting order with ID: {}", id);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderByReceiptNumber(String receiptNumber) {
        log.info("Getting order with receipt number: {}", receiptNumber);
        
        Order order = orderRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with receipt number: " + receiptNumber));
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderByUniqueTag(String uniqueTag) {
        log.info("Getting order with unique tag: {}", uniqueTag);
        
        Order order = orderRepository.findByUniqueTag(uniqueTag)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with unique tag: " + uniqueTag));
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrders(Pageable pageable) {
        log.info("Getting all orders with pagination");
        
        Page<Order> ordersPage = orderRepository.findAll(pageable);
        return ordersPage.map(orderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> searchOrders(String searchTerm, Pageable pageable) {
        log.info("Searching orders with term: {}", searchTerm);
        
        Page<Order> ordersPage = orderRepository.searchByClientNameOrReceiptNumber(searchTerm, pageable);
        return ordersPage.map(orderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getOrdersByClient(UUID clientId, Pageable pageable) {
        log.info("Getting orders for client ID: {}", clientId);
        
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + clientId));
        
        Page<Order> ordersPage = orderRepository.findByClient(client, pageable);
        return ordersPage.map(orderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        log.info("Getting orders with status: {}", status);
        
        Page<Order> ordersPage = orderRepository.findByStatus(status, pageable);
        return ordersPage.map(orderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getOrdersByClientAndStatus(UUID clientId, OrderStatus status, Pageable pageable) {
        log.info("Getting orders for client ID: {} with status: {}", clientId, status);
        
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + clientId));
        
        Page<Order> ordersPage = orderRepository.findByClientAndStatus(client, status, pageable);
        return ordersPage.map(orderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getOrdersByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        log.info("Getting orders created between {} and {}", startDate, endDate);
        
        Page<Order> ordersPage = orderRepository.findByCreatedAtBetween(startDate, endDate, pageable);
        return ordersPage.map(orderMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDto> getOrdersByExpectedCompletionDate(LocalDate date, Pageable pageable) {
        log.info("Getting orders with expected completion date: {}", date);
        
        Page<Order> ordersPage = orderRepository.findByExpectedCompletionDate(date, pageable);
        return ordersPage.map(orderMapper::toDto);
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(UUID id, OrderStatus status) {
        log.info("Updating status of order ID: {} to {}", id, status);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));
        
        order.setStatus(status);
        order = orderRepository.save(order);
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto updateOrderUrgency(UUID id, UrgencyType urgencyType) {
        log.info("Updating urgency of order ID: {} to {}", id, urgencyType);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));
        
        order.setUrgencyType(urgencyType);
        
        // Recalculate the expected completion date based on urgency
        updateExpectedCompletionDate(order);
        
        // Recalculate totals
        priceCalculationService.recalculateOrderTotals(order);
        
        order = orderRepository.save(order);
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto updateOrderDiscount(UUID id, DiscountType discountType, Integer customDiscountPercentage) {
        log.info("Updating discount of order ID: {} to {} with custom percentage: {}", 
                id, discountType, customDiscountPercentage);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));
        
        order.setDiscountType(discountType);
        
        if (discountType == DiscountType.CUSTOM && customDiscountPercentage != null) {
            // Validate custom discount percentage
            if (customDiscountPercentage < 0 || customDiscountPercentage > 100) {
                throw new IllegalArgumentException("Custom discount percentage must be between 0 and 100");
            }
            order.setCustomDiscountPercentage(customDiscountPercentage);
        } else {
            order.setCustomDiscountPercentage(null);
        }
        
        // Recalculate totals
        priceCalculationService.recalculateOrderTotals(order);
        
        order = orderRepository.save(order);
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto updateOrderAmountPaid(UUID id, BigDecimal amountPaid) {
        log.info("Updating amount paid of order ID: {} to {}", id, amountPaid);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));
        
        order.setAmountPaid(amountPaid);
        order.setAmountDue(order.getTotalPrice().subtract(amountPaid));
        
        order = orderRepository.save(order);
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto addItemToOrder(UUID orderId, OrderItemCreateRequest request) {
        log.info("Adding item to order ID: {}", orderId);
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));
        
        // Find service category
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(request.getServiceCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Service category not found with ID: " + request.getServiceCategoryId()));
        
        // Find price list item
        PriceListItem priceListItem = priceListItemRepository.findById(request.getPriceListItemId())
                .orElseThrow(() -> new EntityNotFoundException("Price list item not found with ID: " + request.getPriceListItemId()));
        
        // Create the order item
        OrderItem orderItem = orderItemMapper.toEntity(request, order, serviceCategory, priceListItem);
        
        // Add the item to the order
        order.addItem(orderItem);
        
        // Update expected completion date if needed
        updateExpectedCompletionDate(order);
        
        // Calculate the final price for the item
        BigDecimal finalPrice = priceCalculationService.calculateFinalPrice(orderItem);
        orderItem.setFinalPrice(finalPrice);
        
        // Recalculate order totals
        priceCalculationService.recalculateOrderTotals(order);
        
        // Save the order
        order = orderRepository.save(order);
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto updateOrderItem(UUID orderId, UUID itemId, OrderItemCreateRequest request) {
        log.info("Updating item ID: {} in order ID: {}", itemId, orderId);
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));
        
        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Order item not found with ID: " + itemId));
        
        // Verify the item belongs to the order
        if (!orderItem.getOrder().getId().equals(orderId)) {
            throw new IllegalArgumentException("Item does not belong to the specified order");
        }
        
        // Find service category
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(request.getServiceCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Service category not found with ID: " + request.getServiceCategoryId()));
        
        // Find price list item
        PriceListItem priceListItem = priceListItemRepository.findById(request.getPriceListItemId())
                .orElseThrow(() -> new EntityNotFoundException("Price list item not found with ID: " + request.getPriceListItemId()));
        
        // Update the order item
        orderItem = orderItemMapper.updateOrderItemFromRequest(request, orderItem, serviceCategory, priceListItem);
        
        // Calculate the final price for the item
        BigDecimal finalPrice = priceCalculationService.calculateFinalPrice(orderItem);
        orderItem.setFinalPrice(finalPrice);
        
        // Recalculate order totals
        priceCalculationService.recalculateOrderTotals(order);
        
        // Save the order
        order = orderRepository.save(order);
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public OrderDto removeItemFromOrder(UUID orderId, UUID itemId) {
        log.info("Removing item ID: {} from order ID: {}", itemId, orderId);
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));
        
        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Order item not found with ID: " + itemId));
        
        // Verify the item belongs to the order
        if (!orderItem.getOrder().getId().equals(orderId)) {
            throw new IllegalArgumentException("Item does not belong to the specified order");
        }
        
        // Remove the item from the order
        order.removeItem(orderItem);
        
        // Update expected completion date if needed
        updateExpectedCompletionDate(order);
        
        // Recalculate order totals
        priceCalculationService.recalculateOrderTotals(order);
        
        // Save the order
        order = orderRepository.save(order);
        
        return orderMapper.toDto(order);
    }

    @Override
    public String generateReceiptNumber() {
        // Format: YYYYMM-XXXX where XXXX is a sequential number
        LocalDateTime now = LocalDateTime.now();
        String yearMonth = now.format(DateTimeFormatter.ofPattern("yyyyMM"));
        
        // Find the highest receipt number for the current year and month
        List<String> receiptNumbers = orderRepository.findHighestReceiptNumberForYearMonth(yearMonth);
        
        int sequentialNumber = 1;
        if (!receiptNumbers.isEmpty()) {
            String highestReceiptNumber = receiptNumbers.get(0);
            try {
                // Extract the sequential part
                String sequentialPart = highestReceiptNumber.split("-")[1];
                sequentialNumber = Integer.parseInt(sequentialPart) + 1;
            } catch (ArrayIndexOutOfBoundsException | NumberFormatException e) {
                log.warn("Could not parse the highest receipt number: {}, error: {}", highestReceiptNumber, e.getMessage());
                // Default to 1 if parsing fails
                sequentialNumber = 1;
            }
        }
        
        // Format the sequential part with leading zeros
        String sequentialPart = String.format("%04d", sequentialNumber);
        
        return yearMonth + "-" + sequentialPart;
    }

    @Override
    @Transactional
    public OrderDto addClientSignature(UUID id, String signatureBase64) {
        log.info("Adding client signature to order ID: {}", id);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));
        
        order.setClientSignature(signatureBase64);
        order = orderRepository.save(order);
        
        return orderMapper.toDto(order);
    }

    @Override
    @Transactional
    public void deleteOrder(UUID id) {
        log.info("Deleting order with ID: {}", id);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));
        
        orderRepository.delete(order);
    }
    
    /**
     * Updates the expected completion date based on the items and urgency of the order.
     * 
     * @param order The order to update
     */
    private void updateExpectedCompletionDate(Order order) {
        // Standard processing times
        int standardDaysForRegular = 2; // 48 hours
        int standardDaysForLeather = 14; // 14 days
        
        boolean hasLeatherItems = order.getItems().stream()
                .anyMatch(item -> {
                    if (item.getServiceCategory() == null) {
                        return false;
                    }
                    String categoryName = item.getServiceCategory().getName();
                    return categoryName != null && 
                           (categoryName.contains("LEATHER") || categoryName.contains("FUR"));
                });
        
        // Determine base processing days
        int processingDays = hasLeatherItems ? standardDaysForLeather : standardDaysForRegular;
        
        // Adjust for urgency
        if (order.getUrgencyType() == UrgencyType.HOURS_48) {
            processingDays = Math.min(processingDays, 2); // 48 hours max
        } else if (order.getUrgencyType() == UrgencyType.HOURS_24) {
            processingDays = Math.min(processingDays, 1); // 24 hours max
        }
        
        // Set the expected completion date
        LocalDate expectedCompletionDate = LocalDate.now().plusDays(processingDays);
        order.setExpectedCompletionDate(expectedCompletionDate);
    }
}
