package com.aksi.domain.order.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.AdditionalRequirementsRequest;
import com.aksi.domain.order.dto.AdditionalRequirementsResponse;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для роботи з додатковими вимогами та примітками до замовлення
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderRequirementsServiceImpl implements OrderRequirementsService {

    private final OrderRepository orderRepository;
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public AdditionalRequirementsResponse updateRequirements(AdditionalRequirementsRequest request) {
        log.debug("Оновлення додаткових вимог для замовлення: {}", request.getOrderId());
        
        OrderEntity order = getOrderById(request.getOrderId());
        
        // Оновлення додаткових вимог та приміток
        order.setAdditionalRequirements(request.getAdditionalRequirements());
        order.setCustomerNotes(request.getCustomerNotes());
        
        // Збереження замовлення
        OrderEntity savedOrder = orderRepository.save(order);
        
        return buildRequirementsResponse(savedOrder);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public AdditionalRequirementsResponse getRequirements(UUID orderId) {
        log.debug("Отримання додаткових вимог для замовлення: {}", orderId);
        
        OrderEntity order = getOrderById(orderId);
        
        return buildRequirementsResponse(order);
    }
    
    /**
     * Створює об'єкт відповіді з додатковими вимогами
     * 
     * @param order замовлення
     * @return відповідь з додатковими вимогами
     */
    private AdditionalRequirementsResponse buildRequirementsResponse(OrderEntity order) {
        return AdditionalRequirementsResponse.builder()
                .orderId(order.getId())
                .additionalRequirements(order.getAdditionalRequirements())
                .customerNotes(order.getCustomerNotes())
                .build();
    }
    
    /**
     * Отримати замовлення за ID
     * 
     * @param orderId ID замовлення
     * @return сутність замовлення
     * @throws EntityNotFoundException якщо замовлення не знайдено
     */
    private OrderEntity getOrderById(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId("Замовлення", orderId.toString()));
    }
} 