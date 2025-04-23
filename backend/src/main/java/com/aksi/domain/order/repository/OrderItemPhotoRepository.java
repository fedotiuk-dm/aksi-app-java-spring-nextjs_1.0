package com.aksi.domain.order.repository;

import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for the OrderItemPhoto entity.
 */
@Repository
public interface OrderItemPhotoRepository extends JpaRepository<OrderItemPhoto, UUID> {
    
    /**
     * Find all photos for a specific order item.
     *
     * @param orderItem The order item
     * @return A list of photos
     */
    List<OrderItemPhoto> findByOrderItem(OrderItem orderItem);
    
    /**
     * Find all photos for a specific order item, ordered by upload date.
     *
     * @param orderItem The order item
     * @return A list of photos ordered by upload date
     */
    List<OrderItemPhoto> findByOrderItemOrderByUploadedAtDesc(OrderItem orderItem);
    
    /**
     * Delete all photos for a specific order item.
     *
     * @param orderItem The order item
     */
    void deleteByOrderItem(OrderItem orderItem);
    
    /**
     * Find all photos for a specific order item by its ID.
     *
     * @param itemId The order item ID
     * @return A list of photos
     */
    List<OrderItemPhoto> findByOrderItemId(UUID itemId);
}
