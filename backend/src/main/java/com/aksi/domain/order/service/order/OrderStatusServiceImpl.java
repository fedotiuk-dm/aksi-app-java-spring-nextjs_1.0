package com.aksi.domain.order.service.order;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.mapper.OrderMapper;
import com.aksi.domain.order.model.OrderStatusEnum;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для управління статусами замовлень.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderStatusServiceImpl implements OrderStatusService {
    
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    
    @Override
    @Transactional
    public OrderDTO updateOrderStatus(UUID id, OrderStatusEnum status) {
        log.debug("Оновлення статусу замовлення {} на {}", id, status);
        
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", id
                ));
        
        order.setStatus(status);
        order.setUpdatedDate(LocalDateTime.now());
        
        if (status == OrderStatusEnum.COMPLETED) {
            order.setCompletedDate(LocalDateTime.now());
        }
        
        OrderEntity updatedOrder = orderRepository.save(order);
        log.info("Оновлено статус замовлення {} на {}", id, status);
        
        return orderMapper.toDTO(updatedOrder);
    }
    
    @Override
    @Transactional
    public void cancelOrder(UUID id) {
        log.debug("Скасування замовлення: {}", id);
        
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", id
                ));
        
        order.setStatus(OrderStatusEnum.CANCELLED);
        order.setUpdatedDate(LocalDateTime.now());
        
        orderRepository.save(order);
        log.info("Замовлення {} скасовано", id);
    }
    
    @Override
    @Transactional
    public OrderDTO completeOrder(UUID id) {
        log.debug("Відзначення замовлення як виконане: {}", id);
        
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", id
                ));
        
        order.setStatus(OrderStatusEnum.COMPLETED);
        order.setCompletedDate(LocalDateTime.now());
        order.setUpdatedDate(LocalDateTime.now());
        
        OrderEntity completedOrder = orderRepository.save(order);
        log.info("Замовлення {} відзначено як виконане", id);
        
        return orderMapper.toDTO(completedOrder);
    }
} 