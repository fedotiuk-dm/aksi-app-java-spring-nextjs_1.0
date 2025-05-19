package com.aksi.domain.order.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.OrderStatusEnum;
import com.aksi.domain.order.service.order.OrderCompletionService;
import com.aksi.domain.order.service.order.OrderDraftService;
import com.aksi.domain.order.service.order.OrderFinancialService;
import com.aksi.domain.order.service.order.OrderItemManagementService;
import com.aksi.domain.order.service.order.OrderManagementService;
import com.aksi.domain.order.service.order.OrderStatusService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з замовленнями.
 * Делегує виконання спеціалізованим сервісам.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {
    
    private final OrderManagementService orderManagementService;
    private final OrderStatusService orderStatusService;
    private final OrderItemManagementService orderItemManagementService;
    private final OrderFinancialService orderFinancialService;
    private final OrderDraftService orderDraftService;
    private final OrderCompletionService orderCompletionService;
    
    @Override
    public List<OrderDTO> getAllOrders() {
        return orderManagementService.getAllOrders();
    }
    
    @Override
    public Optional<OrderDTO> getOrderById(UUID id) {
        return orderManagementService.getOrderById(id);
    }
    
    @Override
    public OrderDTO createOrder(CreateOrderRequest request) {
        return orderManagementService.createOrder(request);
    }
    
    @Override
    public OrderDTO updateOrderStatus(UUID id, OrderStatusEnum status) {
        return orderStatusService.updateOrderStatus(id, status);
    }
    
    @Override
    public void cancelOrder(UUID id) {
        orderStatusService.cancelOrder(id);
    }
    
    @Override
    public OrderDTO completeOrder(UUID id) {
        return orderStatusService.completeOrder(id);
    }
    
    @Override
    public OrderDTO saveOrderDraft(CreateOrderRequest request) {
        return orderDraftService.saveOrderDraft(request);
    }
    
    @Override
    public OrderDTO convertDraftToOrder(UUID id) {
        return orderDraftService.convertDraftToOrder(id);
    }
    
    @Override
    public OrderDTO applyDiscount(UUID id, BigDecimal discountAmount) {
        return orderFinancialService.applyDiscount(id, discountAmount);
    }
    
    @Override
    public OrderDTO addPrepayment(UUID id, BigDecimal prepaymentAmount) {
        return orderFinancialService.addPrepayment(id, prepaymentAmount);
    }
    
    @Override
    public List<OrderDTO> getActiveOrders() {
        return orderManagementService.getActiveOrders();
    }
    
    @Override
    public List<OrderDTO> getDraftOrders() {
        return orderDraftService.getDraftOrders();
    }
    
    @Override
    public OrderDTO calculateOrderTotal(OrderEntity order) {
        return orderFinancialService.calculateOrderTotal(order);
    }
    
    @Override
    public List<OrderItemDTO> getOrderItems(UUID orderId) {
        return orderItemManagementService.getOrderItems(orderId);
    }
    
    @Override
    public Optional<OrderItemDTO> getOrderItem(UUID orderId, UUID itemId) {
        return orderItemManagementService.getOrderItem(orderId, itemId);
    }
    
    @Override
    public OrderItemDTO addOrderItem(UUID orderId, OrderItemDTO itemDTO) {
        return orderItemManagementService.addOrderItem(orderId, itemDTO);
    }
    
    @Override
    public OrderItemDTO updateOrderItem(UUID orderId, UUID itemId, OrderItemDTO itemDTO) {
        return orderItemManagementService.updateOrderItem(orderId, itemId, itemDTO);
    }
    
    @Override
    public void deleteOrderItem(UUID orderId, UUID itemId) {
        orderItemManagementService.deleteOrderItem(orderId, itemId);
    }
    
    @Override
    public OrderDTO updateOrderCompletionParameters(UUID orderId, ExpediteType expediteType, LocalDateTime expectedCompletionDate) {
        return orderCompletionService.updateOrderCompletionParameters(orderId, expediteType, expectedCompletionDate);
    }
    
    @Override
    public OrderEntity findOrderEntityById(UUID id) {
        return orderManagementService.findOrderEntityById(id);
    }
    
    @Override
    public OrderDTO saveOrder(OrderEntity orderEntity) {
        return orderManagementService.saveOrder(orderEntity);
    }
}
