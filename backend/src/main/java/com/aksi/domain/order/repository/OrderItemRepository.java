package com.aksi.domain.order.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.entity.OrderItemEntity;

/**
 * Репозиторій для доступу до предметів замовлення.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemEntity, UUID> {
    
    /**
     * Знайти всі предмети для вказаного замовлення.
     * 
     * @param orderId ID замовлення
     * @return список предметів замовлення
     */
    List<OrderItemEntity> findByOrderId(UUID orderId);
    
    /**
     * Видалити всі предмети для вказаного замовлення.
     * 
     * @param orderId ID замовлення
     */
    void deleteByOrderId(UUID orderId);
}
