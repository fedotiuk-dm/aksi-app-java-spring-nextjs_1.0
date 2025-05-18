package com.aksi.domain.order.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.CustomerSignatureResponse;
import com.aksi.domain.order.entity.CustomerSignatureEntity;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.mapper.CustomerSignatureMapper;
import com.aksi.domain.order.repository.CustomerSignatureRepository;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для роботи з підписами клієнтів
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerSignatureServiceImpl implements CustomerSignatureService {

    private final CustomerSignatureRepository signatureRepository;
    private final OrderRepository orderRepository;
    private final CustomerSignatureMapper signatureMapper;

    @Override
    @Transactional
    public CustomerSignatureResponse saveSignature(CustomerSignatureRequest request) {
        log.info("Saving customer signature for order id: {}", request.getOrderId());
        
        OrderEntity order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> EntityNotFoundException.withId(request.getOrderId()));
                
        // Перевіряємо, чи існує вже підпис цього типу
        Optional<CustomerSignatureEntity> existingSignature = 
                signatureRepository.findByOrderIdAndSignatureType(
                        request.getOrderId(), request.getSignatureType());
        
        CustomerSignatureEntity signatureEntity;
        
        if (existingSignature.isPresent()) {
            // Оновлюємо існуючий підпис
            signatureEntity = existingSignature.get();
            signatureEntity.setSignatureData(request.getSignatureData());
            signatureEntity.setTermsAccepted(request.getTermsAccepted());
            signatureEntity.setSignatureType(request.getSignatureType());
        } else {
            // Створюємо новий підпис
            signatureEntity = CustomerSignatureEntity.builder()
                    .order(order)
                    .signatureData(request.getSignatureData())
                    .termsAccepted(request.getTermsAccepted())
                    .signatureType(request.getSignatureType())
                    .build();
        }
        
        CustomerSignatureEntity savedEntity = signatureRepository.save(signatureEntity);
        
        log.info("Customer signature saved/updated successfully with id: {}", savedEntity.getId());
        
        return signatureMapper.toResponse(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CustomerSignatureResponse> getSignatureById(UUID signatureId) {
        log.info("Retrieving signature by id: {}", signatureId);
        
        return signatureRepository.findById(signatureId)
                .map(signatureMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CustomerSignatureResponse> getSignatureByOrderIdAndType(UUID orderId, String signatureType) {
        log.info("Retrieving signature for order id: {} and type: {}", orderId, signatureType);
        
        return signatureRepository.findByOrderIdAndSignatureType(orderId, signatureType)
                .map(signatureMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerSignatureResponse> getAllSignaturesByOrderId(UUID orderId) {
        log.info("Retrieving all signatures for order id: {}", orderId);
        
        return signatureRepository.findAllByOrderId(orderId).stream()
                .map(signatureMapper::toResponse)
                .collect(Collectors.toList());
    }
} 