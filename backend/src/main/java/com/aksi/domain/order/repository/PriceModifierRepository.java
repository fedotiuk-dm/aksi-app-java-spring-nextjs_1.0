package com.aksi.domain.order.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.entity.OrderItemPriceModifierEntity;

/**
 * Репозиторій для роботи з модифікаторами ціни предметів замовлення.
 */
@Repository
public interface PriceModifierRepository extends JpaRepository<OrderItemPriceModifierEntity, UUID> {
    
    /**
     * Знаходить всі модифікатори ціни для конкретного предмета замовлення.
     * 
     * @param orderItemId ID предмета замовлення
     * @return список модифікаторів ціни
     */
    List<OrderItemPriceModifierEntity> findByOrderItemId(UUID orderItemId);
} 
