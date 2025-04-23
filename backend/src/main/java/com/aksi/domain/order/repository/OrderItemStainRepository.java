package com.aksi.domain.order.repository;

import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemStain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for {@link OrderItemStain} entities.
 */
@Repository
public interface OrderItemStainRepository extends JpaRepository<OrderItemStain, UUID> {
    
    /**
     * Find all stains for a specific order item.
     *
     * @param orderItem Order item to find stains for
     * @return List of stains for the order item
     */
    List<OrderItemStain> findByOrderItem(OrderItem orderItem);
    
    /**
     * Find all stains for a specific order item by ID.
     *
     * @param orderItemId Order item ID to find stains for
     * @return List of stains for the order item
     */
    List<OrderItemStain> findByOrderItemId(UUID orderItemId);
}
