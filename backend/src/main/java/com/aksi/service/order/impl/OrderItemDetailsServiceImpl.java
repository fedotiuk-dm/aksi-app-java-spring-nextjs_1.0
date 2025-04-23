package com.aksi.service.order.impl;

import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemDefect;
import com.aksi.domain.order.entity.OrderItemStain;
import com.aksi.domain.order.repository.OrderItemDefectRepository;
import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.domain.order.repository.OrderItemStainRepository;
import com.aksi.dto.order.OrderItemDefectDto;
import com.aksi.dto.order.OrderItemStainDto;
import com.aksi.service.order.OrderItemDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Implementation of service for managing order item details like stains, defects, and risks.
 */
@Service
@RequiredArgsConstructor
public class OrderItemDetailsServiceImpl implements OrderItemDetailsService {

    private final OrderItemRepository orderItemRepository;
    private final OrderItemStainRepository orderItemStainRepository;
    private final OrderItemDefectRepository orderItemDefectRepository;

    @Override
    @Transactional
    public OrderItemStainDto addStainToItem(OrderItemStainDto stainDto) {
        // Перевірка наявності елемента замовлення
        OrderItem orderItem = orderItemRepository.findById(stainDto.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("Order item not found"));
        
        // Створення і збереження плями
        OrderItemStain stain = new OrderItemStain();
        BeanUtils.copyProperties(stainDto, stain);
        stain.setOrderItem(orderItem);
        
        OrderItemStain savedStain = orderItemStainRepository.save(stain);
        
        // Повернення DTO для збереженої плями
        OrderItemStainDto result = new OrderItemStainDto();
        BeanUtils.copyProperties(savedStain, result);
        result.setOrderItemId(orderItem.getId());
        
        return result;
    }

    @Override
    @Transactional
    public OrderItemDefectDto addDefectToItem(OrderItemDefectDto defectDto) {
        // Перевірка наявності елемента замовлення
        OrderItem orderItem = orderItemRepository.findById(defectDto.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("Order item not found"));
        
        // Створення і збереження дефекту
        OrderItemDefect defect = new OrderItemDefect();
        BeanUtils.copyProperties(defectDto, defect);
        defect.setOrderItem(orderItem);
        
        OrderItemDefect savedDefect = orderItemDefectRepository.save(defect);
        
        // Повернення DTO для збереженого дефекту
        OrderItemDefectDto result = new OrderItemDefectDto();
        BeanUtils.copyProperties(savedDefect, result);
        result.setOrderItemId(orderItem.getId());
        
        return result;
    }

    @Override
    @Transactional
    public void updateDefectNotes(UUID itemId, String notes) {
        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Order item not found"));
        
        orderItem.setDefectNotes(notes);
        orderItemRepository.save(orderItem);
    }

    @Override
    @Transactional
    public void updateNoWarrantyStatus(UUID itemId, Boolean noWarranty, String reason) {
        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Order item not found"));
        
        orderItem.setNoWarranty(noWarranty);
        
        // Встановлюємо причину тільки якщо "без гарантії" увімкнено
        if (Boolean.TRUE.equals(noWarranty)) {
            orderItem.setNoWarrantyReason(reason);
        } else {
            orderItem.setNoWarrantyReason(null);
        }
        
        orderItemRepository.save(orderItem);
    }
}
