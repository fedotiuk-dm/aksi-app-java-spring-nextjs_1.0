package com.aksi.domain.order.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.entity.CustomerSignatureEntity;

/**
 * Репозиторій для роботи з цифровими підписами клієнтів
 */
@Repository
public interface CustomerSignatureRepository extends JpaRepository<CustomerSignatureEntity, UUID> {
    
    /**
     * Знайти підпис за ID замовлення
     * 
     * @param orderId ID замовлення
     * @return опціональний підпис
     */
    Optional<CustomerSignatureEntity> findByOrderIdAndSignatureType(UUID orderId, String signatureType);
    
    /**
     * Знайти всі підписи для замовлення
     * 
     * @param orderId ID замовлення
     * @return список підписів
     */
    List<CustomerSignatureEntity> findAllByOrderId(UUID orderId);
} 