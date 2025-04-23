package com.aksi.domain.order.repository;

import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemDefect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for {@link OrderItemDefect} entities.
 */
@Repository
public interface OrderItemDefectRepository extends JpaRepository<OrderItemDefect, UUID> {
    
    /**
     * Find all defects for a specific order item.
     *
     * @param orderItem Order item to find defects for
     * @return List of defects for the order item
     */
    List<OrderItemDefect> findByOrderItem(OrderItem orderItem);
    
    /**
     * Find all defects for a specific order item by ID.
     *
     * @param orderItemId Order item ID to find defects for
     * @return List of defects for the order item
     */
    List<OrderItemDefect> findByOrderItemId(UUID orderItemId);
}
