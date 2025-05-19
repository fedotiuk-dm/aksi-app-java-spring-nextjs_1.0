package com.aksi.domain.order.service.order;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.mapper.OrderMapper;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з параметрами виконання замовлення.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderCompletionServiceImpl implements OrderCompletionService {
    
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    
    @Override
    @Transactional
    public OrderDTO updateOrderCompletionParameters(
            UUID orderId, 
            ExpediteType expediteType, 
            LocalDateTime expectedCompletionDate) {
            
        log.debug("Оновлення параметрів виконання замовлення: {}", orderId);
        
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId(
                    "Замовлення не знайдено", orderId
                ));
        
        order.setExpediteType(expediteType);
        order.setExpectedCompletionDate(expectedCompletionDate);
        order.setUpdatedDate(LocalDateTime.now());
        
        // Перерахунок вартості замовлення (на випадок, якщо зміна типу експрес-обслуговування
        // впливає на вартість)
        order.recalculateTotalAmount();
        
        OrderEntity updatedOrder = orderRepository.save(order);
        log.info("Оновлено параметри виконання замовлення: {}", orderId);
        
        return orderMapper.toDTO(updatedOrder);
    }
} 
